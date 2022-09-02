
import Link from "next/link";
import React from "react";
import { Button } from "react-bootstrap";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import useAnalyticsEventTracker from "../src/useAnalyticsEventTracker";

export default function BandeauIMG() {
  const [articlesJSON, setArticlesJSON] = React.useState<any>([]);

  React.useEffect(()=>{
    async function loadData(){
      const dataDB =  await fetch("/api/loadData",{
       method: "POST",
       body: "ImagesDeroulanteAccueil",
     }).then((result: any) => result.json());
     
     setArticlesJSON(dataDB.data)
   }
   loadData();
  },[]);

  return(
  <Carousel autoPlay  infiniteLoop={true} interval={4000} className="Bandeau">
    {articlesJSON.map((article: any, index:number) =>{
        const gaEventTracker = useAnalyticsEventTracker(article.titre);
              return (
                <div key={index}>
                  <img src={article.image} />
                  <p className="title" style={{color:`${article.colorText}`}}>{article.titre}</p>
                  <Button id="buttonSlide" onClick={()=>gaEventTracker('click')} style={{color:`${article.colorTextButton}`,backgroundColor:`${article.colorBackgroundButton}`}}href={article.lienPage}>Cliquez ici</Button>
                </div>
              );
            })}
  </Carousel>);
}
