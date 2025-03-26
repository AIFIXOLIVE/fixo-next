export async function generateMetadata({ params }) {
    const res = await fetch(`https://api.dev-fixo-live.workers.dev/api/service/${params.slug}`);
    const service = await res.json();
  
    return {
      title: `${service.name} – Fixo.live`,
      description: service.full_description,
      openGraph: {
        title: service.name,
        description: service.full_description,
        images: [
          {
            url: service.background_url,
            width: 1200,
            height: 630,
          },
        ],
        url: `https://ai.fixo.live/tools/${params.slug}`,
        siteName: 'Fixo.live',
      },
      twitter: {
        card: 'summary_large_image',
        title: service.name,
        description: service.full_description,
        images: [service.background_url],
      },
    };
  }
  
  export default async function ToolPage({ params }) {
    const res = await fetch(`https://api.dev-fixo-live.workers.dev/api/service/${params.slug}`);
    const service = await res.json();
  
    if (!service || service.error) {
      return <p style={{ padding: '2rem' }}>⚠️ Service not found.</p>;
    }
  
    const categories = Array.isArray(service.categories)
      ? service.categories
      : JSON.parse(service.categories || '[]');
  
    return (
      <div className="card detailed-card">
        <div className="image-wrapper">
          <img src={service.background_url} alt={service.name} />
          <div className="cat top-left">
            {categories.map(cat => <span key={cat} className="category-tag">{cat}</span>)}
          </div>
          <div className="corner top-right" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <h1 className="card-title">{service.name}</h1>
          </div>
          <div className="corner bottom-left">{service.pricing || 'N/A'}</div>
        </div>
        <p>{service.full_description}</p>
        <div style={{ marginTop: '20px' }}>
          <a href={service.url} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', textDecoration: 'none' }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="black" viewBox="0 0 24 24">
              <path d="M14 3h7v7h-2V6.41L10.41 15 9 13.59 17.59 5H14V3z"/>
            </svg>
            Visit original
          </a>
        </div>
        <br /><a href="/">← Back to list</a>
      </div>
    );
  }
