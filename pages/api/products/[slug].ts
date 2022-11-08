import type { NextApiRequest, NextApiResponse } from 'next'
import { db } from '@database';
import { Product } from '@models';
import type { IProduct } from '@interfaces';

type Data =
    | { message: string }
    | IProduct

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
    switch (req.method) {
        case 'GET':
            return getProduct(req, res)
        case 'PUT':
            return updateProduct(req, res)
        default:
            return res.status(400).json({ message: `Method ${req.method} Not Allowed` })
    }

}

const updateProduct = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
    const { id } = req.query
    const { description, status } = req.body
    try {
        await db.connect()
        const product = await Product.findByIdAndUpdate(id, { description, status }, { runValidators: true, new: true })
        if (!product) {
            await db.disconnect()
            return res.status(404).json({ message: `Product With ID ${id} Not Found` })
        }
        await db.disconnect()
        return res.status(200).json(product)
    } catch (error: any) {
        await db.disconnect()
        console.log(error)
        return res.status(500).json({ message: error.errors.status.message })

    }

}

const getProduct = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
    const { slug } = req.query
    try {
        await db.connect()
        const product = await Product.findOne({ slug }).select(' -__v').lean()
        if (!product) {
            await db.disconnect()
            return res.status(404).json({ message: `Product ${slug} Not Found` })
        }
        await db.disconnect()
        return res.status(200).json(product)
    } catch (error: any) {
        await db.disconnect()
        console.log(error)
        return res.status(500).json({ message: error.errors.status.message })
    }
}