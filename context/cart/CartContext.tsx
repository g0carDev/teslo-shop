import { createContext } from 'react';
import type { ICartProduct, IShippingAddress } from '@interfaces';

interface ContextProps {
  cart: ICartProduct[];
  numberOfProducts: number;
  subtotal: number;
  isLoaded: boolean;
  tax: number;
  total: number;
  shippingAddress?: IShippingAddress
  addProductToCart: (product: ICartProduct) => void;
  updateCartQuantity: (product: ICartProduct) => void;
  removeCartProduct: (product: ICartProduct) => void;
  updateAddress: (address: IShippingAddress) => void;
  createOrder: () => Promise<{ hashError: boolean, message: string }>;
}

export const CartContext = createContext<ContextProps>({} as ContextProps);
