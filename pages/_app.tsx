import '../styles/globals.css'

import type { AppProps } from 'next/app'
import Head from 'next/head'


function MyApp({ Component, pageProps }: AppProps) {
  return <div>
      <Head>
        <title>RUCB Basket</title>
        <meta name="google-site-verification" content="g-JktWG1_hWPLXMEXwsoblRJTiPvWl8QbmLFIvt_8aU" />
      </Head>
      <Component {...pageProps} />
    </div>
}

export default MyApp
