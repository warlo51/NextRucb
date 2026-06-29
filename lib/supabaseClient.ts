import { createClient } from '@supabase/supabase-js';

// Variables à définir dans .env.local (et chez l'hébergeur) :
//   NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
//   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
// Les valeurs de repli évitent un crash au build tant que l'env n'est pas
// configuré ; les requêtes réelles n'aboutissent qu'avec les vraies clés.
const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-anon-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
