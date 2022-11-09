import { db } from '@database';
import { Product } from '@models';
import type { IProduct } from '@interfaces';

export const getAllProducts = async (): Promise<IProduct[]> => {
  await db.connect();
  const products = await Product.find().lean();
  await db.disconnect();
  
  const updatedProducts = products.map((product) => {
    product.images = product.images.map((image) => {
      return image.includes('http') ? image : `${process.env.HOST_NAME}/products/${image}`;
    });
    return product;
  });
  
  return JSON.parse(JSON.stringify(updatedProducts));
};
