import { db } from "@database"
import { Product } from "@models"
import type { IProduct } from "@interfaces"

export const getProductByQuery = async (query: string): Promise<IProduct[]> => {
    query = query.toString().toLowerCase()
    await db.connect()
    const products = await Product.find({ $text: { $search: query } }).select('title images price inStock slug -_id').lean()
    await db.disconnect()
    return products
}