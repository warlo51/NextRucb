// Gestion des comptes admin — réservée aux superadmins.
//
// Créer / supprimer un utilisateur Supabase Auth exige la clé `service_role`,
// qui ne doit JAMAIS atteindre le navigateur : tout passe donc par cette route
// server-side. L'appelant s'authentifie avec son access token Supabase
// (header Authorization: Bearer …) et doit être superadmin dans `admin_profile`.
//
// Env requis (jamais préfixé NEXT_PUBLIC_) :
//   SUPABASE_SERVICE_ROLE_KEY=<Project Settings → API → service_role>
import type { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';
import { SECTION_KEYS } from '../../../lib/adminSections';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

const admin = createClient(url, serviceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

/** Vérifie le bearer token et renvoie l'id de l'appelant s'il est superadmin. */
async function requireSuperadmin(req: NextApiRequest): Promise<{ id: string } | null> {
  const token = (req.headers.authorization || '').replace(/^Bearer\s+/i, '');
  if (!token) return null;

  const { data, error } = await admin.auth.getUser(token);
  if (error || !data?.user) return null;

  const { data: profile } = await admin
    .from('admin_profile')
    .select('role, actif')
    .eq('user_id', data.user.id)
    .maybeSingle();

  if (!profile || !profile.actif || profile.role !== 'superadmin') return null;
  return { id: data.user.id };
}

/** N'accepte que des clés de sections connues, et rien pour un superadmin. */
function cleanSections(sections: unknown, role: string): string[] {
  if (role === 'superadmin') return [];
  if (!Array.isArray(sections)) return [];
  return sections.filter((s): s is string => typeof s === 'string' && SECTION_KEYS.includes(s));
}

function cleanRole(role: unknown): 'superadmin' | 'editeur' {
  return role === 'superadmin' ? 'superadmin' : 'editeur';
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!url || !serviceKey) {
    return res.status(500).json({
      error: 'SUPABASE_SERVICE_ROLE_KEY manquante — ajoute-la dans .env.local puis sur Vercel.',
    });
  }

  const caller = await requireSuperadmin(req);
  if (!caller) return res.status(403).json({ error: 'Accès réservé aux superadmins.' });

  try {
    // ---- Liste des admins (+ dernière connexion) ----
    if (req.method === 'GET') {
      const { data: profiles, error } = await admin
        .from('admin_profile')
        .select('*')
        .order('created_at');
      if (error) throw error;

      const { data: list } = await admin.auth.admin.listUsers({ page: 1, perPage: 200 });
      const lastSignIn: Record<string, string | null> = {};
      (list?.users || []).forEach((u: any) => { lastSignIn[u.id] = u.last_sign_in_at ?? null; });

      return res.status(200).json({
        users: (profiles || []).map((p: any) => ({ ...p, last_sign_in_at: lastSignIn[p.user_id] ?? null })),
      });
    }

    // ---- Création d'un admin ----
    if (req.method === 'POST') {
      const { email, password, nom, role, sections } = req.body || {};
      if (!email || !password) return res.status(400).json({ error: 'Email et mot de passe requis.' });
      if (String(password).length < 8) return res.status(400).json({ error: 'Mot de passe : 8 caractères minimum.' });

      const wanted = cleanRole(role);
      const { data: created, error: createErr } = await admin.auth.admin.createUser({
        email: String(email).trim().toLowerCase(),
        password: String(password),
        email_confirm: true, // pas de mail de confirmation : le compte est utilisable tout de suite
      });
      if (createErr) return res.status(400).json({ error: createErr.message });

      const { error: profErr } = await admin.from('admin_profile').insert({
        user_id: created.user.id,
        email: created.user.email,
        nom: nom ? String(nom) : null,
        role: wanted,
        sections: cleanSections(sections, wanted),
        actif: true,
      });
      if (profErr) {
        // On ne laisse pas un compte Auth orphelin sans droits derrière nous.
        await admin.auth.admin.deleteUser(created.user.id);
        return res.status(400).json({ error: profErr.message });
      }

      return res.status(201).json({ user_id: created.user.id });
    }

    // ---- Modification (droits, nom, activation, mot de passe) ----
    if (req.method === 'PATCH') {
      const { user_id, nom, role, sections, actif, password } = req.body || {};
      if (!user_id) return res.status(400).json({ error: 'user_id requis.' });

      if (password) {
        if (String(password).length < 8) return res.status(400).json({ error: 'Mot de passe : 8 caractères minimum.' });
        const { error } = await admin.auth.admin.updateUserById(String(user_id), { password: String(password) });
        if (error) return res.status(400).json({ error: error.message });
      }

      const patch: any = {};
      if (nom !== undefined) patch.nom = nom ? String(nom) : null;
      if (actif !== undefined) patch.actif = !!actif;
      if (role !== undefined || sections !== undefined) {
        const wanted = role !== undefined ? cleanRole(role) : undefined;
        if (wanted !== undefined) patch.role = wanted;
        if (sections !== undefined) {
          // Si le rôle n'est pas modifié ici, on relit celui en base pour
          // décider si les sections ont encore un sens.
          let effective = wanted;
          if (effective === undefined) {
            const { data: cur } = await admin.from('admin_profile').select('role').eq('user_id', user_id).maybeSingle();
            effective = cleanRole(cur?.role);
          }
          patch.sections = cleanSections(sections, effective);
        } else if (wanted === 'superadmin') {
          patch.sections = [];
        }
      }

      if (Object.keys(patch).length) {
        // Le trigger SQL admin_profile_guard refuse de retirer les droits
        // du dernier superadmin actif : son message remonte tel quel.
        const { error } = await admin.from('admin_profile').update(patch).eq('user_id', user_id);
        if (error) return res.status(400).json({ error: error.message });
      }

      return res.status(200).json({ ok: true });
    }

    // ---- Suppression ----
    if (req.method === 'DELETE') {
      const { user_id } = req.body || {};
      if (!user_id) return res.status(400).json({ error: 'user_id requis.' });
      if (user_id === caller.id) return res.status(400).json({ error: 'Impossible de supprimer son propre compte.' });

      // La suppression du compte Auth cascade sur admin_profile ; si c'est le
      // dernier superadmin, le trigger fait échouer l'opération.
      const { error } = await admin.auth.admin.deleteUser(String(user_id));
      if (error) return res.status(400).json({ error: error.message });
      return res.status(200).json({ ok: true });
    }

    res.setHeader('Allow', 'GET, POST, PATCH, DELETE');
    return res.status(405).json({ error: 'Méthode non autorisée.' });
  } catch (e: any) {
    return res.status(500).json({ error: e?.message || 'Erreur serveur.' });
  }
}
