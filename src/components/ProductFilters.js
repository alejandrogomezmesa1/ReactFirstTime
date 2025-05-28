import React, { useState, useEffect } from "react";
import './ProductFilters.css';

function ProductFilters({ products, onFilter }) {
  const [selectedYear, setSelectedYear] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  const years = [...new Set(products.map(p => p.year))].sort((a, b) => b - a);

  const filteredProducts = products.filter(product => {
    const matchYear = selectedYear ? product.year === Number(selectedYear) : true;
    const matchMaxPrice = maxPrice ? product.price <= Number(maxPrice) : true;
    const matchCategory = selectedCategory ? product.category === selectedCategory : true;
    return matchYear && matchMaxPrice && matchCategory;
  });

  // Enviar los productos filtrados a `App.js`
  useEffect(() => {
    onFilter(filteredProducts);
  }, [selectedYear, maxPrice, selectedCategory]);

  return (
    <div className="filters-container">
      <h2>Filtrar Por</h2>
      <div className="filters">
        <select value={selectedYear} onChange={e => setSelectedYear(e.target.value)}>
          <option value="">Todos los años</option>
          {years.map(year => <option key={year} value={year}>{year}</option>)}
        </select>
        <input type="number" placeholder="Precio máximo" value={maxPrice} onChange={e => setMaxPrice(e.target.value)} min="0" />
        <select value={selectedCategory} onChange={e => setSelectedCategory(e.target.value)}>
          <option value="">Todas las categorías</option>
          {Array.from(new Set(products.map(p => p.category))).map(cat => <option key={cat} value={cat}>{cat}</option>)}
        </select>
      </div>
    </div>
  );
}

export default ProductFilters;
