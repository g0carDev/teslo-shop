import { useContext, useEffect } from 'react';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import Grid from '@mui/material/Grid';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

import { ShopLayout } from '@layouts';
import { useForm } from 'react-hook-form';
import Cookie from 'js-cookie';
import { CartContext } from '@context';
import { countries } from '@utils';

interface FormData {
  firstName: string;
  lastName: string;
  address: string;
  address2?: string;
  city: string;
  zip: string;
  country: string;
  phone: string;
}

const getAddressFromCookies = (): FormData => {
  return {
    firstName : Cookie.get('firstName') || '',
    lastName  : Cookie.get('lastName')  || '',
    address   : Cookie.get('address')   || '',
    address2  : Cookie.get('address2')  || '',
    city      : Cookie.get('city')      || '',
    zip       : Cookie.get('zip')       || '',
    country   : Cookie.get('country')   || '',
    phone     : Cookie.get('phone')     || '',
  }
}

const AddressPage: NextPage = () => {
  const router = useRouter();
  const { updateAddress } = useContext(CartContext);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      firstName : '',
      lastName : '',
      address : '',
      address2 : '',
      city : '',
      zip : '',
      country : '',
      phone : '',
    }
  });

  useEffect(() => {
    reset(getAddressFromCookies())
  }, [reset])

  const onAddressForm = (data: FormData) => {
    updateAddress(data)
    router.push('/checkout/summary');
  };
  return (
    <ShopLayout title='Dirección' pageDescription='Confirmar dirección del destino'>
      <Typography variant='h1' component='h1'>
        Dirección
      </Typography>
      <form onSubmit={handleSubmit(onAddressForm)}>
        <Grid container spacing={2} sx={{ mt: 2 }}>
          <Grid item xs={12} sm={6}>
            <TextField
              {...register('firstName', { required: 'Este campo es obligatorio' })}
              label='Nombre'
              variant='filled'
              fullWidth
              error={!!errors.firstName}
              helperText={errors.firstName?.message}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              {...register('lastName', { required: 'Este campo es obligatorio' })}
              label='Apellido'
              variant='filled'
              fullWidth
              error={!!errors.lastName}
              helperText={errors.lastName?.message}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              {...register('address', { required: 'Este campo es obligatorio' })}
              label='Dirección'
              variant='filled'
              fullWidth
              error={!!errors.address}
              helperText={errors.address?.message}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField {...register('address2')} label='Dirección 2 (opcional)' variant='filled' fullWidth />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              {...register('zip', { required: 'Este campo es obligatorio' })}
              label='Código Postal'
              variant='filled'
              fullWidth
              error={!!errors.zip}
              helperText={errors.zip?.message}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              {...register('city', { required: 'Este campo es obligatorio' })}
              label='Ciudad'
              variant='filled'
              fullWidth
              error={!!errors.city}
              helperText={errors.city?.message}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <TextField
                select
                {...register('country', { required: 'Este campo es obligatorio' })}
                variant='filled'
                label='País'
                value={Cookie.get('country') ?? 'MEX'}
                defaultValue={Cookie.get('country') ?? 'MEX'}
                error={!!errors.country}
                helperText={errors.country?.message}
              >
                {countries.map((country) => (
                  <MenuItem key={country.code} value={country.code}>
                    {country.name}
                  </MenuItem>
                ))}
              </TextField>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              {...register('phone', { required: 'Este campo es obligatorio' })}
              label='Teléfono'
              variant='filled'
              fullWidth
              error={!!errors.phone}
              helperText={errors.phone?.message}
            />
          </Grid>
        </Grid>
        <Box sx={{ mt: 5 }} display='flex' justifyContent='center'>
          <Button color='secondary' className='circular-btn' type='submit'>
            Revisar pedido
          </Button>
        </Box>
      </form>
    </ShopLayout>
  );
};


export default AddressPage;
