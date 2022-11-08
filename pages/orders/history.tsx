import type { NextPage, GetServerSideProps } from 'next';
import NextLink from 'next/link';
import { Chip, Grid, Link, Typography } from '@mui/material';
import { DataGrid, type GridColDef } from '@mui/x-data-grid';
import { getSession } from 'next-auth/react';
import { ShopLayout } from '@layouts';
import { getOrdersByUserId } from '@services';
import { IOrder } from '../../interfaces/order';

const columns: GridColDef[] = [
  { field: 'id', headerName: 'ID', width: 100 },
  { field: 'fullname', headerName: 'Nombre Completo', width: 300 },
  {
    field: 'paid',
    headerName: 'Pagada',
    description: 'Muestra información si la orden está pagada',
    width: 150,
    renderCell: ({ value }) => {
      return value ? (
        <Chip color='success' label='Pagada' variant='outlined' />
      ) : (
        <Chip color='error' label='No Pagada' variant='outlined' />
      );
    },
  },
  {
    field: 'ordern',
    headerName: 'Link',
    width: 200,
    sortable: false,
    renderCell: (params) => {
      return (
        <NextLink href={`/orders/${params.row.orderId}`} passHref>
          <Link underline='always'>Ver Orden</Link>
        </NextLink>
      );
    },
  },
];

interface Props {
  orders: IOrder[];
}

const HistoryPage: NextPage<Props> = ({ orders }) => {
  const rows = orders.map((order, index) => ({
    id:  index + 1,
    paid: order.isPaid,
    fullname: `${ order.shippingAddress.firstName} ${order.shippingAddress.lastName}`,
    orderId: order._id,
  }))
  return (
    <ShopLayout
      title='Historial de ordenes'
      pageDescription='Historial de ordenes del cliente'
    >
      <Typography variant='h1' component='h1'>
        Historial de ordenes
      </Typography>
      <Grid container className='fadeIn'>
        <Grid item sx={{ height: 650, width: '100%' }}>
          <DataGrid
            columns={columns}
            rows={rows}
            pageSize={10}
            rowsPerPageOptions={[10]}
          />
        </Grid>
      </Grid>
    </ShopLayout>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ req, query }) => {
  const session: any = await getSession({ req });

  if (!session) {
    return {
      redirect: {
        destination: `/auth/login?page=/orders/history`,
        permanent: false,
      },
    };
  }
  const orders = await getOrdersByUserId(session.user._id);

  return {
    props: {
      orders
    },
  };
};

export default HistoryPage;
