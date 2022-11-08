import type { NextPage } from 'next';
import Typography from '@mui/material/Typography';
import { ShopLayout } from '@layouts';
import { ProductList, FullScreenLoading } from '@components';
import { useProducts } from '@hooks';

const WomenPage: NextPage = () => {
  const { isError, isLoading, products } = useProducts('products?gender=women');
  if (isError) return <h1>Fallo la carga de data</h1>;
  return (
    <ShopLayout
      title='Teslo-Shop - Mujeres'
      pageDescription='Encuentra los mejores productos de mujeres aquí'
    >
      <Typography variant='h1' component='h1'>
        Tienda
      </Typography>
      <Typography variant='h2' sx={{ mb: 1 }}>
        Mujeres
      </Typography>
      {isLoading ? <FullScreenLoading /> : <ProductList products={products} />}
    </ShopLayout>
  );
};

export default WomenPage;
