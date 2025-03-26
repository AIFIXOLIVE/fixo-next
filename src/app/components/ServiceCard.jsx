'use client';

import { useRouter } from 'next/navigation';
import LikeButton from './LikeButton';

export default function ServiceCard({ service }) {
  const router = useRouter();
  const categories = Array.isArray(service.categories)
    ? service.categories
    : JSON.parse(service.categories || '[]');

  const handleClick = (e) => {
    if (
      e.target.closest('.likes') ||
      e.target.closest('.external-link')
    ) return;

    router.push(`/tools/${service.slug}`);
  };

  return (
    <div className="card" onClick={handleClick}>
      <div className="image-wrapper">
        <img src={service.background_url} alt={service.name} />
        <div className="cat top-left">
          {categories.map(cat => (
            <span key={cat} className="category-tag">{cat}</span>
          ))}
        </div>
        <a
          className="corner top-right external-link"
          href={service.url}
          target="_blank"
          onClick={e => e.stopPropagation()}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="black" viewBox="0 0 24 24">
            <path d="M14 3h7v7h-2V6.41L10.41 15 9 13.59 17.59 5H14V3z" />
          </svg>
        </a>
        <div className="corner bottom-left">{service.pricing || 'N/A'}</div>
        <LikeButton serviceId={service.id} />
      </div>
      <h2>{service.name}</h2>
      <p>{service.description}</p>
    </div>
  );
}
