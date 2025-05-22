import React, { useState } from 'react';
import './App.css';
import ProductCard from './components/ProductCard';
import { products } from './components/products';
import ProductFilters from './components/ProductFilters';

function App() {
  const [filteredProducts, setFilteredProducts] = useState(products);

  const handleFilter = (filteredList) => {
    setFilteredProducts(filteredList);
  };

  return (
    <div className="App">
      <header className="App-header">
        <img src="/img/LOGO.jpg" alt="Porsche Logo" className="logo" />
        <img src="/img/LOGO2.jpg" alt="Porsche Logo" className="logo" />
        <img src="/img/LOGO2.jpg" alt="Porsche Logo" className="logo" />
        <img src="/img/LOGO.jpg" alt="Porsche Logo" className="logo" />
        <img src="/img/LOGO2.jpg" alt="Porsche Logo" className="logo" />
        <img src="/img/LOGO2.jpg" alt="Porsche Logo" className="logo" />
        <img src="/img/LOGO.jpg" alt="Porsche Logo" className="logo" />


      </header>

      {/* Pasar productos y función de filtrado a `ProductFilters` */}
      <ProductFilters products={products} onFilter={handleFilter} />

      <main className="products-container">
        {filteredProducts.map((product, index) => (
          <ProductCard key={index} {...product} />
        ))}
      </main>
    </div>
  );
}

export default App;
