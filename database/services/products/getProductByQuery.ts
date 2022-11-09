import { db } from '@database';
import { Product } from '@models';
import type { IProduct } from '@interfaces';

export const getProductByQuery = async (query: string): Promise<IProduct[]> => {
  query = query.toString().toLowerCase();
  await db.connect();
  const products = await Product.find({ $text: { $search: query } })
    .select('title images price inStock slug -_id')
    .lean();
  await db.disconnect();

  const updatedProducts = products.map((product) => {
     (product.images = product.images.map((image) => {
      return image.includes('http') ? image : `${process.env.HOST_NAME}/products/${image}`;
    }));
    return product
  });

  return updatedProducts;
};
