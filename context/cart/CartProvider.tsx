import { FC, ReactNode, useEffect, useReducer, useState } from 'react';
import Cookie from 'js-cookie';
import { CartContext, cartReducer } from './';
import type { ICartProduct, IOrder, IShippingAddress } from '@interfaces';
import { tesloApi } from '@api';
import axios from 'axios';

export interface CartStateProps {
  isLoaded: boolean;
  cart: ICartProduct[];
  numberOfProducts: number;
  subtotal: number;
  tax: number;
  total: number;
  shippingAddress?: IShippingAddress;
}

interface ProviderProps {
  children: ReactNode;
}

const CART_INITIAL_STATE: CartStateProps = {
  isLoaded: false,
  cart: [],
  numberOfProducts: 0,
  subtotal: 0,
  tax: 0,
  total: 0,
  shippingAddress: undefined,
};

export const CartProvider: FC<ProviderProps> = ({ children }) => {
  const [cartState] = useState<ICartProduct[]>(JSON.parse(Cookie.get('cart') || '[]'));
  const [state, dispatch] = useReducer(cartReducer, CART_INITIAL_STATE);

  useEffect(() => {
    try {
      dispatch({
        type: '[Cart] - LoadCart from cookies | storage',
        payload: cartState,
      });
    } catch (error) {
      console.error(error);
      dispatch({
        type: '[Cart] - LoadCart from cookies | storage',
        payload: [],
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (Cookie.get('firstName') !== undefined) {
      const shippingAddress: IShippingAddress = {
        firstName: Cookie.get('firstName') || '',
        lastName: Cookie.get('lastName') || '',
        address: Cookie.get('address') || '',
        address2: Cookie.get('address2') || '',
        city: Cookie.get('city') || '',
        zip: Cookie.get('zip') || '',
        country: Cookie.get('country') || '',
        phone: Cookie.get('phone') || '',
      };
      dispatch({ type: '[Cart] - LoadAddress from cookies', payload: shippingAddress });
    }
  }, []);

  useEffect(() => {
    Cookie.set('cart', JSON.stringify(state.cart));
  }, [state.cart]);

  useEffect(() => {
    const numberOfProducts = state.cart.reduce((prev, product) => product.quantity + prev, 0);
    const subtotal = state.cart.reduce((prev, product) => product.price * product.quantity + prev, 0);
    const taxRate = Number(process.env.NEXT_PUBLIC_TAX_RATE || 0.16);
    const orderSummary = {
      numberOfProducts,
      subtotal,
      tax: subtotal * taxRate,
      total: subtotal * (taxRate + 1),
    };
    dispatch({ type: '[Cart] - Update order summary', payload: orderSummary });
  }, [state.cart]);

  const addProductToCart = (newProduct: ICartProduct) => {
    const condition = (cartProduct: ICartProduct) =>
      cartProduct._id === newProduct._id && cartProduct.size === newProduct.size;
    const productInCart = state.cart.some((cartProduct) => condition(cartProduct));

    if (!productInCart) {
      return dispatch({
        type: '[Cart] - Update Products in cart',
        payload: [...state.cart, newProduct],
      });
    }
    const updatedCart = state.cart.map((cartProduct) => {
      if (condition(cartProduct)) {
        return {
          ...cartProduct,
          quantity: cartProduct.quantity + newProduct.quantity,
        };
      }
      return cartProduct;
    });
    dispatch({
      type: '[Cart] - Update Products in cart',
      payload: updatedCart,
    });
  };
  const updateCartQuantity = (product: ICartProduct) => {
    const updatedCart = state.cart.map((cartProduct) => {
      if (cartProduct._id !== product._id || cartProduct.size !== product.size) return cartProduct;
      return product;
    });
    dispatch({
      type: '[Cart] - Change cart quantity',
      payload: updatedCart,
    });
  };
  const removeCartProduct = (product: ICartProduct) => {
    const updatedCart = state.cart.filter(
      (cartProduct) => !(cartProduct._id === product._id && cartProduct.size === product.size)
    );
    dispatch({
      type: '[Cart] - Remove product in cart',
      payload: updatedCart,
    });
  };
  const updateAddress = (address: IShippingAddress) => {
    Cookie.set('firstName', address.firstName);
    Cookie.set('lastName', address.lastName);
    Cookie.set('address', address.address);
    Cookie.set('address2', address.address2 || '');
    Cookie.set('city', address.city);
    Cookie.set('zip', address.zip);
    Cookie.set('country', address.country);
    Cookie.set('phone', address.phone);
    dispatch({
      type: '[Cart] - Update address',
      payload: address,
    });
  };

  const createOrder = async (): Promise<{ hashError: boolean; message: string }> => {
    if (!state.shippingAddress) {
      throw new Error('No shipping address');
    }
    try {
      const body: IOrder = {
        orderItems: state.cart.map((product) => ({
          ...product,
          size: product.size!,
        })),
        shippingAddress: state.shippingAddress,
        numberOfProducts: state.numberOfProducts,
        subtotal: state.subtotal,
        tax: state.tax,
        total: state.total,
        isPaid: false,
      };
      const { data } = await tesloApi.post<IOrder>('/orders', body);
      dispatch({ type: '[Cart] - Order complete'});
      return { hashError: false, message: data._id! };
    } catch (error) {
      console.log(error);
      if (axios.isAxiosError(error)) {
        return { hashError: true, message: error.response?.data.message };
      }
      return { hashError: true, message: 'Uncontroller error, talk with administrator' };
    }
  };

  return (
    <CartContext.Provider
      value={{
        ...state,
        //methods
        addProductToCart,
        updateCartQuantity,
        removeCartProduct,
        updateAddress,
        //orders
        createOrder,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
