import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import Api from './components/Api';
import Cart from './components/Cart';
import ProductFilters from './components/ProductFilters';

function App() {
  // Estado para el carrito y su visibilidad
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [carrito, setCarrito] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [cartTotal, setCartTotal] = useState('0.00');
  const [allProducts, setAllProducts] = useState([]); // Solo productos de la API
  const [filteredProducts, setFilteredProducts] = useState([]);

  // Funciones para abrir/cerrar el carrito
  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);

  // Función para formatear el precio
  const formatPrice = (price) => Number(price).toFixed(2);

  // Funciones para manejar cantidades en el carrito
  const handleDecrease = (id) => {
    setCarrito(prev => prev.map(item => item.id === id && item.quantity > 1 ? { ...item, quantity: item.quantity - 1 } : item).filter(item => item.quantity > 0));
  };
  const handleIncrease = (id) => {
    setCarrito(prev => prev.map(item => item.id === id ? { ...item, quantity: item.quantity + 1 } : item));
  };
  const handleRemove = (id) => {
    setCarrito(prev => prev.filter(item => item.id !== id));
  };

  // Función para agregar productos al carrito correctamente
  const handleAddToCart = (product) => {
    setCarrito(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  // Actualizar totales cuando cambia el carrito
  React.useEffect(() => {
    setTotalItems(carrito.reduce((acc, item) => acc + item.quantity, 0));
    setCartTotal(formatPrice(carrito.reduce((acc, item) => acc + item.price * item.quantity, 0)));
  }, [carrito]);

  // Cuando se cargan productos desde la API, sincronizar filtros
  const handleProductsLoaded = (prods) => {
    setAllProducts(prods);
    setFilteredProducts(prods);
  };

  // Fetch products from API on first render
  useEffect(() => {
    async function fetchProducts() {
      try {
        const response = await axios.get('https://fakestoreapi.com/products');
        setAllProducts(response.data);
        setFilteredProducts(response.data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    }
    fetchProducts();
  }, []);

  // Renderizado principal con panel de filtros y productos filtrados
  return (
    <div className="App">
      {/* Header sofisticado y limpio */}
      <header className="App-header" style={{
        background: '#fff',
        boxShadow: '0 2px 8px rgba(0,0,0,0.07)',
        padding: '1.5rem 0',
        marginBottom: '2rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'sticky',
        top: 0,
        zIndex: 100
      }}>
        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', maxWidth: '1200px', margin: '0 auto'}}>
          <div style={{display: 'flex', alignItems: 'center', gap: '1.5rem'}}>
            <div style={{display: 'flex', alignItems: 'center', gap: '0.75rem'}}>
              <img src="/img/LOGO.jpg" alt="Shop Logo" style={{height: '56px', width: '56px', borderRadius: '50%', boxShadow: '0 2px 8px rgba(0,0,0,0.12)', border: '2px solid #222', background: '#fff'}} />
              <span style={{fontWeight: 900, fontSize: '2.2rem', letterSpacing: '2px', color: '#222', fontFamily: 'Montserrat, Arial, sans-serif', textShadow: '0 2px 8px rgba(0,0,0,0.04)'}}>Tienda Exclusiva</span>
            </div>
          </div>
          <div style={{display: 'flex', alignItems: 'center', gap: '1.5rem'}}>
            <span style={{fontSize: '1.1rem', color: '#888'}}>Descubre productos de moda, tecnología, hogar y más</span>
            <button className="open-cart-btn" onClick={openCart} style={{fontSize: '1.1rem', background: '#222', color: '#fff', border: 'none', borderRadius: '6px', padding: '0.7rem 1.5rem', cursor: 'pointer', boxShadow: '0 1px 4px rgba(0,0,0,0.08)'}}>
              🛒 <span style={{marginLeft: '0.5rem', fontWeight: 700, background: '#fff', color: '#222', borderRadius: '50%', padding: '0.2em 0.7em', fontSize: '1.05em', boxShadow: '0 1px 4px rgba(0,0,0,0.08)'}}>{totalItems}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Panel de filtros avanzado solo si hay productos */}
      {allProducts.length > 0 && (
        <ProductFilters products={allProducts} onFilter={setFilteredProducts} />
      )}

      <main className="products-container" style={{ position: 'relative', zIndex: 10 }}>
        <Api 
          onAddToCart={handleAddToCart}
          onRemoveFromCart={handleDecrease}
          carrito={carrito}
          productos={filteredProducts}
          onProductsLoaded={handleProductsLoaded}
        />
      </main>

      {/* Footer clásico con información y acceso al carrito */}
      <footer className="App-footer" style={{background: '#fff', borderTop: '1px solid #eee', padding: '2rem 0', marginTop: '2rem'}}>
        <div style={{maxWidth: '1200px', margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem'}}>
          <div style={{fontWeight: 500, fontSize: '1.1rem', color: '#222'}}>Compra productos originales de moda, tecnología, hogar, belleza y mucho más. Envíos rápidos y atención personalizada.</div>
          <div style={{color: '#888', fontSize: '0.95rem'}}>© {new Date().getFullYear()} Tienda Exclusiva. Todos los derechos reservados.</div>
          <div style={{marginTop: '0.5rem'}}>
            <a href="#" style={{color: '#222', textDecoration: 'none', marginRight: '1.5rem'}}>Catálogo</a>
            <a href="#" style={{color: '#222', textDecoration: 'none', marginRight: '1.5rem'}}>Ayuda</a>
            <a href="#" style={{color: '#222', textDecoration: 'none'}}>Términos y condiciones</a>
          </div>
        </div>
      </footer>

      {/* Cart Sidebar funcional */}
      <Cart
        isCartOpen={isCartOpen}
        closeCart={closeCart}
        carrito={carrito}
        totalItems={totalItems}
        cartTotal={cartTotal}
        formatPrice={formatPrice}
        handleDecrease={handleDecrease}
        handleIncrease={handleIncrease}
        handleRemove={handleRemove}
      />
    </div>
  );
}

export default App;
