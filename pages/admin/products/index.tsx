import type { NextPage } from 'next';
import NextLink from 'next/link';

import { DataGrid, type GridColDef } from '@mui/x-data-grid';
import Grid from '@mui/material/Grid';
import CardMedia from '@mui/material/CardMedia';
import Link from '@mui/material/Link';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';

import CategoryOutlined from '@mui/icons-material/CategoryOutlined';
import AddOutlined from '@mui/icons-material/AddOutlined';

import useSWR from 'swr';
import { AdminLayout } from '@layouts';
import { formatPrice } from '@utils';
import type { IProduct } from '@interfaces';

const columns: GridColDef[] = [
  {
    field: 'img',
    headerName: 'Foto',
    renderCell: ({ row }) => {
      return (
        <a href={`/product/${row.slug}`} target='_blank' rel='noreferrer'>
          <CardMedia component='img' className='fadeIn' image={row.img} />
        </a>
      );
    },
  },
  {
    field: 'title',
    headerName: 'Titulo',
    renderCell: ({ row }) => {
      return (
        <NextLink href={`/admin/products/${row.slug}`} passHref>
          <Link underline='always'> {row.title}</Link>
        </NextLink>
      );
    },
    width: 250,
  },
  { field: 'gender', headerName: 'Genero' },
  { field: 'type', headerName: 'Tipo' },
  { field: 'inStock', headerName: 'Inventario' },
  { field: 'price', headerName: 'Precio', renderCell: ({ row }) => formatPrice(row.price) },
  { field: 'sizes', headerName: 'Tallas', width: 250 },
];

const ProductsPage: NextPage = () => {
  const { data, error } = useSWR<IProduct[]>('/api/admin/products');

  if (!data && !error) return <></>;
  if (error) return <div>Error al obtener productos</div>;

  const rows = data!.map((product, index) => ({
    id: index + 1,
    img: product.images[0],
    title: product.title,
    gender: product.gender,
    type: product.type,
    inStock: product.inStock,
    price: product.price,
    sizes: product.sizes.join(', '),
    slug: product.slug,
  }));

  return (
    <AdminLayout title='Productos' subtitle='Mantenimiento de productos' icon={<CategoryOutlined />}>
      <Box display='flex' justifyContent='end' sx={{ mb: 2 }}>
        <Button
          color='secondary'
          startIcon={<AddOutlined />}
          sx={{ width: '150px' }}
          href='/admin/products/new'
        >
          Crear Producto
        </Button>
      </Box>{' '}
      <Grid container className='fadeIn'>
        <Grid item sx={{ height: 650, width: '100%' }}>
          <DataGrid columns={columns} rows={rows} pageSize={10} rowsPerPageOptions={[10]} />
        </Grid>
      </Grid>
    </AdminLayout>
  );
};

export default ProductsPage;
