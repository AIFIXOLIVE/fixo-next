'use client';

export default function LoaderSkeleton({ count = 3 }) {
  return (
    <>
      {Array.from({ length: count }).map((_, idx) => (
        <div key={idx} className="card skeleton-card">
          <div className="skeleton-img" />
          <div className="skeleton-title" />
          <div className="skeleton-text" />
          <div className="skeleton-text short" />
        </div>
      ))}
    </>
  );
}