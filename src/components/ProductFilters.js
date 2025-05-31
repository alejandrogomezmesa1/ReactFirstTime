import React, { useState, useEffect } from "react";
import './ProductFilters.css';

function ProductFilters({ products, onFilter }) {
  const [maxPrice, setMaxPrice] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [search, setSearch] = useState('');

  // Extraer categorías únicas de los productos de la API
  const categories = Array.from(new Set(products.map(p => p.category).filter(Boolean)));

  useEffect(() => {
    const filteredProducts = products.filter(product => {
      const price = Number(product.price);
      const category = product.category;
      const title = product.title;
      const description = product.description;

      const matchMaxPrice = maxPrice ? price <= Number(maxPrice) : true;
      const matchMinPrice = minPrice ? price >= Number(minPrice) : true;
      const matchCategory = selectedCategory ? category === selectedCategory : true;
      const matchSearch = search ? (
        (title && title.toLowerCase().includes(search.toLowerCase())) ||
        (description && description.toLowerCase().includes(search.toLowerCase()))
      ) : true;
      return matchMaxPrice && matchMinPrice && matchCategory && matchSearch;
    });
    onFilter(filteredProducts);
  }, [maxPrice, minPrice, selectedCategory, search, products, onFilter]);

  return (
    <div className="filters-container">
      <h2>Filtrar Por</h2>
      <div className="filters">
        <input
          type="text"
          placeholder="Buscar por nombre o descripción"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <input
          type="number"
          placeholder="Precio mínimo"
          value={minPrice}
          onChange={e => setMinPrice(e.target.value)}
          min="0"
        />
        <input
          type="number"
          placeholder="Precio máximo"
          value={maxPrice}
          onChange={e => setMaxPrice(e.target.value)}
          min="0"
        />
        <select value={selectedCategory} onChange={e => setSelectedCategory(e.target.value)}>
          <option value="">Todas las categorías</option>
          {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
        </select>
      </div>
    </div>
  );
}

export default ProductFilters;
