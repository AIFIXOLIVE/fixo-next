// src/app/layout.js
import './globals.css';
import Script from 'next/script';

export const metadata = {
  title: "AI Tools & Automation Services – Fixo.live",
  description: "Discover top AI tools, automation services, and chatbots to boost your productivity. Fixo.live helps you stay ahead with the latest innovations.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* Google Analytics */}
        <Script async src="https://www.googletagmanager.com/gtag/js?id=G-X36530TH1D" strategy="afterInteractive" />
        <Script id="ga-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-X36530TH1D');
          `}
        </Script>

      </head>

      <body>
        {children}
      </body>
    </html>
  );
}
