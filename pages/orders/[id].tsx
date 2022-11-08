import { useState } from 'react';
import type { NextPage, GetServerSideProps } from 'next';
import { useRouter } from 'next/router';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import CreditCardOffOutlined from '@mui/icons-material/CreditCardOffOutlined';
import CreditScoreOutlined from '@mui/icons-material/CreditScoreOutlined';

import { PayPalButtons } from '@paypal/react-paypal-js';
import { getSession } from 'next-auth/react';
import { ShopLayout } from '@layouts';
import { CartList, OrderSummary } from '@components';
import { tesloApi } from '@api';
import { getOrderById } from '@services';
import type { IOrder } from '@interfaces';
import { CircularProgress } from '@mui/material';

export type OrderResponseBody = {
  id: string;
  status: 'COMPLETED' | 'SAVED' | 'APPROVED' | 'VOIDED' | 'PAYER_ACTION_REQUIRED';
};

interface Props {
  order: IOrder;
}

const OrderPage: NextPage<Props> = ({ order }) => {
  const { _id, shippingAddress, isPaid, numberOfProducts, orderItems, subtotal, tax, total } = order;
  const [isPaying, setIsPaying] = useState(false);
  const router = useRouter();

  const onOrderCompleted = async (details: OrderResponseBody) => {
    if (details.status !== 'COMPLETED') {
      return alert('Payment failed');
    }

    try {
      setIsPaying(true);
      await tesloApi.post('/orders/pay', {
        orderId: _id,
        transactionId: details.id,
      });

      router.reload();
    } catch (error) {
      console.log(error);
      alert('Payment failed');
    }
  };
  return (
    <ShopLayout title='Resumen de la orden' pageDescription='Resumen de la orden'>
      <Typography variant='h1' component='h1'>
        Orden #{_id}
      </Typography>
      {isPaid ? (
        <Chip
          sx={{ my: 2 }}
          label='La orden ya fue pagada'
          variant='outlined'
          color='success'
          icon={<CreditScoreOutlined />}
        />
      ) : (
        <Chip
          sx={{ my: 2 }}
          label='Pendiente de pago'
          variant='outlined'
          color='error'
          icon={<CreditCardOffOutlined />}
        />
      )}
      <Grid container className='fadeIn'>
        <Grid item xs={12} sm={7}>
          <CartList products={orderItems} />
        </Grid>
        <Grid item xs={12} sm={5}>
          <Card className='summary-card'>
            <CardContent sx={{ p: 2 }}>
              <Typography variant='h2' component='h2'>
                Resumen ({numberOfProducts} {numberOfProducts === 1 ? 'Producto' : 'Productos'})
              </Typography>
              <Divider sx={{ my: 1 }} />
              <Box display='flex' justifyContent='space-between'>
                <Typography variant='subtitle1'>Dirección de entrega</Typography>
              </Box>
              <Typography>
                {shippingAddress.firstName} {shippingAddress.lastName}
              </Typography>
              <Typography>
                {shippingAddress.address} {shippingAddress.address2 ? `. ${shippingAddress.address2}` : ''}{' '}
              </Typography>
              <Typography>
                {shippingAddress.city}, CP. {shippingAddress.zip}
              </Typography>
              <Typography>{shippingAddress.phone}</Typography>

              <Divider sx={{ my: 1 }} />
              <OrderSummary
                orderValues={{
                  numberOfProducts,
                  subtotal,
                  tax,
                  total,
                }}
              />
              <Box sx={{ mt: 3 }} display='flex' flexDirection='column'>
                <Box
                  display='flex'
                  className='fadeIn'
                  justifyContent='center'
                  sx={{ display: isPaying ? 'flex' : 'none' }}
                >
                  <CircularProgress />
                </Box>
                <Box sx={{ mt: 3, display: isPaying ? 'none' : 'flex', flex: 1 }} flexDirection='column'>
                  {isPaid ? (
                    <Chip
                      sx={{ my: 2 }}
                      label='La orden ya fue pagada'
                      variant='outlined'
                      color='success'
                      icon={<CreditScoreOutlined />}
                    />
                  ) : (
                    <PayPalButtons
                      createOrder={(data, actions) => {
                        return actions.order.create({
                          purchase_units: [
                            {
                              amount: {
                                value: `${total}`,
                              },
                            },
                          ],
                        });
                      }}
                      onApprove={(data, actions) => {
                        return actions.order!.capture().then((details) => {
                          // console.log({details})
                          // const name = details.payer.name!.given_name;
                          onOrderCompleted(details);
                        });
                      }}
                    />
                  )}
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </ShopLayout>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ req, query }) => {
  const { id } = query as { id: string };
  const session: any = await getSession({ req });

  if (!session) {
    return {
      redirect: {
        destination: `/auth/login?page=/orders/${id}`,
        permanent: false,
      },
    };
  }

  const order = await getOrderById(id);

  if (!order) {
    return {
      redirect: {
        destination: `/orders/history`,
        permanent: false,
      },
    };
  }

  if (order.user !== session.user._id) {
    return {
      redirect: {
        destination: `/orders/history`,
        permanent: false,
      },
    };
  }

  return {
    props: {
      order,
    },
  };
};

export default OrderPage;
