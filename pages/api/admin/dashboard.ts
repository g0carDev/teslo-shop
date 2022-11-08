import type { NextApiRequest, NextApiResponse } from 'next';
import { db } from '@database';
import { Order, Product, User } from '@models';
import type { DashboardSummaryResponse } from '@interfaces';

type Data =
  | { message: string }
  | DashboardSummaryResponse;

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  switch (req.method) {
    case 'GET':
      return getInfo(req, res);
    default:
      return res.status(400).json({ message: `Method ${req.method} Not Allowed` });
  }
}

const getInfo = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  await db.connect();

  const [numberOfOrders, numberOfProducts, numberOfClients, paidOrders, lowInventory, productsWithNoInventory] =
    await Promise.all([
      Order.count(),
      Product.count(),
      User.count(),
      Order.count({ isPaid: true }),
      Product.count({ inStock: { $lte: 10 } }),
      Product.count({ inStock: 0 }),
    ]);

  await db.disconnect();
  return res.status(200).json({
    numberOfOrders,
    numberOfProducts,
    numberOfClients,
    paidOrders,
    notPaidOrders: numberOfOrders - paidOrders,
    lowInventory,
    productsWithNoInventory,
  });
};
