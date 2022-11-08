import { db } from "@database";
import { IOrder } from "@interfaces";
import { Order } from "@models";
import { isValidObjectId } from "mongoose";

export const getOrdersByUserId = async (userId: string): Promise<IOrder[]> => {
    if( !isValidObjectId(userId) ) return []
    
    await db.connect()
    const orders = await Order.find({user: userId}).lean()
    await db.disconnect()

    return JSON.parse( JSON.stringify(orders) )
}