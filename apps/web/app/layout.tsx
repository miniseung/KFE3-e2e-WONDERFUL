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
      <head>
        {/* 폰트 Preload - 최우선 로딩 */}
        <link
          rel="preload"
          href="/fonts/PretendardVariable.woff2"
          as="font"
          type="font/woff2"
          crossOrigin=""
        />

        {/* Critical CSS - Render Delay 94% 해결 */}
        <style
          dangerouslySetInnerHTML={{
            __html: `
              /* 폰트 즉시 적용 */
              @font-face {
                font-family: 'PretendardVariable';
                src: url('/fonts/PretendardVariable.woff2') format('woff2');
                font-weight: 400 700;
                font-style: normal;
                font-display: swap;
              }
              
              /* CSS Reset */
              *, ::before, ::after {
                box-sizing: border-box;
                border-width: 0;
                border-style: solid;
                border-color: #e5e7eb;
              }
              
              /* Body 기본 스타일 */
              body {
                font-family: 'PretendardVariable', var(--font-pretendard), system-ui, sans-serif;
                background-color: #ffffff;
                margin: 0;
                padding: 0;
                line-height: 1.5;
                -webkit-font-smoothing: antialiased;
                -moz-osx-font-smoothing: grayscale;
                color: #171717;
              }
              
              /* 앱 컨테이너 Critical */
              .min-h-fill { min-height: 100vh; }
              .grid-header-main-nav { 
                display: grid;
                grid-template-rows: auto 1fr auto;
              }
              .mx-auto { margin-left: auto; margin-right: auto; }
              .grid { display: grid; }
              .h-dvh { height: 100dvh; }
              .max-h-dvh { max-height: 100dvh; }
              .min-w-\\[320px\\] { min-width: 320px; }
              .max-w-\\[480px\\] { max-width: 480px; }
              .overflow-hidden { overflow: hidden; }
              .bg-white { background-color: #ffffff; }
              
              /* Critical Tailwind Classes - LCP 요소용 */
              .flex { display: flex; }
              .justify-center { justify-content: center; }
              .items-center { align-items: center; }
              .w-full { width: 100%; }
              .h-full { height: 100%; }
              .py-8 { padding-top: 2rem; padding-bottom: 2rem; }
              .py-4 { padding-top: 1rem; padding-bottom: 1rem; }
              .px-4 { padding-left: 1rem; padding-right: 1rem; }
              .px-2 { padding-left: 0.5rem; padding-right: 0.5rem; }
              .text-center { text-align: center; }
              .gap-4 { gap: 1rem; }
              .gap-3 { gap: 0.75rem; }
              .gap-2\\.5 { gap: 0.625rem; }
              
              /* 폰트 관련 */
              .font-regular { font-weight: 400; }
              .font-medium { font-weight: 500; }
              .font-bold { font-weight: 700; }
              .text-sm { font-size: 0.875rem; line-height: 1.25rem; }
              .text-base { font-size: 1rem; line-height: 1.5rem; }
              .text-lg { font-size: 1.125rem; line-height: 1.75rem; }
              .text-h4 { font-size: 1.25rem; line-height: 1.75rem; }
              
              /* 색상 */
              .text-neutral-600 { color: #525252; }
              .text-neutral-900 { color: #171717; }
              .text-neutral-500 { color: #737373; }
              .text-primary-600 { color: #5758fe; }
              .bg-neutral-50 { background-color: #fafafa; }
              .bg-neutral-200 { background-color: #e5e5e5; }
              
              /* 검색 페이지 LCP 요소 - 직접 타겟팅 */
              p.font-regular.flex.justify-center.py-8.text-neutral-600 {
                font-family: 'PretendardVariable', var(--font-pretendard), system-ui, sans-serif !important;
                font-weight: 400 !important;
                display: flex !important;
                justify-content: center !important;
                padding: 2rem 0 !important;
                color: #525252 !important;
                font-size: 1rem !important;
                line-height: 1.5rem !important;
                text-align: center !important;
              }
              
              /* 경매 카드 Critical */
              .size-26\\.5 { width: 106px; height: 106px; }
              .leading-5\\.5 { line-height: 1.375rem; }
              .line-clamp-2 {
                display: -webkit-box;
                -webkit-line-clamp: 2;
                -webkit-box-orient: vertical;
                overflow: hidden;
              }
              
              /* 스켈레톤 애니메이션 */
              .animate-pulse {
                animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
              }
              
              @keyframes pulse {
                0%, 100% { opacity: 1; }
                50% { opacity: 0.5; }
              }
              
              /* 반응형 */
              @media (max-width: 768px) {
                .max-w-\\[480px\\] { max-width: 100%; }
                .min-w-\\[320px\\] { min-width: 100%; }
              }
            `,
          }}
        />
      </head>
      <body className={pretendard.className}>
        <QueryProvider>
          <UserProvider>
            <div className="min-h-fill grid-header-main-nav mx-auto grid h-dvh max-h-dvh min-w-[320px] max-w-[480px] overflow-hidden bg-white">
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
