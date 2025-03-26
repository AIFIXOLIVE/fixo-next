import ServicesList from './components/ServicesList';



export const metadata = {
  title: 'AI Tools & Automation Services – Fixo.live',
  description: 'Discover top AI tools, automation services, and chatbots to boost your productivity. Fixo.live helps you stay ahead with the latest innovations.',
  keywords: 'AI tools, automation, SaaS, eCommerce, chatbot, CRM, Fixo.live',
  authors: [{ name: 'Fixo.live', url: 'https://ai.fixo.live' }],
  openGraph: {
    title: 'AI Tools & Automation Services – Fixo.live',
    description: 'Top AI services, automation tools, and productivity boosters – all in one place.',
    url: 'https://ai.fixo.live',
    siteName: 'Fixo.live',
    images: [
      {
        url: 'https://ai.fixo.live/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Fixo.live – AI Tools',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Fixo.live – AI Tools & Automation Services',
    description: 'Explore top-rated AI solutions to supercharge your business and workflows.',
    images: ['https://ai.fixo.live/og-image.jpg'],
  },
};

export default function Home() {
  return (
    <main style={{ padding: '3rem', textAlign: 'center' }}>
      <ServicesList /> 
    </main>
  );
}
