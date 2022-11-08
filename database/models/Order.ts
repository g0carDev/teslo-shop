import mongoose, { Schema, model, Model } from 'mongoose';
import type { IOrder } from '@interfaces';

const OrderSchema: Schema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    orderItems: [
      {
        _id: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
        title: { type: String, required: true },
        size: { type: String, required: true },
        quantity: { type: Number, required: true },
        slug: { type: String, required: true },
        image: { type: String, required: true },
        price: { type: Number, required: true },
        gender: [{
          type: String,
          enum: {
              values: ['men', 'women', 'kid', 'unisex'],
              message: '{VALUE} no es un genero válido'
          }
      }],
      },
    ],
    shippingAddress: {
      firstName: { type: String, required: true },
      lastName: { type: String, required: true },
      address: { type: String, required: true },
      address2: { type: String },
      city: { type: String, required: true },
      zip: { type: String, required: true },
      country: { type: String, required: true },
      phone: { type: String, required: true },
    },
    paymentResult: { type: String },
    numberOfProducts: { type: Number, required: true },
    subtotal: { type: Number, required: true },
    tax: { type: Number, required: true },
    total: { type: Number, required: true },
    isPaid: { type: Boolean, required: true },
    paidAt: { type: String },
    transactionId: { type: String },
  },
  {
    timestamps: true,
  }
);

const OrderModel: Model<IOrder> = mongoose.models.Order || model('Order', OrderSchema);

export default OrderModel;
