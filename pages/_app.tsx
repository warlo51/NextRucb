import '../styles/globals.css'

import type { AppProps } from 'next/app'
import Head from 'next/head'
import ReactGA from 'react-ga';

 

function MyApp({ Component, pageProps }: AppProps) {
  ReactGA.initialize(`${process.env.TRACKING_ID}`);
  return <div>
      <Head>
        <title>RUCB Basket</title>
        
        <meta name="description" content="Site web du RUCB, club de basket REIMS"/>
        <link rel="icon" type="image/png" sizes="32x32" href="../logoruc.ico"></link>
      </Head>
      <Component {...pageProps} />
    </div>
}

export default MyApp
