import type { FC } from 'react';
import Grid from '@mui/material/Grid';
import { ProductCard } from '.';
import type { IProduct } from '@interfaces';

interface Props {
  products: IProduct[];
}
export const ProductList: FC<Props> = ({ products }) => {
  return (
    <Grid container spacing={4}>
      {products.map(product => (
        <ProductCard key={product.slug} product={product} />
      ))}
    </Grid>
  );
};
