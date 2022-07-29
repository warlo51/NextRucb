import type { NextApiRequest, NextApiResponse } from 'next'
import { getDatabase } from '../../src/database/database';

export const config = {
  api: {
      bodyParser: {
          sizeLimit: '10mb' // Set desired value here
      }
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
    const mongodb = await getDatabase();
    const request = JSON.parse(req.body)

    const deleteColorOnData = request.data.map((element: any) =>{
      delete element.color;
      return element;
    })

    await mongodb.db().collection(`${request.selectItem}`).deleteMany({});
    await mongodb.db().collection(`${request.selectItem}`).insertMany(deleteColorOnData);
   res.status(200).send("enregistrement terminés");
}