import { useState, useEffect } from 'react';
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
import Divider from '@mui/material/Divider';
import ErrorOutline from '@mui/icons-material/ErrorOutline';

import { signIn, getSession, getProviders } from 'next-auth/react';
import { useForm } from 'react-hook-form';
import { AuthLayout } from '@layouts';
// import { AuthContext } from '@context';
import { destinationWithParams, validations } from '@utils';

interface FormData {
  email: string;
  password: string;
}

const LoginPage: NextPage = () => {
  const [showError, setShowError] = useState(false);
  const [providers, setProviders] = useState<any>({});

  const router = useRouter();
  // const { loginUser } = useContext(AuthContext);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  useEffect(() => {
    getProviders().then((data) => {
      setProviders(data);
    });
  }, []);

  const onLoginForm = async ({ email, password }: FormData) => {
    setShowError(false);

    await signIn('credentials', { email, password });

    // const isValidLogin = await loginUser(email, password);
    // if (!isValidLogin) {
    //   setShowError(true);
    //   setTimeout(() => setShowError(false), 3000);
    //   return;
    // }
    // router.replace(destinationWithParams(router));
  };

  const Providers = () => {
    return (
      <Grid item xs={12} display='flex' flexDirection='column' justifyContent='end'>
        <Divider sx={{ mb: 3 }} />
        {Object.values(providers).map((provider: any) => {
          if (provider.id === 'credentials') return <div key='credentials'></div>;
          return (
            <Button
              onClick={() => signIn(provider.id)}
              key={provider.id}
              variant='outlined'
              fullWidth
              color='primary'
              sx={{ mb: 1 }}
            >
              {provider.name}
            </Button>
          );
        })}
      </Grid>
    );
  };
  return (
    <AuthLayout title='Ingresar'>
      <form onSubmit={handleSubmit(onLoginForm)} noValidate>
        <Box sx={{ width: 350, padding: '10px 20px' }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant='h1' component='h1'>
                Iniciar Sesión
              </Typography>
              <Chip
                label='No reconocemos ese usuario / contraseña'
                color='error'
                icon={<ErrorOutline />}
                className='fadeIn'
                sx={{ display: showError ? 'flex' : 'none' }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label='Correo'
                variant='filled'
                fullWidth
                type='email'
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
                })}
                error={!!errors.password}
                helperText={errors.password?.message}
              />
            </Grid>
            <Grid item xs={12}>
              <Button color='secondary' className='circular-btn' size='large' fullWidth type='submit'>
                Ingresar
              </Button>
            </Grid>
            <Grid item xs={12} display='flex' justifyContent='end'>
              <NextLink href={destinationWithParams(router, '/auth/register')} passHref>
                <Link underline='always'> ¿No tienes cuenta? </Link>
              </NextLink>
            </Grid>
            <Providers />
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
      },
    };
  }

  return {
    props: {},
  };
};

export default LoginPage;
