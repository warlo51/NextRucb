import '../styles/globals.css'
import "../styles/lignes.css"
import type { AppProps } from 'next/app'
import Head from 'next/head'
import { SSRProvider } from 'react-bootstrap'


function MyApp({ Component, pageProps }: AppProps) {
  return <SSRProvider><div>
      <Head>
        <title>RUCB Basket</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content="Site web du RUCB, club de basket REIMS"/>
        <link rel="icon" type="image/png" sizes="32x32" href="../logoruc.ico"></link>
        <script type="module">

</script>
      </Head>
      <Component {...pageProps} />
    </div></SSRProvider>
}

export default MyApp
