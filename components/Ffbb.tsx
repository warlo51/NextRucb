import { useEffect, useState } from "react";
import { Button, Card } from "react-bootstrap";
import { xml2json } from "xml-js";



export default function Ffbb(props: any) {
    const [data, setData] = useState<any[]>([]);

    useEffect(()=> {
        setData(props.data);
    }, [data===undefined]);
        return (
            <div className="divFfbb">
                <Button id="badge">Actu FFBB</Button>
                <div className="contentFfbb">
                {data.map((element => {
                    // const description = element.description.replace('<img href="',"").replace('" />',"").split(".jpg");
                    // const image= description[0];
                    // const texte = description[1];
                    const texte = element.description?.split("/>");
                    const image = texte ? texte[0].split('"')[1] : ""

                    return <div>
                        <Card className="cardFfbb">
                        <a className="cardHeaderFfbb"  href={element.link}>
                            <Card.Header>{element.title}</Card.Header>
                        </a>
                        <Card.Body>
                            <Card.Img src={`${image}`}/>
                            <Card.Text className="descriptionFfbb">
                                {texte[1]}
                            </Card.Text>
                        </Card.Body>
                        </Card>
                    </div>
                }))}
                </div>
            </div>
        );

}
