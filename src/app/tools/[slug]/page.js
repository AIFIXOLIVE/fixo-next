export const dynamic = 'force-dynamic';
'use client';

import { useParams } from 'next/navigation';

export default function ToolPage() {
  const { slug } = useParams();

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Привет! Это динамическая страница</h1>
      <p>Слаг из URL: <strong>{slug}</strong></p>
    </div>
  );
}
