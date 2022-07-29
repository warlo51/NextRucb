import type { NextApiRequest, NextApiResponse } from 'next'
import { getDatabase } from '../../src/database/database';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
    const mongodb = await getDatabase();
    const dataReceived = await mongodb.db().collection(`${req.body}`).find().toArray();

    const dataModif = dataReceived.map((element)=>{
      return {
        ...element,
        color:"#388d39"
      }
    })
    
    res.status(200).send({data: dataModif});
}