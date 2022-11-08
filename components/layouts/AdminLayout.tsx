import type { FC, ReactNode } from 'react';
import Head from 'next/head';
import { AdminNavbar, SideMenu } from '@components';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

interface Props {
  title: string;
  subtitle: string;
  icon: JSX.Element;
  children: ReactNode;
}
export const AdminLayout: FC<Props> = ({ children, title, subtitle, icon }) => {
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta property='og:title' content={title} />
        <meta property='og:description' content={'Admin Panel'} />
        <meta property='og:type' content='website' />
        <meta property='og:url' content='https://g0car-tesloshop.vercel.app/' />
      </Head>
      <nav>
        <AdminNavbar />
      </nav>
      <SideMenu />
      <main
        style={{
          margin: '80px auto',
          maxWidth: '14440px',
          padding: '0px 30px',
        }}
      >
        <Box display='flex' flexDirection='column'>
          <Typography variant='h1' component='h1'>
            {icon}
            {' '}
            {title}
          </Typography>
          <Typography variant='h2' sx={{ mb: 1 }}>
            {subtitle}
          </Typography>
        </Box>
        <Box className='fadeIn'>{children}</Box>
      </main>

      <footer>{/**TODO" custom footer */}</footer>
    </>
  );
};
