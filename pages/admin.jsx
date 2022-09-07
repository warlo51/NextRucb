import { Box, CardContent, Modal, Typography } from "@mui/material";
import { Accordion, Button, Col, Dropdown, Form, Row } from "react-bootstrap";
import React, { useEffect, useRef, useState } from "react";
import jwt_decode from "jwt-decode";
import "react-color-palette/lib/css/styles.css";
import { Layout } from "../components/Layout";


export const getServerSideProps = async (context) =>{
  const accessTokken = context.req.cookies.AccessToken;
  let decoded;
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

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

export default function Administration(props) {

    const [dataReceive, setData] = useState([]);
    const [select, setSelect] = useState("");
    const [nom, setNom] = useState("");
    const [telephone, setTelephone] = useState("");
    const [mail, setMail] = useState("");
    const [titre, setTitre] = useState("");
    const [lienPage, setLienPage] = useState("");
    const [image, setImage] = useState([]);
    const [video, setVideo] = useState("");
    const [colorTitre, setColorTitre] = useState("");
    const [colorBackgroundButton, setColorBackgroundButton] = useState("");
    const [colorTextButton, setColorTextButton] = useState("");
    const [active, setActive] = useState(false);
    const [colorText, setColorText] = useState("");
    const [contenu, setContenu] = useState("");
    const [open, setOpen] = React.useState(false);
    const handleClose = () => setOpen(false);
    const handleOpen = () => setOpen(true);
    const [messageValidation, setMessageValidation] = useState(<></>);
    const [modificationStatut, setModificationStatut] = useState({statut:false, index: 0});
    const dragItem = useRef();
    const dragOverItem = useRef();
    const [list, setList] = useState([]);

  const dragStart = (e, position) => {
    dragItem.current = position;
  };
 
  const dragEnter = (e, position) => {
    dragOverItem.current = position;
  };
 
  const drop = (e) => {
    const copyListItems = [...list];
    const dragItemContent = copyListItems[dragItem.current];
    copyListItems.splice(dragItem.current, 1);
    copyListItems.splice(dragOverItem.current, 0, dragItemContent);
    dragItem.current = null;
    dragOverItem.current = null;
    setList(copyListItems);
   
  };
  
    const handleClick = (index) => {
      dataReceive[index] = {...dataReceive[index],color:"#C6A43D"};
      setModificationStatut({statut: true, index: index})
    };

    async function loadData(event){
      handleClose();
       const dataDB =  await fetch("/api/loadData",{
        method: "POST",
        body: event,
      }).then((result) => result.json());
      setSelect(event);
      setList(dataDB.data)
      setData([]) 
        setTimeout(() => {
          setData(dataDB.data) 
        }, 100);  
    }

    async function fileSelectedHandler(event, imagesDB, index){
      const file = event.target.files[0];
      const base64 = await convertBase64(file);
      const arrayImages = imagesDB;
      arrayImages.push(base64);
      setImage(arrayImages);
      handleClick(index)
    }
    
    function convertBase64(file){
      return new Promise((resolve, reject) => {
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
        dataReceive.push({"nom":"", "telephone": "", "mail": "","color":"#C63D59", "colorTitre":"#dc8d32"})
        setData([]) 
        setTimeout(() => {
          setData(dataReceive) 
        }, 500);     
      }else if (select === "Historique" || select === "Vacances" || select === "Mecenat" || select === "Actualites"){
        dataReceive.push({"titre": "Titre","contenu": "", "image": [],"color":"#C63D59","colorTitre":"#dc8d32"})   
        setData([]) 
        setTimeout(() => {
          setData(dataReceive) 
        }, 500);  
       
      }else if (select === "Formation"){
        dataReceive.push({"titre": "Titre","contenu": "", "video": "coller url video","color":"#C63D59","colorTitre":"#dc8d32"})   
        setData([]) 
        setTimeout(() => {
          setData(dataReceive) 
        }, 500);
      }
      else if (select === "ImagesDeroulanteAccueil"){
        dataReceive.push({"titre": "Titre","active": "true","lienPage": "lien page", "image": [],"color":"#C63D59","colorTextButton":"#FFFFFF","colorText":"#FFFFFF","colorBackgroundButton":"#3d1e7b"})   
        setData([]) 
        setTimeout(() => {
          setData(dataReceive) 
        }, 500);
      }
    }

    function suppresion(index){
      dataReceive.splice(index,1);
      setData([])
        setTimeout(() => {
          setData(dataReceive) 
        }, 500);
    }

    function modification(index, data){
      dataReceive[index] = {...data,color:"#3DA9C6"};
     
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

    async function addIntoDb(dataRecu){
      const dataDB =  await fetch("/api/addIntoDB",{
        method: "POST",
        body: JSON.stringify({ data: dataRecu, selectItem: select }),
      });
      setMessageValidation(<h2>Sauvegarde effectuée !</h2>)
      setTimeout(() => {
        setMessageValidation(<></>)
        loadData(select);
      }, 2000);
    }

    function deleteImage(indexImage, index){
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
      <a href="/api/auth/logout"><Row style={{display:"flex", justifyContent:"center"}}><Button style={{fontSize:"40px", textAlign:"center", marginTop:"20px", backgroundColor:"orange", borderRadius:"20px"}}>Déconnexion</Button></Row></a>
      <div style={{padding:"20px",display:"flex",justifyContent:"center",flexDirection:"column"}}>
        <Box className="boxFormation">
          <select onChange={(event)=> loadData(event.target.value)}>
              <option value="Comite">Comite</option>
              <option value="Actualites">Actualité</option>
              <option value="Entraineurs">Entraineurs</option>
              <option value="Historique">Historique</option>
              <option value="Vacances">Vacances</option>
              <option value="Formation">Formation</option>
              <option value="Mecenat">Mecenat</option>
              <option value="ImagesDeroulanteAccueil">Bandeau Accueil</option>
          </select>
          <Button  style={{backgroundColor: "orange", marginLeft:"10px", fontSize:"20px", borderRadius:"20px"}} type="button" onClick={() => addArticle()}>
            Ajouter un nouvel article
          </Button>
          <Button style={{backgroundColor: "orange", marginLeft:"10px", fontSize:"20px", borderRadius:"20px"}} type="button" onClick={()=> addIntoDb(dataReceive)}>
            Enregistrer toutes les modifications dans la base de donnée
          </Button>
          <Button style={{backgroundColor: "orange", marginLeft:"10px", fontSize:"20px", borderRadius:"20px"}} type="button" onClick={handleOpen}>
            Changer ordre affichage
          </Button>
        </Box>
        <div>
          <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box sx={style}>
              <Typography id="modal-modal-title" variant="h6" component="h2">
                Agencer l'ordre des articles
              </Typography>
              <br></br>
              <>
              {
              list &&
              list.map((item, index) => (
                <div style={{backgroundColor:`${item.colorTitre}`, margin:'20px 25%', textAlign:'center', fontSize:'20px', borderRadius:"20px"}}
                  onDragStart={(e) => dragStart(e, index)}
                  onDragEnter={(e) => dragEnter(e, index)}
                  onDragEnd={drop}
                  key={index}
                  draggable>
                    {item.nom}
                </div>
                ))}
              </>
              <br></br>
              <Button style={{marginLeft:"10px", fontSize:"15px", borderRadius:"20px"}} onClick={()=> {addIntoDb(list), handleClose()}}>Sauvegarder dans la base de donnée</Button><br></br><br></br>
              <Button style={{ marginLeft:"10px", fontSize:"15px", borderRadius:"20px"}} onClick={handleClose}>Fermer</Button>
            </Box>
          </Modal>
        </div>
        {messageValidation}
      </div>
      {dataReceive.map((element, index) => {
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
                    <br></br>
                    {modificationStatut.statut === true && modificationStatut.index === index ? <Button style={{backgroundColor: "orange", marginLeft:"10px", fontSize:"20px", borderRadius:"20px"}} type="button" onClick={()=>modification(index, {nom: nom ? nom : element.nom, telephone: telephone? telephone : element.telephone, mail:mail? mail : element.mail,colorTitre: colorTitre !== "" ? colorTitre : element.colorTitre})}>
                      Sauvegarder modification
                    </Button> : <></>}
                    <br></br>
                    <Button style={{backgroundColor: "orange", marginLeft:"10px", fontSize:"20px", borderRadius:"20px"}} type="button" onClick={()=>suppresion(index)}>
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
      <a href="/api/auth/logout"><Row style={{display:"flex", justifyContent:"center"}}><Button style={{fontSize:"40px", textAlign:"center", marginTop:"20px", backgroundColor:"orange", borderRadius:"20px"}}>Déconnexion</Button></Row></a>
      <div style={{padding:"20px",display:"flex",justifyContent:"center",flexDirection:"column"}}>
        <Box className="boxFormation">
          <select onChange={(event)=> loadData(event.target.value)}>
              <option value="Comite">Comite</option>
              <option value="Actualites">Actualité</option>
              <option value="Entraineurs">Entraineurs</option>
              <option value="Historique">Historique</option>
              <option value="Vacances">Vacances</option>
              <option value="Formation">Formation</option>
              <option value="Mecenat">Mecenat</option>
              <option value="ImagesDeroulanteAccueil">Bandeau Accueil</option>
          </select>
          <Button style={{backgroundColor: "orange", marginLeft:"10px", fontSize:"20px", borderRadius:"20px"}} type="button" onClick={() => addArticle()}>
            Ajouter un nouvel article
          </Button>
          <Button style={{backgroundColor: "orange", marginLeft:"10px", fontSize:"20px", borderRadius:"20px"}} type="button" onClick={()=> addIntoDb(dataReceive)}>
            Enregistrer toutes les modifications dans la base de donnée
          </Button>
          <Button style={{backgroundColor: "orange", marginLeft:"10px", fontSize:"20px", borderRadius:"20px"}} type="button" onClick={handleOpen}>
            Changer ordre affichage
          </Button>
        </Box>
        <div>
          <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box sx={style}>
              <Typography id="modal-modal-title" variant="h6" component="h2">
                Agencer l'ordre des articles
              </Typography>
              <br></br>
              <>
              {
              list &&
              list.map((item, index) => (
                <div style={{backgroundColor:`${item.colorTitre}`, margin:'20px 25%', textAlign:'center', fontSize:'20px', borderRadius:"20px"}}
                  onDragStart={(e) => dragStart(e, index)}
                  onDragEnter={(e) => dragEnter(e, index)}
                  onDragEnd={drop}
                  key={index}
                  draggable>
                    {item.titre}
                </div>
                ))}
              </>
              <br></br>
              <Button style={{marginLeft:"10px", fontSize:"15px", borderRadius:"20px"}} onClick={()=> {addIntoDb(list), handleClose()}}>Sauvegarder dans la base de donnée</Button><br></br><br></br>
              <Button style={{marginLeft:"10px", fontSize:"15px", borderRadius:"20px"}} onClick={handleClose}>Fermer</Button>
            </Box>
          </Modal>
        </div>
        {messageValidation}
      </div>
      {dataReceive.map((element, index) => {
        return (
              <Box key={index} className="boxFormation" style={{backgroundColor: element.color, fontSize:"20px"}}>
                <Row style={{display:"flex"}}>
                <Col xs={6}>
                  <Form onKeyDown={(event) => handleClick(index)}>
                  <Form.Group className="mb-3" >
                    {element.titre ? <><Form.Label>Titre :</Form.Label><Form.Control type="text" id="titre"  style={{width:"300px"}} onChange={(event) => {setTitre(event.target.value)}} defaultValue={element.titre} /><br></br><Form.Label>Couleur Titre : <Form.Control type="color" defaultValue={element.colorTitre} onChange={(event) => {setColorTitre(event.target.value), handleClick(index)}} id="titre" /></Form.Label><br></br></> : <></>}
                    <Form.Label>Contenu :<br></br><br></br><Form.Control as="textarea" id="textarea"  rows={15} cols={70} onChange={(event) => {setContenu(event.target.value)}} defaultValue={element.contenu} /><br></br><br></br></Form.Label><br></br>
                    {element.video ? <><Form.Label>Video :</Form.Label><Form.Control type="text" id="titre"  onChange={(event) => {setVideo(event.target.value)}} defaultValue={element.video} /><br></br><br></br></> : <></>}
                    {element.image ? <><Form.Label>Photo :<Form.Control type="file" id="titre" onChange={(event) => {fileSelectedHandler(event, element.image, index)}}></Form.Control><br></br><br></br>
                    {element.image.map((image, indexImage)=> {
                      return (<div key={indexImage}><Button  onClick={() => deleteImage(indexImage, index)}>X</Button><img style={{width:"200px"}} src={image}/></div>)
                    })}
                    </Form.Label></> : <></>}
                  </Form.Group>
                  <br></br>
                  <br></br>
                  {modificationStatut.statut === true && modificationStatut.index === index  ? <Button style={{backgroundColor: "orange", marginLeft:"10px", fontSize:"20px", borderRadius:"20px"}} type="button" onClick={()=>modification(index, {titre: titre? titre : element.titre, contenu: contenu? contenu : element.contenu, video: video? video : element.video, image: image.length !== 0 ? image : element.image,colorTitre: colorTitre !== "" ? colorTitre : element.colorTitre})} >
                    Sauvegarder modification
                  </Button> : <></>}
                  <br></br>
                  <Button style={{backgroundColor: "orange", marginLeft:"10px", fontSize:"20px", borderRadius:"20px"}} type="button" onClick={()=>suppresion(index)}>
                    Supprimer
                  </Button>
                  </Form>
                </Col>
                <Col xs={6}>
                <Box key={index} style={{marginLeft:"10px"}} className="boxHistoriquePage">
                 <Button id="badge" style={{backgroundColor:`${element.colorTitre}`}}>{element.titre}</Button>
                  <Row style={{display:"flex"}}>
                    <Col xs={6} sm={6} id="colBox">
                      <pre style={{textAlign:"left", fontSize:"15px"}}>{element.contenu}</pre>
                    </Col>
                    <Col id="imgActu"  xs={6} sm={6}>
                      {element.image ? element.image.map((item, index)=>{
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
      <a href="/api/auth/logout"><Row style={{display:"flex", justifyContent:"center"}}><Button style={{fontSize:"40px", textAlign:"center", marginTop:"20px", backgroundColor:"orange", borderRadius:"20px"}}>Déconnexion</Button></Row></a>
      <div style={{padding:"20px",display:"flex",justifyContent:"center",flexDirection:"column"}}>
        <Box className="boxFormation">
          <select onChange={(event)=> loadData(event.target.value)}>
              <option value="Comite">Comite</option>
              <option value="Actualites">Actualité</option>
              <option value="Entraineurs">Entraineurs</option>
              <option value="Historique">Historique</option>
              <option value="Vacances">Vacances</option>
              <option value="Formation">Formation</option>
              <option value="Mecenat">Mecenat</option>
              <option value="ImagesDeroulanteAccueil">Bandeau Accueil</option>
          </select>
          <Button style={{backgroundColor: "orange", marginLeft:"10px", fontSize:"20px", borderRadius:"20px"}} type="button" onClick={() => addArticle()}>
            Ajouter un nouvel article
          </Button>
          <Button style={{backgroundColor: "orange", marginLeft:"10px", fontSize:"20px", borderRadius:"20px"}} type="button" onClick={()=> addIntoDb(dataReceive)}>
            Enregistrer toutes les modifications dans la base de donnée
          </Button>
        </Box>
       
        {messageValidation}
      </div>
      {dataReceive.map((element, index) => {
        return (
          <Box key={index} className="boxFormation" style={{backgroundColor: element.color, fontSize:"20px"}}>
            <Row style={{display:"flex"}}>
                <Col xs={6}>
                <Form onKeyDown={(event) => handleClick(index)}>
                  <Form.Group className="mb-3" >
                    {element.active === "true" ? <>
                      <Form.Label>Activer: </Form.Label><br></br>
                    <Form.Check type="radio" label="Oui" value={true} checked={true} name="group1" onChange={(event) => {setActive(event.target.value), handleClick(index)}} id="titre" />
                    <Form.Check type="radio" label="Non" value={false} name="group1" onChange={(event) => {setActive(event.target.value), handleClick(index)}} id="titre" /><br></br>
                    </> : <>
                    <Form.Label>Activer: </Form.Label><br></br>
                    <Form.Check type="radio" label="Oui" value={true} name="group1" onChange={(event) => {setActive(event.target.value), handleClick(index)}} id="titre" />
                    <Form.Check type="radio" label="Non" value={false} checked={true} name="group1" onChange={(event) => {setActive(event.target.value), handleClick(index)}} id="titre" /><br></br></>}

                    {element.titre ? <><Form.Label>Titre :</Form.Label><Form.Control type="text" style={{width:"300px"}} id="titre"  onChange={(event) => {setTitre(event.target.value)}} defaultValue={element.titre} /><br></br><br></br>
                    <Form.Label>Couleur texte titre : <Form.Control type="color" defaultValue={element.colorText} onChange={(event) => {setColorText(event.target.value), handleClick(index)}} id="titre" /></Form.Label><br></br>
                    <Form.Label>Couleur texte bouton : <Form.Control type="color" defaultValue={element.colorTextButton} onChange={(event) => {setColorTextButton(event.target.value), handleClick(index)}} id="titre" /></Form.Label><br></br>
                    <Form.Label>Couleur font boutton : <Form.Control type="color" defaultValue={element.colorBackgroundButton} onChange={(event) => {setColorBackgroundButton(event.target.value), handleClick(index)}} id="titre" /></Form.Label><br></br>
                    <br></br></> : <></>}
                    {element.lienPage ? <><Form.Label>Lien vers page :</Form.Label><Form.Control type="text" id="titre"  onChange={(event) => {setLienPage(event.target.value)}} defaultValue={element.lienPage} /><br></br><br></br></> : <></>}
                    {element.image ? <><Form.Label>Photo :<Form.Control type="file" id="titre" onChange={(event) => {fileSelectedHandler(event, element.image, index)}}></Form.Control><br></br><br></br>
                    {element.image.map((image, indexImage)=> {
                      return (<div key={indexImage}><Button  onClick={() => deleteImage(indexImage, index)}>X</Button><img style={{width:"300px"}} src={image}/></div>)
                    })}
                    </Form.Label></> : <></>}
                  </Form.Group>
                  <br></br>
                  <br></br>
                  {modificationStatut.statut === true && modificationStatut.index === index  ? <Button style={{backgroundColor: "orange", marginLeft:"10px", fontSize:"20px", borderRadius:"20px"}} type="button" onClick={()=>modification(index, {titre: titre? titre : element.titre, active: active? active : element.active, lienPage: lienPage? lienPage : element.lienPage, image: image.length !== 0 ? image : element.image,colorText: colorText !== "" ? colorText : element.colorText,colorBackgroundButton: colorBackgroundButton !== "" ? colorBackgroundButton : element.colorBackgroundButton,colorTextButton: colorTextButton !== "" ? colorTextButton : element.colorTextButton})} >
                    Sauvegarder modification
                  </Button> : <></>}
                  <br></br>
                  <Button style={{backgroundColor: "orange", marginLeft:"10px", fontSize:"20px", borderRadius:"20px"}} type="button" onClick={()=>suppresion(index)}>
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
                    {element.image.map((image, indexImage)=> {
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
      <a href="/api/auth/logout"><Row style={{display:"flex", justifyContent:"center"}}><Button style={{fontSize:"40px", textAlign:"center", marginTop:"20px", backgroundColor:"orange", borderRadius:"20px"}}>Déconnexion</Button></Row></a>
      <div style={{padding:"20px",display:"flex",justifyContent:"center",flexDirection:"column"}}>
        <Box className="boxFormation">
          <select onChange={(event)=> loadData(event.target.value)}>
              <option value="Comite">Comite</option>
              <option value="Actualites">Actualité</option>
              <option value="Entraineurs">Entraineurs</option>
              <option value="Historique">Historique</option>
              <option value="Vacances">Vacances</option>
              <option value="Formation">Formation</option>
              <option value="Mecenat">Mecenat</option>
              <option value="ImagesDeroulanteAccueil">Bandeau Accueil</option>
          </select>
          <Button style={{backgroundColor: "orange", marginLeft:"10px", fontSize:"20px", borderRadius:"20px"}} type="button" onClick={() => addArticle()}>
            Ajouter un nouvel article
          </Button>
          <Button style={{backgroundColor: "orange", marginLeft:"10px", fontSize:"20px", borderRadius:"20px"}} type="button" onClick={()=> addIntoDb(dataReceive)}>
            Enregistrer toutes les modifications dans la base de donnée
          </Button>
        </Box>
        {messageValidation}
      </div>
      </>)
    }
  }else {
    return (
      <Layout>
        <Row style={{height:"1000px", display:"flex", justifyContent:"center", alignContent:"center"}}><Button href="/api/auth/login" style={{backgroundColor:"#3d1e7b",borderRadius:"30px", width:"200px", height:"150px"}}><p style={{marginTop:"50px"}}>Se connecter</p></Button></Row>
      </Layout>
    )
  }
}
