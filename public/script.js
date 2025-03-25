document.addEventListener("DOMContentLoaded", () => {
  const pathname = window.location.pathname;
  const isToolPage = pathname.startsWith("/tools/");
  const slug = pathname.split("/").pop();
  const filtersContainer = document.getElementById("filtersContainer");


  


// ======== SINGLE TOOL PAGE ==========
if (isToolPage && slug) {
  const app = document.getElementById("services");
  if (filtersContainer) filtersContainer.remove();
  if (!app) return;

  fetch(`https://api.dev-fixo-live.workers.dev/api/service/${slug}`)
    .then(res => res.json())
    .then(service => {
      if (!service || service.error) {
        app.innerHTML = `<p>⚠️ Service not found.</p>`;
        return;
      }

      document.title = `${service.name} – Fixo.live`;

      const metaDescription = document.createElement("meta");
      metaDescription.name = "description";
      metaDescription.content = service.description || "";
      document.head.appendChild(metaDescription);

      fetch(`https://api.dev-fixo-live.workers.dev/api/likes?service_id=${service.id}`)
        .then(res => res.json())
        .then(likeData => {
          const likes = likeData.likes || 0;
          const ratingValue = Math.min((2 + (likes / 100) * 3).toFixed(2), 5);
          const reviewCount = likes;

          const ldJson = {
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            "name": service.name,
            "operatingSystem": "All",
            "applicationCategory": "WebApplication",
            "description": service.full_description,
            "url": `https://fixo-frontend.pages.dev/tools/${slug}`,
            "image": service.background_url,
            "offers": {
              "@type": "Offer",
              "price": 0,
              "priceCurrency": "USD"
            },
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": ratingValue,
              "reviewCount": reviewCount
            }
          };

          const ldScript = document.createElement("script");
          ldScript.type = "application/ld+json";
          ldScript.textContent = JSON.stringify(ldJson);
          document.head.appendChild(ldScript);

          app.innerHTML = `
            <div class="card detailed-card">
              <div class="image-wrapper">
                <img src="${service.background_url}" alt="${service.name}" />
                <div class="cat top-left">
                  ${(Array.isArray(service.categories) ? service.categories : JSON.parse(service.categories || "[]"))
                    .map(cat => `<span class="category-tag">${cat}</span>`).join("") || "Uncategorized"}
                </div>
                <div class="corner top-right" style="display: flex; align-items: center; gap: 6px;">
                  <h1 class="card-title">${service.name}</h1>
                </div>
                <div class="corner bottom-left">${service.pricing || "N/A"}</div>
                <div class="corner bottom-right likes" id="like-btn">❤️ ${likes}</div>
              </div>
              <p>${service.full_description}</p>
              <div style="margin-top: 20px;">
                <a href="${service.url}" target="_blank" style="display: inline-flex; align-items: center; gap: 6px; text-decoration: none;">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="black" viewBox="0 0 24 24">
                    <path d="M14 3h7v7h-2V6.41L10.41 15 9 13.59 17.59 5H14V3z"/>
                  </svg>
                  Visit original
                </a>
              </div>
              <br/><a href="#" onclick="history.back(); return false;">← Back to list</a>
            </div>`;

          // Attach like button handler
          setTimeout(() => {
            const likeEl = document.getElementById("like-btn");
            if (!likeEl) return;

            likeEl.addEventListener("click", (e) => {
              e.stopPropagation();
              fetch("https://api.dev-fixo-live.workers.dev/api/likes", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ service_id: service.id }),
              })
                .then(() => fetch(`https://api.dev-fixo-live.workers.dev/api/likes?service_id=${service.id}`))
                .then(res => res.json())
                .then(updated => {
                  likeEl.innerHTML = `❤️ ${updated.likes || 0}`;
                })
                .catch(() => {});
            });
          }, 50);
        })
        .catch(() => {});
    })
    .catch(() => {
      app.innerHTML = `<p>❌ Failed to load service.</p>`;
    });

  return;
}



  // ======== SERVICES LIST ==========
  const servicesContainer = document.getElementById("services");
  if (!servicesContainer) return;

  function createSkeletonCard() {
    const skeleton = document.createElement("div");
    skeleton.className = "card skeleton-card";
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
    const skeletons = Array.from(document.querySelectorAll(".skeleton-card")).slice(0, chunk.length);
    chunk.forEach((service, index) => {
      const card = document.createElement("div");
      card.className = "card";
      card.innerHTML = `
    <div class="image-wrapper">
      <img src="${service.background_url}" alt="${service.name}" />
<div class="cat top-left">
  ${(Array.isArray(service.categories) ? service.categories : JSON.parse(service.categories || "[]"))
    .map(cat => `<span class="category-tag">${cat}</span>`).join("") || "Uncategorized"}
</div>

      <a class="corner top-right external-link" href="${service.url}" target="_blank" onclick="event.stopPropagation();">
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

      card.addEventListener("click", (e) => {
        if (e.target.closest(".likes") || e.target.closest(".external-link")) return;
        window.location.href = `/tools/${service.slug}`;
      });

      const likeEl = card.querySelector(`#likes-${service.id}`);
      fetch(`https://api.dev-fixo-live.workers.dev/api/likes?service_id=${service.id}`)
        .then(res => res.json())
        .then(likeData => {
          likeEl.innerHTML = `❤️ ${likeData.likes || 0}`;
        })
        .catch(() => {
          likeEl.innerHTML = `❤️ 0`;
        });

      likeEl.addEventListener("click", (e) => {
        e.stopPropagation();
        fetch("https://api.dev-fixo-live.workers.dev/api/likes", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ service_id: service.id }),
        })
          .then(() => fetch(`https://api.dev-fixo-live.workers.dev/api/likes?service_id=${service.id}`))
          .then(res => res.json())
          .then(updated => {
            likeEl.innerHTML = `❤️ ${updated.likes || 0}`;
          })
          .catch(() => console.error("Failed to update likes."));
      });
    });
  }

  let currentOffset = 0;
  const chunkSize = 10;
  let isLoading = false;
  let endReached = false;


  


  let selectedCategories = [];

  fetch("https://api.dev-fixo-live.workers.dev/api/categories")
    .then(res => res.json())
    .then(categories => {
      const groupSize = 3;
      const groups = [];
      for (let i = 0; i < categories.length; i += groupSize) {
        const group = categories.slice(i, i + groupSize);
        groups.push(group);
      }
      
      filtersContainer.innerHTML = `
        <div id="categoryFilter">
          ${groups.map(group => `
            <div class="category-group">
              ${group.map(c => `
                <label class="category-label"><input type="checkbox" value="${c}" /> ${c}</label>
              `).join("")}
            </div>
          `).join("")}
        </div>
      `;
      
    

      document.querySelectorAll("#categoryFilter input[type='checkbox']").forEach(checkbox => {
        checkbox.addEventListener("change", () => {
          selectedCategories = Array.from(document.querySelectorAll("#categoryFilter input[type='checkbox']:checked"))
            .map(cb => cb.value);
          currentOffset = 0;
          endReached = false;
          servicesContainer.innerHTML = "";
          loadNextChunk();
        });
      });
    });

  function loadNextChunk() {
    if (isLoading || endReached) return;
    isLoading = true;

    const url = new URL("https://api.dev-fixo-live.workers.dev/api/services");
    url.searchParams.set("offset", currentOffset);
    url.searchParams.set("limit", chunkSize);
    if (selectedCategories.length) {
      url.searchParams.set("categories", selectedCategories.join(","));
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
      .catch(err => {
        console.error("API error:", err);
        servicesContainer.innerText = "Failed to load services.";
      })
      .finally(() => {
        isLoading = false;
      });
  }

  loadNextChunk();

  window.addEventListener("scroll", () => {
    const nearBottom = window.innerHeight + window.scrollY >= document.body.offsetHeight - 100;
    if (nearBottom) loadNextChunk();
  });
});
