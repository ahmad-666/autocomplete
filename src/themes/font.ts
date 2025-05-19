import { Manrope } from 'next/font/google';
// import localFont from 'next/font/local';

export const manrope = Manrope({
    subsets: ['latin'],
    weight: ['400', '500', '600', '700', '800'],
    variable: '--font-manrope', //set css var(--font-manrope) or manrope.variable when we import this font
    display: 'swap'
});
// export const roboto = localFont({
//     src: '../../public/fonts/roboto.ttf',
//     variable: '--font-roboto',
//     display: 'swap'
// });

//layout.tsx: <body className={`${manrope.className} ${manrope.variable}`} /> --> default font-family
//other fonts: font-family:var(--font-other) or className="font-(family-name:--font-other)"
