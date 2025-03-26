'use client';
import React from 'react';

export default function CategoryFilter({ categories, selectedCategories, toggleCategory }) {
  return (
    <div className="category-scroll-wrapper">
      <div id="filtersContainer">
        {categories.map((cat) => (
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
  );
}