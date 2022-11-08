import type { NextPage, GetServerSideProps } from 'next';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import CreditCardOffOutlined from '@mui/icons-material/CreditCardOffOutlined';
import CreditScoreOutlined from '@mui/icons-material/CreditScoreOutlined';
import ConfirmationNumberOutlined from '@mui/icons-material/ConfirmationNumberOutlined';

import { AdminLayout } from '@layouts';
import { CartList, OrderSummary } from '@components';
import { getOrderById } from '@services';
import type { IOrder } from '@interfaces';

export type OrderResponseBody = {
  id: string;
  status: 'COMPLETED' | 'SAVED' | 'APPROVED' | 'VOIDED' | 'PAYER_ACTION_REQUIRED';
};

interface Props {
  order: IOrder;
}

const AdminOrdersPage: NextPage<Props> = ({ order }) => {
  const { _id, shippingAddress, isPaid, numberOfProducts, orderItems, subtotal, tax, total } = order;
  return (
    <AdminLayout title='Resumen de la orden' subtitle={`Orden ID: ${_id}`} icon={<ConfirmationNumberOutlined />}>
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
                <Box sx={{ mt: 3, flex: 1 }} display='flex' flexDirection='column'>
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
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </AdminLayout>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ req, query }) => {
  const { id } = query as { id: string };

  const order = await getOrderById(id);

  if (!order) {
    return {
      redirect: {
        destination: '/admin/orders',
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

export default AdminOrdersPage;
