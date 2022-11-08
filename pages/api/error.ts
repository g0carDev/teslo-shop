import type { NextApiRequest, NextApiResponse } from 'next'

type Data = {
    message: string | string[]
}

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
    const { status = 400, message = '' } = req.query

    res.status(Number(status)).json({ message })
    
}