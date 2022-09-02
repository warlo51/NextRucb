import '../styles/globals.css'
import { useEffect } from 'react'
import type { AppProps } from 'next/app'
import Head from 'next/head'
import { useRouter } from 'next/router'
import * as ga from '../lib/ga'

 

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();
  useEffect(() => {
    const handleRouteChange = (url: string) => {
      ga.pageview(url)
    }
    //When the component is mounted, subscribe to router changes
    //and log those page views
    router.events.on('routeChangeComplete', handleRouteChange)

    // If the component is unmounted, unsubscribe
    // from the event with the `off` method
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange)
    }
  }, [router.events])
  return <div>
      <Head>
        <title>RUCB Basket</title>
        <meta name="description" content="Site web du RUCB, club de basket REIMS"/>
        <link rel="icon" type="image/png" sizes="32x32" href="../logoruc.ico"></link>
         {/* Global Site Tag (gtag.js) - Google Analytics */}
         <script
            async
            src={`https://www.googletagmanager.com/gtag/js?id=${process.env.TRACKING_ID}`}
          />
          <script
            dangerouslySetInnerHTML={{
              __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${process.env.TRACKING_ID}', {
              page_path: window.location.pathname,
            });
          `,
            }}
          />
      </Head>
      <Component {...pageProps} />
    </div>
}

export default MyApp
