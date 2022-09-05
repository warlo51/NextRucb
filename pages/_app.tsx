import '../styles/globals.css'
import type { AppProps } from 'next/app'
import Head from 'next/head'
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
 

function MyApp({ Component, pageProps }: AppProps) {
  
  const firebaseConfig = {
    apiKey: "AIzaSyC2xn3enhRvBpbx5Wd5EZ-Vp0XQok3DcLI",
    authDomain: "rucb-basket-firebase.firebaseapp.com",
    projectId: "rucb-basket-firebase",
    storageBucket: "rucb-basket-firebase.appspot.com",
    messagingSenderId: "307979119515",
    appId: "1:307979119515:web:e1b1ca2a20433176a8cf3e",
    measurementId: "G-2C504YHSQB"
  };
  const app = initializeApp(firebaseConfig);
  const analytics = getAnalytics(app);
  return <div>
      <Head>
        <title>RUCB Basket</title>
        <meta name="description" content="Site web du RUCB, club de basket REIMS"/>
        <link rel="icon" type="image/png" sizes="32x32" href="../logoruc.ico"></link>
        <script type="module">
  
</script>
      </Head>
      <Component {...pageProps} />
    </div>
}

export default MyApp
