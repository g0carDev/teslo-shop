import { useState, useEffect } from 'react';
import type { NextPage } from 'next';

import { DataGrid, type GridColDef } from '@mui/x-data-grid';
import Grid from '@mui/material/Grid';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import PeopleOutlined from '@mui/icons-material/PeopleOutlined';

import useSWR from 'swr';
import { tesloApi } from '@api';
import { AdminLayout } from '@layouts';
import type { IUser } from '@interfaces';

const UsersPage: NextPage = () => {
  const { data, error } = useSWR<IUser[]>('/api/admin/users');
  const [users, setUsers] = useState<IUser[]>([])

  useEffect(() => {
    if (data) setUsers(data)
  }, [data])
  
  if (!data && !error) return <></>;
  if (error) return <div>Error al obtener usuarios</div>;

  const onRoleUpdated = async (userId: string, userRole: string) => {
    const prevUsers = Array.from(users);
    const updatedUsers = users.map((user) => ({
        ...user,
        role: user._id === userId ? userRole : user.role,
    }))
    setUsers(updatedUsers)
    try {
        await tesloApi.put(`/admin/users`, {userId, role: userRole });
    } catch (error) {
        setUsers(prevUsers)
        console.log(error);
        alert('Error al actualizar el rol del usuario');
    }
  }

  const columns: GridColDef[] = [
    { field: 'id', headerName: '#ID', width: 250 },
    { field: 'email', headerName: 'Correo', width: 250 },
    { field: 'name', headerName: 'Nombre completo', width: 300 },
    {
      field: 'role',
      headerName: 'Rol',
      width: 300,
      renderCell: ({ row }) => {
        return (
          <Select value={row.role} label='Rol' sx={{ width: '300px' }}
          onChange={({target}) => onRoleUpdated(row.userId, target.value)}>
            <MenuItem value='admin'>Administrador</MenuItem>
            <MenuItem value='client'>Cliente</MenuItem>
            <MenuItem value='super-user'>Super Usuario</MenuItem>
            <MenuItem value='SEO'>SEO</MenuItem>
          </Select>
        );
      },
    },
  ];

  const rows = users.map((user, index) => ({
    id: index + 1,
    email: user.email,
    name: user.name,
    role: user.role,
    userId: user._id,
  }));

  return (
    <AdminLayout title='Usuarios' subtitle='Mantenimiento de usuarios' icon={<PeopleOutlined />} >
      <Grid container className='fadeIn'>
        <Grid item sx={{ height: 650, width: '100%' }}>
          <DataGrid columns={columns} rows={rows} pageSize={10} rowsPerPageOptions={[10]} />
        </Grid>
      </Grid>
    </AdminLayout>
  );
};

export default UsersPage;
