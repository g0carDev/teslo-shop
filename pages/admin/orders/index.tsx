import type { NextPage } from 'next';

import { DataGrid, type GridColDef } from '@mui/x-data-grid';
import Grid from '@mui/material/Grid';
import Chip from '@mui/material/Chip';

import ConfirmationNumberOutlined from '@mui/icons-material/ConfirmationNumberOutlined';

import useSWR from 'swr';
import { AdminLayout } from '@layouts';
import type { IOrder, IUser } from '@interfaces';

const columns: GridColDef[] = [
  { field: 'id', headerName: 'Orden ID', width: 250 },
  { field: 'email', headerName: 'Correo', width: 250 },
  { field: 'name', headerName: 'Nombre Completo', width: 300 },
  { field: 'total', headerName: 'Monto total', width: 150 },
  {
    field: 'isPaid',
    headerName: 'Pagada',
    width: 150,
    renderCell: ({ row }) => {
      return row.isPaid ? (
        <Chip color='success' label='Pagada' variant='outlined' />
      ) : (
        <Chip color='error' label='Pendiente' variant='outlined' />
      );
    },
  },
  { field: 'numberOfProducts', headerName: 'No. Productos', align: 'center', width: 150 },
  {
    field: 'check',
    headerName: 'Ver orden',
    width: 200,
    sortable: false,
    renderCell: (params) => {
      return (
        <a href={`/admin/orders/${params.row.orderId}`} target='_blank' rel='noreferrer'>
          Ver Orden
        </a>
      );
    },
  },
  { field: 'createdAt', headerName: 'Creada el', width: 300 },
];

const OrdersPage: NextPage = () => {
  const { data, error } = useSWR<IOrder[]>('/api/admin/orders');

  if (!data && !error) return <></>;
  if (error) return <div>Error al obtener ordenes</div>;

  const rows = data!.map((order, index) => ({
    id: index + 1,
    orderId: order._id,
    email: (order.user as IUser).email,
    name: (order.user as IUser).name,
    total: order.total,
    isPaid: order.isPaid,
    numberOfProducts: order.numberOfProducts,
    createdAt: order.createdAt,
  }));

  return (
    <AdminLayout title='Ordenes' subtitle='Mantenimiento de ordenes' icon={<ConfirmationNumberOutlined />}>
      <Grid container className='fadeIn'>
        <Grid item sx={{ height: 650, width: '100%' }}>
          <DataGrid columns={columns} rows={rows} pageSize={10} rowsPerPageOptions={[10]} />
        </Grid>
      </Grid>
    </AdminLayout>
  );
};

export default OrdersPage;
