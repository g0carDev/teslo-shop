import type { NextApiRequest, NextApiResponse } from 'next';
import { db, SHOP_CONSTANTS } from '@database';
import { Product } from '@models';
import type { IProduct } from '@interfaces';

type Data = { message: string } | IProduct[] | IProduct;

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  switch (req.method) {
    case 'GET':
      return getProducts(req, res);
    case 'POST':
      return createProduct(req, res);
    default:
      return res.status(400).json({ message: `Method ${req.method} Not Allowed` });
  }
}

const getProducts = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  const { gender = 'all' } = req.query;
  let condition = {};
  if (gender !== 'all' && SHOP_CONSTANTS.validGenders.includes(`${gender}`)) {
    condition = { gender };
  }
  await db.connect();
  const products = await Product.find(condition)
    .select('title price inStock images slug -_id')
    .sort({ createdAt: 'ascending' })
    .lean();
  await db.disconnect();
  res.status(200).json(products);
};

const createProduct = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  const { images, inStock, price, sizes, slug, tags, title, type, gender } = req.body;
  const newProduct = new Product({
    images,
    inStock,
    price,
    sizes,
    slug,
    tags,
    title,
    type,
    gender,
  });

  try {
    await db.connect();
    await newProduct.save();
    await db.disconnect();

    return res.status(201).json(newProduct);
  } catch (error) {
    await db.disconnect();
    console.log(error);
    return res.status(500).json({ message: 'Something went wrong ' });
  }
};
