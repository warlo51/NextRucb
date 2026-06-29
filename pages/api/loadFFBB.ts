import type { NextApiRequest, NextApiResponse } from 'next'
import iconv from "iconv-lite";
import { XMLParser } from "fast-xml-parser";

// Récupère le flux RSS FFBB (encodé en ISO-8859-1) et le renvoie sous la forme
// { data: [{ title, link, description }, ...] } pour la carte "Actu FFBB" de la home.
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const url = "https://www.ffbb.com/rss2.xml";

  // Renvoie la valeur texte d'un noeud, qu'il soit une chaîne ou un objet { #text }.
  const textOf = (node: any): string => {
    if (node == null) return "";
    if (typeof node === "object") return String(node["#text"] ?? "");
    return String(node);
  };

  try {
    const response = await fetch(url);
    const buffer = await response.arrayBuffer();
    // Décodage explicite ISO-8859-1 (le flux n'est pas en UTF-8).
    const text = iconv.decode(Buffer.from(buffer), "iso-8859-1");

    // fast-xml-parser tolère les entités non échappées et fusionne le CDATA
    // (description) dans la valeur du noeud — pas besoin des bidouilles d'échappement.
    const parser = new XMLParser({ ignoreAttributes: true, trimValues: true });
    const parsed: any = parser.parse(text);

    const rawItems = parsed?.rss?.channel?.item ?? [];
    const items = Array.isArray(rawItems) ? rawItems : [rawItems];

    const formatData = items.map((item: any) => ({
      title: textOf(item.title),
      link: textOf(item.link),
      description: textOf(item.description),
    }));

    res.status(200).send({ data: formatData });
  } catch (error) {
    console.log("Error fetching the FFBB feed: ", error);
    res.status(200).send({ data: [] });
  }
}
