import type { Metadata, Viewport } from 'next';
import { ReactNode, Suspense } from 'react';
import '@/styles/global.scss';
import 'normalize.css';
import { MobileDetector } from '@/components';
import { staticMetadata } from '@/utils';

export const metadata: Metadata = staticMetadata({
  title: 'Create Next App',
  description: 'Generated by create next app',
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  userScalable: false,
  viewportFit: 'cover',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ko">
      <body>
        <Suspense>
          <MobileDetector>{children}</MobileDetector>
        </Suspense>

        {/* For Portal Component */}
        <div id="next-app-portal" />
      </body>
    </html>
  );
}
