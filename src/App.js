import React, { useState } from 'react';
import './App.css';
import ProductCard from './components/ProductCard';
import ProductFilters from './components/ProductFilters';
import Api from './components/Api'



function App() {

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


      <main className="products-container">
       <Api/> 
        
        
      </main>
    </div>
  );
}

export default App;
