'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ServicesList() {
  const [services, setServices] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [offset, setOffset] = useState(0);
  const [loading, setLoading] = useState(false);
  const [endReached, setEndReached] = useState(false);

  const chunkSize = 10;

  useEffect(() => {
    fetch('https://api.dev-fixo-live.workers.dev/api/categories')
      .then(res => res.json())
      .then(setCategories);
  }, []);

  useEffect(() => {
    loadServices(true);
  }, [selectedCategories]);

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + window.scrollY >= document.body.offsetHeight - 100 &&
        !loading &&
        !endReached
      ) {
        loadServices();
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loading, endReached]);

  const loadServices = (reset = false) => {
    setLoading(true);
    const url = new URL('https://api.dev-fixo-live.workers.dev/api/services');
    url.searchParams.set('offset', reset ? 0 : offset);
    url.searchParams.set('limit', chunkSize);
    if (selectedCategories.length) {
      url.searchParams.set('categories', selectedCategories.join(','));
    }

    fetch(url)
      .then(res => res.json())
      .then(async data => {
        if (data.length === 0) {
          setEndReached(true);
          return;
        }

        const withLikes = await Promise.all(
          data.map(async (service) => {
            try {
              const res = await fetch(`https://api.dev-fixo-live.workers.dev/api/likes?service_id=${service.id}`);
              const likeData = await res.json();
              return { ...service, likes: likeData.likes || 0 };
            } catch {
              return { ...service, likes: 0 };
            }
          })
        );

        setServices(prev => reset ? withLikes : [...prev, ...withLikes]);
        setOffset(prev => reset ? chunkSize : prev + chunkSize);
      })
      .finally(() => setLoading(false));
  };

  const toggleCategory = (category) => {
    setSelectedCategories(prev =>
      prev.includes(category) ? prev.filter(c => c !== category) : [...prev, category]
    );
    setOffset(0);
    setEndReached(false);
  };

  const router = useRouter();

  const handleLike = async (e, serviceId) => {
    e.stopPropagation();
    await fetch("https://api.dev-fixo-live.workers.dev/api/likes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ service_id: serviceId }),
    });
    const res = await fetch(`https://api.dev-fixo-live.workers.dev/api/likes?service_id=${serviceId}`);
    const updated = await res.json();
    setServices(prev =>
      prev.map(s =>
        s.id === serviceId ? { ...s, likes: updated.likes || 0 } : s
      )
    );
  };

  return (
    <>
      <div className="category-scroll-wrapper" style={{ overflowX: 'auto', whiteSpace: 'nowrap' }}>
        <div id="filtersContainer">
          {categories.map(cat => (
            <label key={cat} className="category-label">
              <input
                type="checkbox"
                checked={selectedCategories.includes(cat)}
                onChange={() => toggleCategory(cat)}
              />
              {cat}
            </label>
          ))}
        </div>
      </div>

      <main id="services" className="grid">
        {services.map(service => (
          <div key={service.id} className="card" onClick={() => router.push(`/tools/${service.slug}`)}>
            <div className="image-wrapper">
              <img src={service.background_url} alt={service.name} />
              <div className="cat top-left">
                {(Array.isArray(service.categories) ? service.categories : JSON.parse(service.categories || '[]'))
                  .map(cat => <span key={cat} className="category-tag">{cat}</span>) || 'Uncategorized'}
              </div>
              <a className="corner top-right external-link" href={service.url} target="_blank" onClick={e => e.stopPropagation()}>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="black" viewBox="0 0 24 24">
                  <path d="M14 3h7v7h-2V6.41L10.41 15 9 13.59 17.59 5H14V3z" />
                </svg>
              </a>
              <div className="corner bottom-left">{service.pricing || 'N/A'}</div>
              <div
                className="corner bottom-right likes"
                onClick={(e) => handleLike(e, service.id)}
              >
                ❤️ {service.likes || 0}
              </div>
            </div>
            <h2>{service.name}</h2>
            <p>{service.description}</p>
          </div>
        ))}
        {loading && <p>Loading...</p>}
      </main>
    </>
  );
}
