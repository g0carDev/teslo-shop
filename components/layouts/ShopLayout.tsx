import type { FC, ReactNode } from 'react';
import Head from 'next/head';
import { Navbar, SideMenu } from '@components';

interface Props {
  title: string;
  pageDescription: string;
  imageFullUrl?: string;
  children: ReactNode;
}
export const ShopLayout: FC<Props> = ({
  children,
  title,
  pageDescription,
  imageFullUrl,
}) => {
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name='description' content={pageDescription} />
        <meta property='og:title' content={title} />
        <meta property='og:description' content={pageDescription} />
        <meta property='og:type' content='website' />
        <meta property='og:url' content='https://g0car-tesloshop.vercel.app/' />
        {imageFullUrl && <meta property='og:image' content={imageFullUrl} />}
      </Head>
      <nav>
        <Navbar />
      </nav>
      <SideMenu />
      <main
        style={{
          margin: '80px auto',
          maxWidth: '14440px',
          padding: '0px 30px',
        }}
      >
        {children}
      </main>

      <footer>{/**TODO" custom footer */}</footer>
    </>
  );
};
