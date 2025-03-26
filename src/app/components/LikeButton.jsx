'use client';

import { useEffect, useState } from 'react';

export default function LikeButton({ serviceId }) {
  const [likes, setLikes] = useState(0);

  useEffect(() => {
    fetch(`https://api.dev-fixo-live.workers.dev/api/likes?service_id=${serviceId}`)
      .then(res => res.json())
      .then(data => setLikes(data.likes || 0))
      .catch(() => setLikes(0));
  }, [serviceId]);

  const handleLike = (e) => {
    e.stopPropagation();
    fetch("https://api.dev-fixo-live.workers.dev/api/likes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ service_id: serviceId }),
    })
      .then(() => fetch(`https://api.dev-fixo-live.workers.dev/api/likes?service_id=${serviceId}`))
      .then(res => res.json())
      .then(data => setLikes(data.likes || 0))
      .catch(console.error);
  };

  return (
    <div className="corner bottom-right likes" onClick={handleLike}>
      ❤️ {likes}
    </div>
  );
}
