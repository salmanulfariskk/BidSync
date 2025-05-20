'use client';

import { ConfigProvider, App as AntdApp } from 'antd';
import { Provider } from 'react-redux';
import { SessionProvider } from 'next-auth/react';
import dayjs from 'dayjs';
import 'dayjs/locale/en';
import { store, persistor } from '../lib/redux/store';
import { theme } from '../lib/theme';
import { PersistGate } from 'redux-persist/integration/react';

// Set dayjs locale
dayjs.locale('en');

export function Providers({ children }: { children: React.ReactNode }) {

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <SessionProvider>
          <ConfigProvider theme={theme}>
            <AntdApp>{children}</AntdApp>
          </ConfigProvider>
        </SessionProvider>
      </PersistGate>
    </Provider>
  );
}