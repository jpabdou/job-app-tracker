import Cors from 'cors'
import { NextRequest, NextResponse } from 'next/server'
const cors = Cors({
    methods: ['POST', 'GET', 'DELETE', 'PUT', 'HEAD'],
  })

export default function runMiddleware(
    req: NextRequest,
    res: NextResponse,
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
