import { useEffect, useState } from "react";
import { Button, Card } from "react-bootstrap";
import {parseString} from "xml2js";
import { xml2json, json2xml } from "xml-js";
import utf8 from "utf8";



export default function Ffbb(props: any) {
    
    const [data, setData] = useState<any[]>([]);
    useEffect(()=>{
        let tableau: [] = [];
        const xml = xml2json(props.data, { compact: false, spaces: 4 });
        console.log('t', Array(JSON.parse(xml)))
        Array(JSON.parse(xml)).forEach((element: any) => {
            tableau = element.elements[0].elements[0].elements;
         });
        const formatData: any[] = [];
        tableau.forEach((element: any, index:number) => {
            if(index > 3){
                let objet = {};
                element.elements.forEach((data: any) => {
                    
                    if(data.name === "title"){
                        objet = {...objet,title: data.elements[0].text}
                    }else if(data.name === "link"){
                        objet = {...objet,link: data.elements[0].text}
                    }else if(data.name === "description"){
                        objet = {...objet,description: data.elements[0].cdata}
                    }
                    // .replaceAll("�","é")

                    
                })
                formatData.push(objet);
            }
        });
        setData(formatData)
    },[]);

    return (
        <div className="divFfbb">
            <Button id="badge">Actu FFBB</Button>
        {/* <iframe height="700px" className="iframeFFBB" width="100%"src="https://rss.app/embed/v1/wall/50TfAPh36gQZ26Xk" frameBorder="0"></iframe> */}
            <div className="contentFfbb">
            {data.map((element => {
                const description = element.description.replace('<img href="',"").replace('" />',"").split(".jpg");
                const image= description[0];
                const texte = description[1];
                
                return <div>
                    <Card className="cardFfbb">
                    <a className="cardHeaderFfbb"  href={element.link}>
                        <Card.Header>{element.title}</Card.Header>
                    </a>
                    <Card.Body>
                        <Card.Img src={`${image}.jpg`}/>
                        <Card.Text className="descriptionFfbb">
                            {texte}
                        </Card.Text>
                    </Card.Body>
                    </Card>
                </div>
            }))}
            </div>
        </div>
    );
}
