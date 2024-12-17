"use client"; // Importa solo en el lado del cliente

import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';
import localFont from 'next/font/local';
import Script from 'next/script';
import "../styles/globals.css"; // Asegúrate de que este archivo exista y contenga las configuraciones de tu aplicación.
import { Metadata } from 'next';

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

const client = new ApolloClient({
  uri: '/api/graphql', // URL de tu servidor GraphQL
  cache: new InMemoryCache(),
});

export const metadata: Metadata = {
  // Si estás trabajando en el modo de aplicaciones (app/), los metadatos se inyectan automáticamente en el <head>.
  title: "Home | Project Management",
  description: "Página principal para la gestión de proyectos.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode; }>) {
  return (
    <html lang="en">
      <head>
        {/* El <head> en Next.js se utiliza principalmente para metadatos y enlaces estáticos como <link>
        o <meta>. Para scripts externos dinámicos o de carga optimizada, utiliza el componente Script. */}
        {/* <link rel="next-icon" href="/next.svg" /> */}
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-red-300`}>
        {/* Next.js automáticamente inyectará el script en el <head> del HTML generado.
        lazyOnload: Carga el script solo cuando la página haya terminado de cargar completamente.
        crossOrigin: Indica que el recurso externo permite solicitudes cruzadas. */}
        <Script
          src="https://kit.fontawesome.com/cb32582639.js"
          crossOrigin="anonymous"
          strategy="lazyOnload"
        />
        <ApolloProvider client={client}>
          {children}
        </ApolloProvider>
      </body>
    </html>
  );
}
