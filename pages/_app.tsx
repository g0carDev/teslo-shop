import type { AppProps } from 'next/app';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { CacheProvider, EmotionCache } from '@emotion/react';
import { PayPalScriptProvider } from '@paypal/react-paypal-js';
import { SessionProvider } from 'next-auth/react';
import { SWRConfig } from 'swr';
import { lightTheme } from '@themes';
import { CartProvider, UIProvider, AuthProvider } from '@context';
import { createEmotionCache } from '@utils';
import 'react-slideshow-image/dist/styles.css';
import '../styles/globals.css';

interface MyAppProps extends AppProps {
  emotionCache?: EmotionCache;
}

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache();
function MyApp(props: MyAppProps) {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;

  return (
    <SessionProvider>
      <PayPalScriptProvider options={{ 'client-id': process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || '' }}>
        <CacheProvider value={emotionCache}>
          <SWRConfig
            value={{
              fetcher: (resource, init) => fetch(resource, init).then((res) => res.json()),
            }}
          >
            <AuthProvider>
              <CartProvider>
                <UIProvider>
                  <ThemeProvider theme={lightTheme}>
                    <CssBaseline />
                    <Component {...pageProps} />
                  </ThemeProvider>
                </UIProvider>
              </CartProvider>
            </AuthProvider>
          </SWRConfig>
        </CacheProvider>
      </PayPalScriptProvider>
    </SessionProvider>
  );
}

export default MyApp;
