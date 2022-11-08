import type { NextApiRequest, NextApiResponse } from 'next';
import { IOrder } from '@interfaces';
import { getSession } from 'next-auth/react';
import { db } from '@database';
import { Order, Product } from '@models';

type Data = {
  message: string;
} | IOrder

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  switch (req.method) {
    case 'POST':
      return createOrder(req, res);
    default:
      return res.status(400).json({ message: `Method ${req.method} Not Allowed` });
  }
}

const createOrder = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  const { orderItems, total } = req.body as IOrder;
  //verificar que tengamos un usuario logueado
  const session: any = await getSession({ req });
  if (!session) {
    return res.status(401).json({ message: 'Not Authorized' });
  }
  const productsIds = orderItems.map((product) => product._id);
  try {
    await db.connect();
    const dbProducts = await Product.find({ _id: { $in: productsIds } });

    const subtotal = orderItems.reduce((prev, current) => {
      const currentPrice = dbProducts.find((p) => p.id === current._id)?.price;
      if (!currentPrice) {
        throw new Error('Product not found');
      }
      return currentPrice * current.quantity + prev;
    }, 0);

    const taxRate = Number(process.env.NEXT_PUBLIC_TAX_RATE || 0.16);
    const backendTotal = subtotal * (taxRate + 1);

    if (total !== backendTotal) {
      throw new Error('Total is not correct');
    }

    const userId = session.user._id;
    const newOrder = new Order({
      ...req.body,
      user: userId,
      isPaid: false,
    });
    newOrder.total = Math.round(newOrder.total * 100) / 100;
    
    await newOrder.save();
    await db.disconnect();
    return res.status(201).json(newOrder);
  } catch (error: any) {
    await db.disconnect();
    console.log(error);
    return res.status(400).json({ message: error.message || 'Review server logs' });
  }

  //   res.status(200).json({ message: 'Order Created' });
};
