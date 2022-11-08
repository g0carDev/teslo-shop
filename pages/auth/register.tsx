import { useState, useContext, useEffect } from 'react';
import type { NextPage, GetServerSideProps } from 'next';
import NextLink from 'next/link';
import { useRouter } from 'next/router';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import ErrorOutline from '@mui/icons-material/ErrorOutline';

import { signIn, getSession } from 'next-auth/react';
import { useForm } from 'react-hook-form';
import { AuthLayout } from '@layouts';
import { AuthContext } from '@context';
import { destinationWithParams, validations } from '@utils';

interface FormData {
  name: string;
  email: string;
  password: string;
}

const RegisterPage: NextPage = () => {
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const router = useRouter();
  const { registerUser } = useContext(AuthContext);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();
  const onRegisterForm = async ({ name, email, password }: FormData) => {
    setShowError(false);
    const { hasError, message } = await registerUser(name, email, password);
    if (hasError) {
      setShowError(true);
      setErrorMessage(message!);
      setTimeout(() => setShowError(false), 3000);
      return;
    }

    // router.replace(destinationWithParams(router));
    await signIn('credentials', {email, password})
  };
  return (
    <AuthLayout title='Registrar'>
      <form onSubmit={handleSubmit(onRegisterForm)}>
        <Box sx={{ width: 350, padding: '10px 20px' }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant='h1' component='h1'>
                Crear cuenta
              </Typography>
              <Chip
                label={errorMessage}	
                color='error'
                icon={<ErrorOutline />}
                className='fadeIn'
                sx={{ display: showError ? 'flex' : 'none' }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label='Nombre'
                variant='filled'
                fullWidth
                {...register('name', {
                  required: 'Este campo es requerido',
                  minLength: { value: 3, message: 'Tu nombre debe tener al menos 3 caracteres' },
                })}
                error={!!errors.name}
                helperText={errors.name?.message}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label='Correo'
                variant='filled'
                fullWidth
                {...register('email', {
                  required: 'El correo es requerido',
                  validate: validations.isEmail,
                })}
                error={!!errors.email}
                helperText={errors.email?.message}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label='Contraseña'
                variant='filled'
                fullWidth
                type='password'
                {...register('password', {
                  required: 'La contraseña es requerida',
                  minLength: { value: 6, message: 'La contraseña debe tener al menos 6 caracteres' },
                })}
                error={!!errors.password}
                helperText={errors.password?.message}
              />
            </Grid>
            <Grid item xs={12}>
              <Button color='secondary' className='circular-btn' size='large' fullWidth type='submit'>
                Registrar
              </Button>
            </Grid>
            <Grid item xs={12} display='flex' justifyContent='end'>
              <NextLink href={destinationWithParams(router, '/auth/login')} passHref>
                <Link underline='always'> ¿Ya tienes cuenta? </Link>
              </NextLink>
            </Grid>
          </Grid>
        </Box>
      </form>
    </AuthLayout>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ req, query }) => {
  
  const session = await getSession({ req });

  if (session) {
    return {
      redirect: {
        destination: query.page?.toString() || '/',
        permanent: false,
      }
    }
  }

  return {
    props: {
      
    }
  }
}

export default RegisterPage;
