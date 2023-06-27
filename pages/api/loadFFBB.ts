import type { NextApiRequest, NextApiResponse } from 'next'
import { xml2json } from 'xml-js';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
    const url = "http://www.ffbb.com/rss2.xml";
        const data: any = await fetch(url)
          .then((response) => {
            return response.arrayBuffer();
          })
          .then((responseText) => {
            const decoder = new TextDecoder('iso-8859-1');
            const text = decoder.decode(responseText);
            return text;
         })
      .catch((error) => {
        console.log('Error fetching the feed: ', error);
      });

      let tableau: [] = [];
        const xml = xml2json(data, { compact: false, spaces: 4 });
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
                })
                formatData.push(objet);
            }
        });
    res.status(200).send({data: formatData});
}
