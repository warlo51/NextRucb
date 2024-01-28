import type { NextApiRequest, NextApiResponse } from 'next'
import { xml2json } from 'xml-js';
import iconv from "iconv-lite";
import {XMLBuilder, XMLParser} from "fast-xml-parser";
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
    const url = "https://www.ffbb.com/rss2.xml";
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
      if(data){
          const xml = xml2json(data.replace(/[\n\r]/g, '\\n')
              .replace(/&/g,"&amp;")
              .replace(/-/g,"&#45;"), { compact: false, spaces: 4 });

          Array(JSON.parse(xml)).forEach((element: any) => {
              const elems = element.elements[0];
              const findElement = elems.elements?.find((e: any) => e.type === "element");
              tableau = findElement.elements?.filter((e: any) => e.type === 'element');
          });
          const formatData: any[] = [];
          tableau?.forEach((element: any, index:number) => {
              if(index > 4){
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
    res.status(200).send({data: tableau});
}
