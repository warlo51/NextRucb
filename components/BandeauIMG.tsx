
import React from "react";
import { Button } from "react-bootstrap";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import client from "../src/client";
import urlFor from "../src/fonctions/urlImageSanity";

export default function BandeauIMG() {
  const [articlesJSON, setArticlesJSON] = React.useState<any>([]);

  React.useEffect(()=>{
    async function loadData(){
        const imagesPageAccueil = await client.fetch(
            `*[_type == "imagesPageAccueil" && active == "Oui"]`
        )
        setArticlesJSON(imagesPageAccueil.map((imageAccueil: any) => {
            return {
                ...imageAccueil,
                image: imageAccueil.image ? urlFor(imageAccueil.image).url() : ""
            }
        }))
   }
   loadData();
  },[]);

  return(
  <Carousel autoPlay  infiniteLoop={true} interval={4000} className="Bandeau">
    {articlesJSON.map((article: any, index:number) =>{
          return (
            <div key={index}>
              <img id="imageSlide" src={article.image} />
              <p className="title" style={{color:`${article.colorTexte.hex}`}}>{article.titre}</p>
              <Button id="buttonSlide" style={{color:`${article.colorTextButton.hex}`,backgroundColor:`${article.colorBackgroundButton.hex}`}}href={article?.linkArticle?._ref ? `/actus/${article?.linkArticle?._ref}` : "/actus"}>Cliquez ici</Button>
            </div>
          );

            })}
  </Carousel>);
}
