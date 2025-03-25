'use client';

import { useEffect } from 'react';

export default function ServicesList() {
  useEffect(() => {
    // Весь твой fetch + отрисовка карточек здесь
    // Мы адаптируем старую логику — часть ниже 👇

    const servicesContainer = document.getElementById('services');
    const filtersContainer = document.getElementById('filtersContainer');
    let currentOffset = 0;
    const chunkSize = 10;
    let isLoading = false;
    let endReached = false;
    let selectedCategories = [];

    function createSkeletonCard() {
      const skeleton = document.createElement('div');
      skeleton.className = 'card skeleton-card';
      skeleton.innerHTML = `
        <div class="skeleton-img"></div>
        <div class="skeleton-title"></div>
        <div class="skeleton-text"></div>
        <div class="skeleton-text short"></div>`;
      return skeleton;
    }

    function showSkeletons(count) {
      for (let i = 0; i < count; i++) {
        servicesContainer.appendChild(createSkeletonCard());
      }
    }

    function replaceSkeletonsWithData(chunk) {
      const skeletons = Array.from(document.querySelectorAll('.skeleton-card')).slice(0, chunk.length);
      chunk.forEach((service, index) => {
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
          <div class="image-wrapper">
            <img src="${service.background_url}" alt="${service.name}" />
            <div class="cat top-left">
              ${(Array.isArray(service.categories) ? service.categories : JSON.parse(service.categories || "[]"))
                .map(cat => `<span class="category-tag">${cat}</span>`).join("") || "Uncategorized"}
            </div>
            <a class="corner top-right external-link" href="${service.url}" target="_blank">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="black" viewBox="0 0 24 24">
                <path d="M14 3h7v7h-2V6.41L10.41 15 9 13.59 17.59 5H14V3z"/>
              </svg>
            </a>
            <div class="corner bottom-left">${service.pricing || "N/A"}</div>
            <div class="corner bottom-right likes" id="likes-${service.id}">❤️</div>
          </div>
          <h2>${service.name}</h2>
          <p>${service.description}</p>`;

        servicesContainer.replaceChild(card, skeletons[index]);
      });
    }

    function loadNextChunk() {
      if (isLoading || endReached) return;
      isLoading = true;

      const url = new URL('https://api.dev-fixo-live.workers.dev/api/services');
      url.searchParams.set('offset', currentOffset);
      url.searchParams.set('limit', chunkSize);
      if (selectedCategories.length) {
        url.searchParams.set('categories', selectedCategories.join(','));
      }

      fetch(url)
        .then(res => res.json())
        .then(data => {
          if (!data || data.length === 0) {
            endReached = true;
            return;
          }
          showSkeletons(data.length);
          setTimeout(() => {
            replaceSkeletonsWithData(data);
            currentOffset += chunkSize;
          }, 300);
        })
        .catch(() => {
          servicesContainer.innerText = 'Failed to load services.';
        })
        .finally(() => {
          isLoading = false;
        });
    }

    fetch('https://api.dev-fixo-live.workers.dev/api/categories')
      .then(res => res.json())
      .then(categories => {
        filtersContainer.innerHTML = categories.map(c => `
          <label class="category-label">
            <input type="checkbox" value="${c}" /> ${c}
          </label>
        `).join('');

        document.querySelectorAll('#filtersContainer input[type="checkbox"]').forEach(cb => {
          cb.addEventListener('change', () => {
            selectedCategories = Array.from(document.querySelectorAll('#filtersContainer input[type="checkbox"]:checked'))
              .map(cb => cb.value);
            currentOffset = 0;
            endReached = false;
            servicesContainer.innerHTML = '';
            loadNextChunk();
          });
        });
      });

    loadNextChunk();

    window.addEventListener('scroll', () => {
      if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 100) {
        loadNextChunk();
      }
    });

  }, []);

  return null;
}
