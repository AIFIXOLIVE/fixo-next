'use client';

export default function CategoryFilter({ categories = [], selectedCategories = [], onToggle }) {
  return (
    <div id="filtersContainer">
      {categories.map(cat => (
        <label key={cat} className="category-label">
          <input
            type="checkbox"
            checked={selectedCategories.includes(cat)}
            onChange={() => onToggle(cat)}
          />
          {cat}
        </label>
      ))}
    </div>
  );
}
