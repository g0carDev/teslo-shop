
import { useContext, useEffect, useState } from 'react';
import type { NextPage } from 'next';
import NextLink from 'next/link';
import { useRouter } from 'next/router';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';

import { ShopLayout } from '@layouts';
import { CartList, OrderSummary } from '@components';
import { CartContext } from '@context';
import { getCountryName } from '@utils';
import Cookies from 'js-cookie';

const SummaryPage: NextPage = () => {
  const [isPosting, setIsPosting] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const { shippingAddress, numberOfProducts, createOrder } = useContext(CartContext);
  const router = useRouter();

  useEffect(() => {
    if(!Cookies.get('firstName')){
      router.replace('/checkout/address');
    }
  }, [router])

  const onCreateOrder = async () => {
    setIsPosting(true)
    const { hashError, message} = await createOrder()
    if(hashError){
      setIsPosting(false)
      setErrorMessage(message)
      return 
    }
    router.replace(`/orders/${message}`)
  }


  if(!shippingAddress) {
    return <></>
  }

  const { firstName, lastName, address, city, phone, country, zip, address2 } = shippingAddress
  return (
    <ShopLayout
      title='Resumen de la orden'
      pageDescription='Resumen de la orden'
    >
      <Typography variant='h1' component='h1'>
        Resumen de la orden
      </Typography>
      <Grid container>
        <Grid item xs={12} sm={7}>
          <CartList />
        </Grid>
        <Grid item xs={12} sm={5}>
          <Card className='summary-card'>
            <CardContent>
              <Typography variant='h2' component='h2'>
                Resumen ({numberOfProducts} {numberOfProducts > 1 ? 'productos' : 'producto'})
              </Typography>
              <Divider sx={{ my: 1 }} />
              <Box display='flex' justifyContent='space-between'>
                <Typography variant='subtitle1'>
                  Dirección de entrega
                </Typography>
                <NextLink href='/checkout/address' passHref>
                  <Link underline='always'>Editar</Link>
                </NextLink>
              </Box>

              <Typography>{firstName} {lastName}</Typography>
              <Typography>{address}{address2 ? `, ${address2}` : ''}</Typography>
              <Typography>{city} {zip}</Typography>
              <Typography>{getCountryName(country)}</Typography>
              <Typography>{phone}</Typography>
              <Divider sx={{ my: 1 }} />
              <Box display='flex' justifyContent='end'>
                <NextLink href='/cart' passHref>
                  <Link underline='always'>Editar</Link>
                </NextLink>
              </Box>
              <OrderSummary />
              <Box sx={{ mt: 3 }} display='flex' flexDirection='column'>
                <Button color='secondary' className='circular-btn' fullWidth onClick={ onCreateOrder } disabled={isPosting}>
                  Confirmar Orden
                </Button>
                <Chip 
                  color='error'
                  label={errorMessage}
                  sx={{ mt: 1, display: errorMessage ? 'flex' : 'none' }}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </ShopLayout>
  );
};

export default SummaryPage;
