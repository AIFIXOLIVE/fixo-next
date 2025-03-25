'use client';

import Head from 'next/head';
import Script from 'next/script';
import ServicesList from './components/ServicesList';


export default function Home() {
  return (
    <>
      <Head>
        <title>AI Tools & Automation Services – Fixo.live</title>
        <meta name="description" content="Discover top AI tools, automation services, and chatbots to boost your productivity." />
        <meta name="keywords" content="AI tools, automation, SaaS, eCommerce, chatbot, CRM, Fixo.live" />
        <meta name="author" content="Fixo.live" />
        <link rel="canonical" href="https://ai.fixo.live/" />
        <meta property="og:title" content="AI Tools & Automation Services – Fixo.live" />
        <meta property="og:description" content="Top AI services, automation tools, and productivity boosters – all in one place." />
        <meta property="og:image" content="https://ai.fixo.live/img/og-image.jpg" />
        <meta property="og:url" content="https://ai.fixo.live/" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Fixo.live – AI Tools & Automation Services" />
        <meta name="twitter:description" content="Explore top-rated AI solutions to supercharge your business and workflows." />
        <meta name="twitter:image" content="https://ai.fixo.live/img/og-image.jpg" />
      </Head>

      <header>
        <nav className="nav">
          <h1 className="logo-text">AI.FIXØ.LIVE</h1>
          <button className="menu-toggle" aria-label="Open menu">
            <span className="bar"></span>
            <span className="bar"></span>
            <span className="bar"></span>
          </button>
          <ul className="nav-links">
            <li><a href="#tools">⚙️ AI TOOLS</a></li>
            <li><a href="#hot">📊 HOT AI</a></li>
            <li><a href="#e-commerce">📢 AI NEWS</a></li>
            <li><a href="#ai-chatbot">🤖 AI CHATBOT</a></li>
          </ul>
        </nav>
      </header>

      <div className="category-scroll-wrapper">
        <div id="filtersContainer"></div>
      </div>

      <main id="services" className="grid"></main>

      {/* Подключаем компонент */}
      <ServicesList />

      {/* Google Analytics */}
      <Script async src="https://www.googletagmanager.com/gtag/js?id=G-X36530TH1D" />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag() { dataLayer.push(arguments); }
          gtag('js', new Date());
          gtag('config', 'G-X36530TH1D');
        `}
      </Script>
    </>
  );
}
