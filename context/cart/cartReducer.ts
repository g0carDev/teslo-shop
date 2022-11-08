import type { ICartProduct, IShippingAddress } from '@interfaces';
import type { CartStateProps } from './';

type CartActionType =
  | { type: '[Cart] - LoadCart from cookies | storage'; payload: ICartProduct[] }
  | { type: '[Cart] - Update Products in cart'; payload: ICartProduct[] }
  | { type: '[Cart] - Change cart quantity'; payload: ICartProduct[] }
  | { type: '[Cart] - Remove product in cart'; payload: ICartProduct[] }
  | { type: '[Cart] - Update order summary'; payload: OrderSumary }
  | { type: '[Cart] - LoadAddress from cookies'; payload: IShippingAddress }
  | { type: '[Cart] - Update address'; payload: IShippingAddress }
  | { type: '[Cart] - Order complete' };

interface OrderSumary {
  numberOfProducts: number;
  subtotal: number;
  tax: number;
  total: number;
}

export const cartReducer = (state: CartStateProps, action: CartActionType): CartStateProps => {
  switch (action.type) {
    case '[Cart] - LoadCart from cookies | storage':
      return { ...state, isLoaded: true, cart: [...action.payload] };
    case '[Cart] - Update Products in cart':
      return { ...state, cart: action.payload };
    case '[Cart] - Change cart quantity':
      return { ...state, cart: action.payload };
    case '[Cart] - Remove product in cart':
      return { ...state, cart: action.payload };
    case '[Cart] - Update order summary':
      return { ...state, ...action.payload };
    case '[Cart] - Update address':
    case '[Cart] - LoadAddress from cookies':
      return { ...state, shippingAddress: action.payload };
    case '[Cart] - Order complete':
      return { ...state, cart: [], numberOfProducts: 0, subtotal: 0, tax: 0, total: 0 };
    default:
      return state;
  }
};
