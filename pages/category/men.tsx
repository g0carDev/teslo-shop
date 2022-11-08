import type { NextPage } from 'next';
import Typography from '@mui/material/Typography';
import { ShopLayout } from '@layouts';
import { ProductList, FullScreenLoading } from '@components';
import { useProducts } from '@hooks';

const MenPage: NextPage = () => {
  const { isError, isLoading, products } = useProducts('products?gender=men');
  if (isError) return <h1>Fallo la carga de data</h1>;
  return (
    <ShopLayout
      title='Teslo-Shop - Hombres'
      pageDescription='Encuentra los mejores productos de hombres aquí'
    >
      <Typography variant='h1' component='h1'>
        Tienda
      </Typography>
      <Typography variant='h2' sx={{ mb: 1 }}>
        Hombres
      </Typography>
      {isLoading ? <FullScreenLoading /> : <ProductList products={products} />}
    </ShopLayout>
  );
};

export default MenPage;
