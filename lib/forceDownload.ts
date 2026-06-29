// Force le téléchargement d'un fichier. L'attribut HTML `download` est ignoré
// en cross-origin (le fichier est servi depuis le domaine Supabase Storage),
// on passe donc par un blob local. Repli : ouverture dans un nouvel onglet.
export async function forceDownload(url: string, filename: string): Promise<void> {
  try {
    const res = await fetch(url);
    const blob = await res.blob();
    const objectUrl = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = objectUrl;
    a.download = filename || "document.pdf";
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(objectUrl);
  } catch {
    window.open(url, "_blank");
  }
}
