import { type ReactNode } from 'react';
import { manrope } from '@/themes/font';
import './globals.css';

//* Root Layout -----------------------
export default function RootLayout({
    children
}: Readonly<{
    children: ReactNode;
}>) {
    return (
        <html dir='ltr' lang='en-US'>
            <body className={`antialiased ${manrope.className} ${manrope.variable}`}>
                <div id='app'>{children}</div>
                <div id='portals' />
            </body>
        </html>
    );
}
