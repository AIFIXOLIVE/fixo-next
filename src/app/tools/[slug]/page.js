export const dynamic = 'force-dynamic';
'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

export default function ToolPage() {
  const { slug } = useParams();
  const [service, setService] = useState(null);
  const [likes, setLikes] = useState(0);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!slug) return;

    const app = document.getElementById('services');
    const filtersContainer = document.getElementById('filtersContainer');
    if (filtersContainer) filtersContainer.remove();

    fetch(`https://api.dev-fixo-live.workers.dev/api/service/${slug}`)
      .then(res => res.json())
      .then(data => {
        if (!data || data.error) {
          setError('⚠️ Service not found.');
          return;
        }

        setService(data);

        fetch(`https://api.dev-fixo-live.workers.dev/api/likes?service_id=${data.id}`)
          .then(res => res.json())
          .then(likeData => setLikes(likeData.likes || 0))
          .catch(() => setLikes(0));

        // SEO: Schema.org
        const ldJson = {
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          "name": data.name,
          "operatingSystem": "All",
          "applicationCategory": "WebApplication",
          "description": data.full_description,
          "url": `https://ai.fixo.live/tools/${slug}`,
          "image": data.background_url,
          "offers": {
            "@type": "Offer",
            "price": 0,
            "priceCurrency": "USD"
          },
          "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": Math.min((2 + (likes / 100) * 3).toFixed(2), 5),
            "reviewCount": likes
          }
        };

        const ldScript = document.createElement('script');
        ldScript.type = 'application/ld+json';
        ldScript.textContent = JSON.stringify(ldJson);
        document.head.appendChild(ldScript);
      })
      .catch(() => setError('❌ Failed to load service.'));
  }, [slug]);

  const handleLike = () => {
    if (!service) return;
    fetch("https://api.dev-fixo-live.workers.dev/api/likes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ service_id: service.id })
    })
      .then(() => fetch(`https://api.dev-fixo-live.workers.dev/api/likes?service_id=${service.id}`))
      .then(res => res.json())
      .then(updated => setLikes(updated.likes || 0))
      .catch(() => {});
  };

  if (error) return <p>{error}</p>;
  if (!service) return <p>Loading...</p>;

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
        <div className="corner bottom-right likes" id="like-btn" onClick={handleLike} style={{ cursor: 'pointer' }}>
          ❤️ {likes}
        </div>
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
      <br /><a href="#" onClick={(e) => { e.preventDefault(); history.back(); }}>← Back to list</a>
    </div>
  );
}
