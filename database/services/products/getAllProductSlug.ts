import { db } from "@database"
import { Product } from "@models"

interface ProductSlug {
    slug: string
}
export const getAllProductSlug = async (): Promise<ProductSlug[]> => {
    await db.connect()
    const slugs = await Product.find().select('slug -_id').lean()
    await db.disconnect()
    return slugs
}