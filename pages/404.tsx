import type { NextPage } from 'next';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { ShopLayout } from '@layouts';

const PageNotFound: NextPage = () => {
  return (
    <ShopLayout
      title='Page not found'
      pageDescription='No hay nada que encontrat aquí'
    >
      <Box
        display='flex'
        justifyContent='center'
        alignItems='center'
        height='calc(100vh - 200px)'
        sx={{ flexDirection: { xs: 'column', sm: 'row' } }}
      >
        <Typography variant='h1' component='h1' fontSize={50} fontWeight={200}>
          404 |{' '}
        </Typography>
        <Typography marginLeft={2} textAlign='center'>
          Ups! Parece que no existe la página que solicitaste
        </Typography>
      </Box>
    </ShopLayout>
  );
};

export default PageNotFound;
