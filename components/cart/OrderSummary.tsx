import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { formatPrice } from '@utils';
import { FC, useContext } from 'react';
import { CartContext } from '../../context/cart/CartContext';

interface Props {
  orderValues?: {
    numberOfProducts: number;
    subtotal: number;
    tax: number;
    total: number;
  }
}

export const OrderSummary: FC<Props> = ({  orderValues }) => {
  const { numberOfProducts, subtotal, tax, total } = useContext(CartContext);
  const sumaryValues = orderValues ? orderValues : { numberOfProducts, subtotal, tax, total };
  return (
    <Grid container>
      <Grid item xs={6}>
        <Typography variant='body1'> No. de {`${sumaryValues.numberOfProducts > 1 ? 'productos' : 'producto'}`}</Typography>
      </Grid>
      <Grid item xs={6} display='flex' justifyContent='end'>
        <Typography>{sumaryValues.numberOfProducts}</Typography>
      </Grid>
      <Grid item xs={6}>
        <Typography>Subtotal</Typography>
      </Grid>
      <Grid item xs={6} display='flex' justifyContent='end'>
        <Typography>{formatPrice(sumaryValues.subtotal)}</Typography>
      </Grid>
      <Grid item xs={6}>
        <Typography>Impuestos ({Number(process.env.NEXT_PUBLIC_TAX_RATE) * 100}%)</Typography>
      </Grid>
      <Grid item xs={6} display='flex' justifyContent='end'>
        <Typography>{formatPrice(sumaryValues.tax)}</Typography>
      </Grid>
      <Grid item xs={6} sx={{ mt: 2 }}>
        <Typography variant='subtitle1'>Total: </Typography>
      </Grid>
      <Grid item xs={6} sx={{ mt: 2 }} display='flex' justifyContent='end'>
        <Typography variant='subtitle1'>{formatPrice(sumaryValues.total)}</Typography>
      </Grid>
    </Grid>
  );
};
