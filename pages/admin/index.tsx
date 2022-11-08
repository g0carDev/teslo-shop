import type { NextPage } from 'next';
import { useState, useEffect } from 'react';

import Grid from '@mui/material/Grid';

import DashboardOutlined from '@mui/icons-material/DashboardOutlined';
import CreditCardOffOutlined from '@mui/icons-material/CreditCardOffOutlined';
import CreditCardOutlined from '@mui/icons-material/CreditCardOutlined';
import AttachMoneyOutlined from '@mui/icons-material/AttachMoneyOutlined';
import GroupOutlined from '@mui/icons-material/GroupOutlined';
import CategoryOutlined from '@mui/icons-material/CategoryOutlined';
import CancelPresentationOutlined from '@mui/icons-material/CancelPresentationOutlined';
import ProductionQuantityLimitsOutlined from '@mui/icons-material/ProductionQuantityLimitsOutlined';
import AccessTimeOutlined from '@mui/icons-material/AccessTimeOutlined';

import useSWR from 'swr';
import { AdminLayout } from '@layouts';
import { SummaryTile } from '@components';

import type { DashboardSummaryResponse } from '@interfaces';
import Typography from '@mui/material/Typography';

const DashboardPage: NextPage = () => {
  const { data, error } = useSWR<DashboardSummaryResponse>('/api/admin/dashboard', {
    refreshInterval: 30000, // 30 seconds
  });

  const [refreshIn, setRefreshIn] = useState(30)

  useEffect(() => {
    const interval = setInterval(() => {
      setRefreshIn(refreshIn => refreshIn > 0 ? refreshIn - 1 : 30)
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  if (!data && !error) {
    return <></>;
  }

  if (error) {
    console.log(error);
    return <Typography>Error al cargar la información</Typography>;
  }

  const {
    numberOfOrders,
    numberOfProducts,
    numberOfClients,
    paidOrders,
    notPaidOrders,
    lowInventory,
    productsWithNoInventory,
  } = data!;

  return (
    <AdminLayout title='Dashboard' subtitle='Estadisticas Generales' icon={<DashboardOutlined />}>
      <Grid container spacing={2}>
        <SummaryTile
          title={numberOfOrders}
          subtitle={'Ordenes totales'}
          icon={<CreditCardOutlined color='secondary' sx={{ fontSize: 40 }} />}
        />
        <SummaryTile
          title={paidOrders}
          subtitle={'Ordenes pagadas'}
          icon={<AttachMoneyOutlined color='success' sx={{ fontSize: 40 }} />}
        />
        <SummaryTile
          title={notPaidOrders}
          subtitle={'Ordenes pendientes'}
          icon={<CreditCardOffOutlined color='error' sx={{ fontSize: 40 }} />}
        />
        <SummaryTile title={numberOfClients} subtitle={'Clientes'} icon={<GroupOutlined color='primary' sx={{ fontSize: 40 }} />} />
        <SummaryTile
          title={numberOfProducts}
          subtitle={'Productos'}
          icon={<CategoryOutlined color='warning' sx={{ fontSize: 40 }} />}
        />
        <SummaryTile
          title={productsWithNoInventory}
          subtitle={'Productos Sin Existencias'}
          icon={<CancelPresentationOutlined color='error' sx={{ fontSize: 40 }} />}
        />
        <SummaryTile
          title={lowInventory}
          subtitle={'Bajo Invenario'}
          icon={<ProductionQuantityLimitsOutlined color='warning' sx={{ fontSize: 40 }} />}
        />
        <SummaryTile
          title={refreshIn}
          subtitle={'Actualizacion en:'}
          icon={<AccessTimeOutlined color='secondary' sx={{ fontSize: 40 }} />}
        />
      </Grid>
    </AdminLayout>
  );
};

export default DashboardPage;
