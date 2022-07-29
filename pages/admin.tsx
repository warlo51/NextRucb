import { Badge, Box, CardContent, Typography } from "@mui/material";
import { Accordion, Button, Dropdown, Form } from "react-bootstrap";
import React, { useEffect, useState } from "react";
import jwt_decode from "jwt-decode";
import { GetServerSideProps } from "next";
import CancelIcon from '@mui/icons-material/Cancel';
import axios from "axios";


export const getServerSideProps: GetServerSideProps = async (context) =>{
  const accessTokken = context.req.cookies.IdToken;
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
    const [image, setImage] = useState<any>([]);
    const [video, setVideo] = useState("");
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
      setData(dataDB.data);
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
        dataReceive.push({"nom":"", "telephone": "", "mail": "","color":"red"})
        setData([]) 
        setTimeout(() => {
          setData(dataReceive) 
        }, 500);     
      }else if (select === "Historique"){
        dataReceive.push({"titre": "Titre","contenu": "", "images": [],"color":"red"})   
        setData([]) 
        setTimeout(() => {
          setData(dataReceive) 
        }, 500);   
      }else{
        dataReceive.push({"contenu": "", "images": [],"color":"red"})
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
      console.log(data)
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
      {select === "Comite" || select === "Entraineurs" ? dataReceive !== undefined ? dataReceive.map((element: any, index: number) => {

        return (
          <Box key={index} className="boxFormation" style={{backgroundColor: element.color, fontSize:"20px"}}>
          <Form onKeyDown={(event) => handleClick(index)}>
          <Form.Group className="mb-3" >
            <Form.Label>nom :</Form.Label>
            <Form.Control type="text" id="nom"  defaultValue={element.nom} onChange={(event) => {setNom(event.target.value)}}/>
            <br></br>
            <Form.Label>telephone :</Form.Label>
            <Form.Control type="text"id="telephone"  defaultValue={element.telephone}onChange={(event) => {setTelephone(event.target.value)}} />
            <br></br>
            <Form.Label>mail :</Form.Label>
            <Form.Control type="text" id="mail" defaultValue={element.mail} onChange={(event) => {setMail(event.target.value)}} />
            <br></br>
          </Form.Group>
          {modificationStatut.statut === true && modificationStatut.index === index ? <Button variant="primary" type="button" onClick={()=>modification(index, {nom: nom ? nom : element.nom, telephone: telephone? telephone : element.telephone, mail:mail? mail : element.mail})}>
            Sauvegarder modification
          </Button> : <></>}
          <br></br>
          <Button variant="primary" type="button" onClick={()=>suppresion(index)}>
            Supprimer
          </Button>
        </Form>
        </Box>
        );
      }) : <></> : dataReceive !== undefined ? dataReceive.map((element: any, index: number) => {
        return (
          <Box key={index} className="boxFormation" style={{backgroundColor: element.color, fontSize:"20px"}}>
          <Form onKeyDown={(event) => handleClick(index)}>
          <Form.Group className="mb-3" >
            {element.titre ? <><Form.Label>Titre :</Form.Label><Form.Control type="text" id="titre"  onChange={(event) => {setTitre(event.target.value)}} defaultValue={element.titre} /><br></br><br></br></> : <></>}
            <Form.Label>Contenu :<br></br><br></br><Form.Control as="textarea" id="textarea"  rows={10} cols={50} onChange={(event) => {setContenu(event.target.value)}} defaultValue={element.contenu} /><br></br><br></br></Form.Label>
            {element.video ? <><Form.Label>Video :</Form.Label><Form.Control type="text" id="titre"  onChange={(event) => {setVideo(event.target.value)}} defaultValue={element.video} /><br></br><br></br></> : <></>}
            {element.image ? <><Form.Label>Photo :<Form.Control type="file" id="titre" onChange={(event) => {fileSelectedHandler(event, element.image, index)}}></Form.Control><br></br><br></br>
            {element.image.map((image: any, indexImage:number)=> {
              return (<div key={indexImage}><Button  onClick={() => deleteImage(indexImage, index)}>X</Button><img style={{width:"300px"}} src={image}/></div>)
            })}
            </Form.Label></> : <></>}
          </Form.Group>
          <br></br>
          {modificationStatut.statut === true && modificationStatut.index === index  ? <Button variant="primary" type="button" onClick={()=>modification(index, {titre: titre? titre : element.titre, contenu: contenu? contenu : element.contenu, video: video? video : element.video, image: image.length !== 0 ? image : element.image})} >
            Sauvegarder modification
          </Button> : <></>}
          <br></br>
          <Button variant="primary" type="button" onClick={()=>suppresion(index)}>
            Supprimer
          </Button>
        </Form>
        </Box>
        );
      }) : <></>}  
      </>
    );
  }else {
    return (
      <Button><a href="/api/auth/login">Se connecter</a></Button>
    )
  }
}
