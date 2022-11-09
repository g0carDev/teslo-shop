import { type FC, useContext } from 'react';
import NextLink from 'next/link';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CardActionArea from '@mui/material/CardActionArea';
import CardMedia from '@mui/material/CardMedia';
import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';

import { ItemCounter } from '@components';
import { CartContext } from '@context';
import type { ICartProduct, IOrderItem } from '@interfaces';

interface Props {
  isEditable?: boolean;
  products?: IOrderItem[];
}

export const CartList: FC<Props> = ({ isEditable = false, products = [] }) => {
  const { cart, updateCartQuantity, removeCartProduct } = useContext(CartContext);

  const onNewCartQuantityValue = (newQuantityValue: number, product: ICartProduct) => {
    product.quantity = newQuantityValue;
    updateCartQuantity(product);
  };

  const productsToShow = products.length > 0 ? products : cart;

  return (
    <>
      {productsToShow.map((product) => (
        <Grid container key={product.slug + product.size} spacing={2}>
          <Grid item xs={3}>
            <NextLink href={`/product/${product.slug}`} passHref>
              <Link>
                <CardActionArea>
                  <CardMedia image={product.image} component='img' sx={{ borderRadius: '5px' }} />
                </CardActionArea>
              </Link>
            </NextLink>
          </Grid>
          <Grid item xs={7}>
            <Box display='flex' flexDirection='column'>
              <Typography variant='body1'>{product.title}</Typography>
              <Typography variant='body1'>
                Talla: <strong>{product.size}</strong>
              </Typography>
              {isEditable ? (
                <ItemCounter
                  currentValue={product.quantity}
                  updatedQuantity={(value) => onNewCartQuantityValue(value, product as ICartProduct)}
                  maxValue={10}
                />
              ) : (
                <Typography>
                  Cantidad:{' '}
                  <strong>
                    {product.quantity} {product.quantity > 1 ? 'Productos' : 'Producto'}
                  </strong>
                </Typography>
              )}
            </Box>
          </Grid>
          <Grid item xs={2} display='flex' alignItems='center' flexDirection='column'>
            <Typography variant='subtitle1'>
              {'$'}
              {product.price}
            </Typography>
            {isEditable && (
              <Button variant='text' color='secondary' onClick={() => removeCartProduct(product as ICartProduct)}>
                Remover
              </Button>
            )}
          </Grid>
        </Grid>
      ))}
    </>
  );
};
