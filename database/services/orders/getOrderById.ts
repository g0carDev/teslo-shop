import { db } from "@database";
import { IOrder } from "@interfaces";
import { Order } from "@models";
import { isValidObjectId } from "mongoose";

export const getOrderById = async (id: string): Promise<IOrder | null> => {
    if( !isValidObjectId(id) ) return null
    
    await db.connect()
    const order = await Order.findById(id).lean()
    await db.disconnect()

    if( !order ) return null

    return JSON.parse( JSON.stringify(order) )
}