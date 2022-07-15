const { SitemapStream, streamToPromise } = require("sitemap");
const { Readable } = require("stream");

export default async (req, res) => {
  // An array with your links
  const links = [
    { url: "/formation", changefreq:"monthly" , priority: 1 },
    { url: "/qui/comite", changefreq:"monthly" , priority: 1 },
    { url: "/qui/complexe", changefreq:"monthly" , priority: 1 },
    { url: "/qui/entraineurs", changefreq:"monthly" , priority: 1 },
    { url: "/qui/historique", changefreq:"monthly" , priority: 1 },
    { url: "/partenaires/dossier_sponsor", changefreq:"monthly" , priority: 1 },
    { url: "/partenaires/info", changefreq:"monthly" , priority: 1 },
    { url: "/partenaires/mecenat", changefreq:"monthly" , priority: 1 },
    { url: "/actus/actuRUCB", changefreq:"monthly" , priority: 1 },
    { url: "/actus/vacances", changefreq:"monthly" , priority: 1 },
    
    
  ];

  // Create a stream to write to
  const stream = new SitemapStream({ hostname: `https://${req.headers.host}` });
  res.writeHead(200, {
    "Content-Type": "application/xml",
  });

  const xmlString = await streamToPromise(
    Readable.from(links).pipe(stream)
  ).then((data) => data.toString());

  res.end(xmlString);
};