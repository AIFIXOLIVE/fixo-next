'use client';

import { useEffect, useState } from 'react';
import ServiceCard from './ServiceCard';
import CategoryFilter from './CategoryFilter';
import LoaderSkeleton from './LoaderSkeleton';


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
      .then(data => {
        if (!data || data.length === 0) {
          setEndReached(true);
          return;
        }
        setServices(prev => reset ? data : [...prev, ...data]);
        setOffset(prev => reset ? chunkSize : prev + chunkSize);
      })
      .finally(() => setLoading(false));
  };

  return (
    <>
<div className="category-scroll-wrapper">
  <CategoryFilter
    categories={categories}
    selectedCategories={selectedCategories}
    onToggle={cat =>
      setSelectedCategories(prev =>
        prev.includes(cat)
          ? prev.filter(c => c !== cat)
          : [...prev, cat]
      )
    }
  />
</div>

      <main id="services" className="grid">
        {services.map(service => (
          <ServiceCard key={service.id} service={service} />
        ))}
        {loading && <LoaderSkeleton count={chunkSize} />}
      </main>
    </>
  );
}
