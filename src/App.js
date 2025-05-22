import React from 'react';
import './App.css';
import ProductCard from './components/ProductCard';

const products = [
  { image: '/img/CAYENNEGTS.webp', name: 'Porsche Cayenne GTS', year: 2024, category: 'SUV', price: 124900, description: 'SUV deportivo con motor V8 biturbo de 4.0L y 493 HP. Aceleración 0-100 km/h en 4.2s. Tracción AWD y suspensión adaptativa.' },

  { image: '/img/MACANEV.jpg', name: 'Porsche Macan EV', year: 2024, category: 'SUV Eléctrico', price: 75300, description: 'SUV eléctrico con hasta 576 HP y autonomía de 495 km. Carga rápida de 10% a 80% en 21 min. Aceleración 0-100 km/h en 3.3s.' },

  { image: '/img/TAYCAN.jpg', name: 'Porsche Taycan Turbo S', year: 2024, category: 'Sedán Eléctrico', price: 264200, description: 'Sedán eléctrico con 761 HP y autonomía de hasta 525 km. Aceleración 0-100 km/h en 2.4s. Carga rápida de 10% a 80% en 18 min.' },

  { image: '/img/PANAMERA.jpg', name: 'Porsche Panamera Turbo S E-Hybrid', year: 2024, category: 'Sedán Híbrido', price: 204894, description: 'Sedán híbrido con 699 HP y autonomía eléctrica de 50 km. Aceleración 0-100 km/h en 3.2s. Velocidad máxima de 315 km/h.' },

  { image: '/img/911993CARRERA4S.jpg', name: 'Porsche 993 Carrera 4S', year: 1995, category: 'Clásico Deportivo', price: 138990, description: 'Clásico deportivo con motor bóxer de 6 cilindros y 282 HP. Tracción AWD y diseño icónico de los años 90.' },

  { image: '/img/911GT2RS.jpg', name: 'Porsche 911 GT2 RS', year: 2018, category: 'Superdeportivo', price: 293200, description: 'Superdeportivo con motor bóxer biturbo de 700 HP. Aceleración 0-100 km/h en 2.8s. Velocidad máxima de 340 km/h.' },

  { image: '/img/718CAYMAN.jpg', name: 'Porsche Cayman 718', year: 2024, category: 'Coupé Deportivo', price: 72800, description: 'Coupé deportivo con motor bóxer de 300 HP. Aceleración 0-100 km/h en 4.9s. Tracción trasera y chasis ligero.' },

  { image: '/img/911.jpg', name: 'Porsche 911 Carrera', year: 2024, category: 'Deportivo Clásico', price: 114400, description: 'Deportivo icónico con motor bóxer de 379 HP. Aceleración 0-100 km/h en 4.0s. Diseño clásico con tecnología moderna.' },

  { image: '/img/718BOXSTER.jpg', name: 'Porsche 718 Boxster', year: 2024, category: 'Roadster', price: 68300, description: 'Roadster con motor bóxer de 300 HP. Aceleración 0-100 km/h en 4.9s. Manejo ágil y diseño descapotable.' },

  { image: '/img/CROSSTURISMO.jpg', name: 'Porsche Taycan Cross Turismo', year: 2024, category: 'Sedán Eléctrico', price: 111100, description: 'Versión aventurera del Taycan con hasta 750 HP. Autonomía de 246 millas y tracción AWD para terrenos difíciles.' },

  { image: '/img/MACAN.jpg', name: 'Porsche Macan', year: 2024, category: 'SUV', price: 62900, description: 'SUV compacto con motor turbo de 261 HP. Aceleración 0-100 km/h en 6.0s. Diseño deportivo y versátil.' },

  { image: '/img/CayenneE-Hybrid.jpg', name: 'Porsche Cayenne E-Hybrid', year: 2024, category: 'SUV Híbrido', price: 97200, description: 'SUV híbrido con 463 HP. Aceleración 0-100 km/h en 4.9s. Autonomía eléctrica y eficiencia mejorada.' }
];



function App() {
  return (
    <div className="App">
      <header className="App-header">
        <div className="header-text">
        <img src="/img/LOGO.jpg" alt="Porsche Logo" className="logo" />
        </div>
        <div className="header-text">
        <img src="/img/HEADER-FONDO.jpg" alt="Porsche Logo" className="logo" />
        </div>
        <div className="header-text">
        <img src="/img/HEADER-FONDO.jpg" alt="Porsche Logo" className="logo" />
        </div>
        <div className="header-text">
        <img src="/img/LOGO.jpg" alt="Porsche Logo" className="logo" />
        </div>        
        <div className="header-text">
        <img src="/img/HEADER-FONDO.jpg" alt="Porsche Logo" className="logo" />
        </div>
        <div className="header-text">
        <img src="/img/HEADER-FONDO.jpg" alt="Porsche Logo" className="logo" />
        </div>
        <div className="header-text">
        <img src="/img/LOGO.jpg" alt="Porsche Logo" className="logo" />
        </div>
      </header>
      <main className="products-container">
        {products.map((product, index) => (
          <ProductCard key={index} {...product} />
        ))}
      </main>
    </div>
  );
}

export default App;
