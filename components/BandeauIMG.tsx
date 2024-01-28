
import React from "react";
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import client from "../src/client";
import urlFor from "../src/fonctions/urlImageSanity";
import { Button } from "react-bootstrap";

export default function BandeauIMG() {
  const [articlesJSON, setArticlesJSON] = React.useState<any>([]);
  const [indexImage, setIndexImage] = React.useState<any>(0);

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



    React.useEffect(() => {
        const timer = setInterval(() => {
            if(indexImage+1 === articlesJSON.length) {
                setIndexImage(0)
            } else {
                setIndexImage(indexImage+1)
            }
        }, 4000);

        return () => {
            clearInterval(timer);
        };
    }, [indexImage, 4000, articlesJSON]);

  function previousImage(){
      if(indexImage-1 === -1) {
          setIndexImage(articlesJSON.length-1)
      } else {
          setIndexImage(indexImage-1)
      }
  }

    function nextImage(){
        if(indexImage+1 === articlesJSON.length) {
            setIndexImage(0)
        } else {
            setIndexImage(indexImage+1)
        }
    }

  return(
      <div className="containerSectionBandeau"><section className="sectionBandeau">
          <button className="bandeau-button prev" onClick={previousImage}><ArrowBackIosIcon/></button>
          <button className="bandeau-button next" onClick={nextImage}><ArrowForwardIosIcon/></button>
          <div className="bandeau">
              <ul>
                  {articlesJSON.map((article: any, index:number) =>{
                      return (
                          <a
                              href={article?.linkArticle?._ref ? `/actus/${article?.linkArticle?._ref}` : "/actus"}
                          >
                              <li className={indexImage===index ? "slideTest" : "slide"} key={index}>
                              <img src={article.image} alt=""/>
                              </li>
                          </a>);
                  })}
              </ul>
          </div>
          {articlesJSON.map((article: any, index:number) =>{
              return (
                  <div className={indexImage===index ? "bandeauBottomActive" : "bandeauBottom"} key={index}>
                      <p className="titleBandeau" style={{color:`${article.colorTexte.value}`}}>{article.titre}</p>
                      <Button
                          className="buttonSlide"
                          style={{
                              color:`${article.colorTextButton.value}`,
                              borderRadius: "50px",
                              position: "absolute",
                              backgroundColor:`${article.colorBackgroundButton.value}`}}
                          href={article?.linkArticle?._ref ? `/actus/${article?.linkArticle?._ref}` : "/actus"}
                      >
                          Cliquez ici
                      </Button>
                  </div>);
          })}
      </section></div>);
}
