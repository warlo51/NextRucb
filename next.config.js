/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // URL interne stable vers la boutique externe : si le prestataire change,
  // seule cette ligne bouge (302 volontaire, une 301 serait mise en cache).
  async redirects() {
    return [
      {
        source: "/boutique",
        destination: "https://dn-com.fr/categorie-produit/clubs/rucb/",
        permanent: false,
      },
    ]
  },
}

module.exports = nextConfig
