import Cors from 'cors'
import { NextApiResponse, NextApiRequest } from 'next';

const cors = Cors({
    methods: ['POST', 'GET', 'DELETE', 'PUT', 'HEAD'],
  })

export default function runMiddleware(
    req: NextApiRequest,
    res: NextApiResponse,
    fn: Function
  ) {
    return new Promise((resolve, reject) => {
      fn(req, res, (result: any) => {
        if (result instanceof Error) {
          return reject(result)
        }
  
        return resolve(result)
      })
    })
  }
