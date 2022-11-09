import { db } from '@database';
import { Product } from '@models';
import type { IProduct } from '@interfaces';

export const getProductBySlug = async (slug: string): Promise<IProduct | null> => {
  await db.connect();
  const product = await Product.findOne({ slug }).lean();
  await db.disconnect();
  if (!product) return null;

  product.images = product.images.map((image) => {
    return image.includes('http') ? image : `${process.env.HOST_NAME}/products/${image}`;
  });
  
  return JSON.parse(JSON.stringify(product));
};
