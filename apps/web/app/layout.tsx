import localFont from 'next/font/local';

import type { Metadata, Viewport } from 'next';

import Toast from '@/components/common/toast';

import LocationModalProvider from '@/providers/location-modal-provider';
import QueryProvider from '@/providers/query-provider';
import UserProvider from '@/providers/user-provider';

import './globals.css';

const pretendard = localFont({
  src: '../public/fonts/PretendardVariable.woff2',
  display: 'swap',
  weight: '400 700',
  style: 'normal',
  variable: '--font-pretendard',
  fallback: ['system-ui', 'Apple SD Gothic Neo', 'Malgun Gothic', 'sans-serif'],
  preload: true,
});

const APP_NAME = 'Living Auction';
const APP_DEFAULT_TITLE = '리빙 옥션: 지역 기반 실시간 경매 플랫폼';
const APP_TITLE_TEMPLATE = '%s - 경매앱';
const APP_DESCRIPTION = '지역 기반 실시간 경매 플랫폼';

export const metadata: Metadata = {
  applicationName: APP_NAME,
  title: {
    default: APP_DEFAULT_TITLE,
    template: APP_TITLE_TEMPLATE,
  },
  description: APP_DESCRIPTION,
  manifest: '/manifest.webmanifest',
  icons: {
    icon: { url: '/logo.svg', type: 'image/svg+xml' },
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: APP_DEFAULT_TITLE,
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: 'website',
    siteName: APP_NAME,
    title: {
      default: APP_DEFAULT_TITLE,
      template: APP_TITLE_TEMPLATE,
    },
    description: APP_DESCRIPTION,
  },
  twitter: {
    card: 'summary',
    title: {
      default: APP_DEFAULT_TITLE,
      template: APP_TITLE_TEMPLATE,
    },
    description: APP_DESCRIPTION,
  },
};

export const viewport: Viewport = {
  themeColor: '#fff',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
};

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="ko" className={pretendard.variable}>
      <body className={pretendard.className}>
        <QueryProvider>
          <UserProvider>
            <div className="relative mx-auto h-dvh min-w-[320px] max-w-[480px] overflow-hidden bg-white">
              {children}
              <Toast />
              <LocationModalProvider />
            </div>
          </UserProvider>
        </QueryProvider>
      </body>
    </html>
  );
};

export default RootLayout;
