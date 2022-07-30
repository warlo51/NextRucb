import { Badge, Box, CardContent, Typography } from "@mui/material";
import { Accordion, Button, Col, Dropdown, Form, Row } from "react-bootstrap";
import React, { useEffect, useState } from "react";
import jwt_decode from "jwt-decode";
import { GetServerSideProps } from "next";
import { ColorPicker, useColor } from "react-color-palette";
import "react-color-palette/lib/css/styles.css";

export const getServerSideProps: GetServerSideProps = async (context) =>{
  const accessTokken = context.req.cookies.AccessToken;
  let decoded: any;
  let profile;

  if (accessTokken === undefined) {
    decoded = null;
  } else {
    try{
    decoded = jwt_decode(accessTokken);
    }catch(error){
      decoded = null
    }
  }

  return {
    props: {
      decoded: decoded
    }
  };
}

export default function Administration(props: any) {

    const [dataReceive, setData] = useState<any>([]);
    const [select, setSelect] = useState("");
    const [nom, setNom] = useState("");
    const [telephone, setTelephone] = useState("");
    const [mail, setMail] = useState("");
    const [titre, setTitre] = useState("");
    const [lienPage, setLienPage] = useState("");
    const [image, setImage] = useState<any>([]);
    const [video, setVideo] = useState("");
    const [colorTitre, setColorTitre] = useState("");
    const [colorBackgroundButton, setColorBackgroundButton] = useState("");
    const [colorTextButton, setColorTextButton] = useState("");
    const [colorText, setColorText] = useState("");
    const [contenu, setContenu] = useState("");
    const [messageValidation, setMessageValidation] = useState(<></>);
    const [modificationStatut, setModificationStatut] = useState({statut:false, index: 0});

    const handleClick = (index: number) => {
      dataReceive[index] = {...dataReceive[index],color:"#a17c38"};
      setModificationStatut({statut: true, index: index})
    };

    async function loadData(event: any){
       const dataDB =  await fetch("/api/loadData",{
        method: "POST",
        body: event,
      }).then((result: any) => result.json());
      setSelect(event);
      setData([]) 
        setTimeout(() => {
          setData(dataDB.data) 
        }, 100);  
    }

    async function fileSelectedHandler(event:any, imagesDB: any, index:number){
      const file = event.target.files[0];
      const base64 = await convertBase64(file);
      const arrayImages = imagesDB;
      arrayImages.push(base64);
      setImage(arrayImages);
      handleClick(index)
    }
    
    function convertBase64(file: any){
      return new Promise((resolve: any, reject: any) => {
        const fileReader = new FileReader();
        fileReader.readAsDataURL(file);

        fileReader.onload = () => {
          resolve(fileReader.result)
        }
        fileReader.onerror = (error) => {
          reject(error);
        }
      });
    }

    function addArticle(){
      if(select === "Comite" || select === "Entraineurs"){
        dataReceive.push({"nom":"", "telephone": "", "mail": "","color":"red", "colorTitre":"#dc8d32"})
        setData([]) 
        setTimeout(() => {
          setData(dataReceive) 
        }, 500);     
      }else if (select === "Historique" || select === "Vacances" || select === "Mecenat"){
        dataReceive.push({"titre": "Titre","contenu": "", "image": [],"color":"red","colorTitre":"#dc8d32"})   
        setData([]) 
        setTimeout(() => {
          setData(dataReceive) 
        }, 500);  
       
      }else if (select === "Formation"){
        dataReceive.push({"titre": "Titre","contenu": "", "video": "coller url video","color":"red","colorTitre":"#dc8d32"})   
        setData([]) 
        setTimeout(() => {
          setData(dataReceive) 
        }, 500);
      }
      else if (select === "ImagesDeroulanteAccueil"){
        dataReceive.push({"titre": "Titre","lienPage": "lien page", "image": [],"color":"red","colorTextButton":"#FFFFFF","colorText":"#FFFFFF","colorBackgroundButton":"#3d1e7b"})   
        setData([]) 
        setTimeout(() => {
          setData(dataReceive) 
        }, 500);
      }
    }
 
    function suppresion(index: number){
      dataReceive.splice(index,1);
      setData([])
        setTimeout(() => {
          setData(dataReceive) 
        }, 500);
    }

    function modification(index: number, data: any){
      dataReceive[index] = {...data,color:"#388d39"};
      setData([])
        setTimeout(() => {
          setData(dataReceive);
          setImage([]);
          setModificationStatut({statut: false, index: index})
        }, 500);
        setMessageValidation(<h2>Modifications effectuées ! Pensez à sauvegarder</h2>)
        setTimeout(() => {
          setMessageValidation(<></>)
        }, 2000);
    }

    async function addIntoDb(){
      const dataDB =  await fetch("/api/addIntoDB",{
        method: "POST",
        body: JSON.stringify({ data: dataReceive, selectItem: select }),
      });
      setMessageValidation(<h2>Sauvegarde effectuée !</h2>)
      setTimeout(() => {
        setMessageValidation(<></>)
      }, 2000);
    }

    function deleteImage(indexImage: number, index:number){
      dataReceive[index].image.splice(indexImage,1);
      setImage(dataReceive[index].image);
      handleClick(index)
      setData([])
        setTimeout(() => {
          setData(dataReceive);
          setModificationStatut({statut: true, index: index})
        }, 500);
    }
  if(props.decoded !== null){
    if(select === "Comite" || select === "Entraineurs" ){
      return (
        <>
      <Button ><a href="/api/auth/logout">déconnexion</a></Button>
      <div style={{padding:"20px",display:"flex",justifyContent:"center",flexDirection:"column"}}>
        <Box className="boxFormation">
          <select onChange={(event: any)=> loadData(event.target.value)}>
              <option value="Comite">Comite</option>
              <option value="Actualites">Actualité</option>
              <option value="Entraineurs">Entraineurs</option>
              <option value="Historique">Historique</option>
              <option value="Vacances">Vacances</option>
              <option value="Formation">Formation</option>
              <option value="Mecenat">Mecenat</option>
              <option value="ImagesDeroulanteAccueil">Bandeau Accueil</option>
          </select>
          <Button variant="primary" type="button" onClick={() => addArticle()}>
            Ajouter un nouvel article
          </Button>
          <Button variant="primary" type="button" onClick={()=> addIntoDb()}>
            Enregistrer toutes les modifications dans la base de donnée
          </Button>
        </Box>
        {messageValidation}
      </div>
      {dataReceive.map((element: any, index: number) => {
        return (
          <Box key={index} className="boxFormation" style={{backgroundColor: element.color, fontSize:"20px"}}>
            <Row style={{display:"flex"}}>
                <Col xs={6}>
                  <Form onKeyDown={(event) => handleClick(index)}>
                    <Form.Group className="mb-3" >
                      <Form.Label>nom :</Form.Label>
                      <Form.Control type="text" id="nom"  defaultValue={element.nom} onChange={(event) => {setNom(event.target.value)}}/>
                      <br></br>
                      <Form.Label>Couleur Nom : <Form.Control type="color" defaultValue={element.colorTitre} onChange={(event) => {setColorTitre(event.target.value), handleClick(index)}} id="titre" /></Form.Label><br></br>
                      <Form.Label>telephone :</Form.Label>
                      <Form.Control type="text"id="telephone"  defaultValue={element.telephone}onChange={(event) => {setTelephone(event.target.value)}} />
                      <br></br>
                      <Form.Label>mail :</Form.Label>
                      <Form.Control type="text" id="mail" defaultValue={element.mail} onChange={(event) => {setMail(event.target.value)}} />
                      <br></br>
                    </Form.Group>
                    {modificationStatut.statut === true && modificationStatut.index === index ? <Button variant="primary" type="button" onClick={()=>modification(index, {nom: nom ? nom : element.nom, telephone: telephone? telephone : element.telephone, mail:mail? mail : element.mail,colorTitre: colorTitre !== "" ? colorTitre : element.colorTitre})}>
                      Sauvegarder modification
                    </Button> : <></>}
                    <br></br>
                    <Button variant="primary" type="button" onClick={()=>suppresion(index)}>
                      Supprimer
                    </Button>
                  </Form>
                </Col>
                <Col xs={6}>
                  <Box className="BoxComite" style={{marginTop:0, marginLeft:"50px"}}>
                  <CardContent >
                  <Button id="badge" style={{backgroundColor:`${element.colorTitre}`}}>{element.nom}</Button>
                    <p></p>
                    <Typography variant="body2" color="text.secondary">
                      <p>Tél. : {element.telephone}</p>
                      <p>E-mail : {element.mail} </p>       
                    </Typography>
                  </CardContent>
                  </Box>
                </Col>
          </Row>
        </Box>
        );
        })}
      </>
      )
    }
    else if(select === "Actualites" || select === "Historique" || select === "Vacances" || select === "Formation" || select === "Mecenat" ){
      return (
        <>
      <Button ><a href="/api/auth/logout">déconnexion</a></Button>
      <div style={{padding:"20px",display:"flex",justifyContent:"center",flexDirection:"column"}}>
        <Box className="boxFormation">
          <select onChange={(event: any)=> loadData(event.target.value)}>
              <option value="Comite">Comite</option>
              <option value="Actualites">Actualité</option>
              <option value="Entraineurs">Entraineurs</option>
              <option value="Historique">Historique</option>
              <option value="Vacances">Vacances</option>
              <option value="Formation">Formation</option>
              <option value="Mecenat">Mecenat</option>
              <option value="ImagesDeroulanteAccueil">Bandeau Accueil</option>
          </select>
          <Button variant="primary" type="button" onClick={() => addArticle()}>
            Ajouter un nouvel article
          </Button>
          <Button variant="primary" type="button" onClick={()=> addIntoDb()}>
            Enregistrer toutes les modifications dans la base de donnée
          </Button>
        </Box>
        {messageValidation}
      </div>
      {dataReceive.map((element: any, index: number) => {
        return (
              <Box key={index} className="boxFormation" style={{backgroundColor: element.color, fontSize:"20px"}}>
                <Row style={{display:"flex"}}>
                <Col xs={6}>
                  <Form onKeyDown={(event) => handleClick(index)}>
                  <Form.Group className="mb-3" >
                    {element.titre ? <><Form.Label>Titre :</Form.Label><Form.Control type="text" id="titre"  style={{width:"300px"}} onChange={(event) => {setTitre(event.target.value)}} defaultValue={element.titre} /><br></br><Form.Label>Couleur Titre : <Form.Control type="color" defaultValue={element.colorTitre} onChange={(event) => {setColorTitre(event.target.value), handleClick(index)}} id="titre" /></Form.Label><br></br></> : <></>}
                    <Form.Label>Contenu :<br></br><br></br><Form.Control as="textarea" id="textarea"  rows={15} cols={70} onChange={(event) => {setContenu(event.target.value)}} defaultValue={element.contenu} /><br></br><br></br></Form.Label>
                    {element.video ? <><Form.Label>Video :</Form.Label><Form.Control type="text" id="titre"  onChange={(event) => {setVideo(event.target.value)}} defaultValue={element.video} /><br></br><br></br></> : <></>}
                    {element.image ? <><Form.Label>Photo :<Form.Control type="file" id="titre" onChange={(event) => {fileSelectedHandler(event, element.image, index)}}></Form.Control><br></br><br></br>
                    {element.image.map((image: any, indexImage:number)=> {
                      return (<div key={indexImage}><Button  onClick={() => deleteImage(indexImage, index)}>X</Button><img style={{width:"300px"}} src={image}/></div>)
                    })}
                    </Form.Label></> : <></>}
                  </Form.Group>
                  <br></br>
                  {modificationStatut.statut === true && modificationStatut.index === index  ? <Button variant="primary" type="button" onClick={()=>modification(index, {titre: titre? titre : element.titre, contenu: contenu? contenu : element.contenu, video: video? video : element.video, image: image.length !== 0 ? image : element.image,colorTitre: colorTitre !== "" ? colorTitre : element.colorTitre})} >
                    Sauvegarder modification
                  </Button> : <></>}
                  <br></br>
                  <Button variant="primary" type="button" onClick={()=>suppresion(index)}>
                    Supprimer
                  </Button>
                  </Form>
                </Col>
                <Col xs={6}>
                <Box key={index} style={{marginLeft:"10px"}} className="boxHistoriquePage">
                 <Button id="badge" style={{backgroundColor:`${element.colorTitre}`}}>{element.titre}</Button>
                  <Row style={{display:"flex"}}>
                    <Col xs={6} sm={6} id="colBox">
                      <pre style={{textAlign:"left"}}>{element.contenu}</pre>
                    </Col>
                    <Col id="imgActu"  xs={6} sm={6}>
                      {element.image ? element.image.map((item: any, index:number)=>{
                        return (<img key={index} alt={item.alt} src={item}/>);
                      }) : <div className="embed-responsive embed-responsive-16by9">
                      <iframe className="videoRegleBasket" src={element.video} ></iframe>
                     </div>}
                    </Col>
                  </Row>
                </Box>
            </Col>
            </Row>
            </Box>
        );
      })}
      </>
      )
    }
    else if(select === "ImagesDeroulanteAccueil"){
      return (
        <>
      <Button ><a href="/api/auth/logout">déconnexion</a></Button>
      <div style={{padding:"20px",display:"flex",justifyContent:"center",flexDirection:"column"}}>
        <Box className="boxFormation">
          <select onChange={(event: any)=> loadData(event.target.value)}>
              <option value="Comite">Comite</option>
              <option value="Actualites">Actualité</option>
              <option value="Entraineurs">Entraineurs</option>
              <option value="Historique">Historique</option>
              <option value="Vacances">Vacances</option>
              <option value="Formation">Formation</option>
              <option value="Mecenat">Mecenat</option>
              <option value="ImagesDeroulanteAccueil">Bandeau Accueil</option>
          </select>
          <Button variant="primary" type="button" onClick={() => addArticle()}>
            Ajouter un nouvel article
          </Button>
          <Button variant="primary" type="button" onClick={()=> addIntoDb()}>
            Enregistrer toutes les modifications dans la base de donnée
          </Button>
        </Box>
        {messageValidation}
      </div>
      {dataReceive.map((element: any, index: number) => {
        return (
          <Box key={index} className="boxFormation" style={{backgroundColor: element.color, fontSize:"20px"}}>
            <Row style={{display:"flex"}}>
                <Col xs={6}>
                <Form onKeyDown={(event) => handleClick(index)}>
                  <Form.Group className="mb-3" >
                    {element.titre ? <><Form.Label>Titre :</Form.Label><Form.Control type="text" style={{width:"300px"}} id="titre"  onChange={(event) => {setTitre(event.target.value)}} defaultValue={element.titre} /><br></br><br></br>
                    <Form.Label>Couleur texte titre : <Form.Control type="color" defaultValue={element.colorText} onChange={(event) => {setColorText(event.target.value), handleClick(index)}} id="titre" /></Form.Label><br></br>
                    <Form.Label>Couleur texte bouton : <Form.Control type="color" defaultValue={element.colorTextButton} onChange={(event) => {setColorTextButton(event.target.value), handleClick(index)}} id="titre" /></Form.Label><br></br>
                    <Form.Label>Couleur font boutton : <Form.Control type="color" defaultValue={element.colorBackgroundButton} onChange={(event) => {setColorBackgroundButton(event.target.value), handleClick(index)}} id="titre" /></Form.Label><br></br>
                    <br></br></> : <></>}
                    {element.lienPage ? <><Form.Label>Lien vers page :</Form.Label><Form.Control type="text" id="titre"  onChange={(event) => {setLienPage(event.target.value)}} defaultValue={element.lienPage} /><br></br><br></br></> : <></>}
                    {element.image ? <><Form.Label>Photo :<Form.Control type="file" id="titre" onChange={(event) => {fileSelectedHandler(event, element.image, index)}}></Form.Control><br></br><br></br>
                    {element.image.map((image: any, indexImage:number)=> {
                      return (<div key={indexImage}><Button  onClick={() => deleteImage(indexImage, index)}>X</Button><img style={{width:"300px"}} src={image}/></div>)
                    })}
                    </Form.Label></> : <></>}
                  </Form.Group>
                  <br></br>
                  {modificationStatut.statut === true && modificationStatut.index === index  ? <Button variant="primary" type="button" onClick={()=>modification(index, {titre: titre? titre : element.titre, lienPage: lienPage? lienPage : element.lienPage, image: image.length !== 0 ? image : element.image,colorText: colorText !== "" ? colorText : element.colorText,colorBackgroundButton: colorBackgroundButton !== "" ? colorBackgroundButton : element.colorBackgroundButton,colorTextButton: colorTextButton !== "" ? colorTextButton : element.colorTextButton})} >
                    Sauvegarder modification
                  </Button> : <></>}
                  <br></br>
                  <Button variant="primary" type="button" onClick={()=>suppresion(index)}>
                    Supprimer
                  </Button>
                </Form>
                </Col>
                <Col xs={6}>
                <Box key={index} style={{marginLeft:"10px"}} className="boxHistoriquePage">
                  <Row style={{display:"flex"}}>
                    <Row style={{position:"absolute", paddingTop:"80px", paddingLeft:"10px"}}>
                    <p style={{marginBottom:"0",color:`${element.colorText}`}}>{element.titre}</p>
                    <button style={{width:"90px", height:"20px",borderColor: "white",borderRadius: "10px",color:`${element.colorTextButton}`,backgroundColor:`${element.colorBackgroundButton}`}}>Cliquez ici</button>
                    </Row>
                    {element.image.map((image: any, indexImage:number)=> {
                      return (<div key={indexImage}><img style={{width:"300px"}} src={image}/></div>)
                    })}
                  </Row>
                </Box>
                </Col>
              </Row>
          
        </Box>
        );
      })}
      </>
      )
    }else if(select === ""){
      return (
        <>
      <Button ><a href="/api/auth/logout">déconnexion</a></Button>
      <div style={{padding:"20px",display:"flex",justifyContent:"center",flexDirection:"column"}}>
        <Box className="boxFormation">
          <select onChange={(event: any)=> loadData(event.target.value)}>
              <option value="Comite">Comite</option>
              <option value="Actualites">Actualité</option>
              <option value="Entraineurs">Entraineurs</option>
              <option value="Historique">Historique</option>
              <option value="Vacances">Vacances</option>
              <option value="Formation">Formation</option>
              <option value="Mecenat">Mecenat</option>
              <option value="ImagesDeroulanteAccueil">Bandeau Accueil</option>
          </select>
          <Button variant="primary" type="button" onClick={() => addArticle()}>
            Ajouter un nouvel article
          </Button>
          <Button variant="primary" type="button" onClick={()=> addIntoDb()}>
            Enregistrer toutes les modifications dans la base de donnée
          </Button>
        </Box>
        {messageValidation}
      </div>
      </>)
    }
  }else {
    return (
      <Button><a href="/api/auth/login">Se connecter</a></Button>
    )
  }
}
