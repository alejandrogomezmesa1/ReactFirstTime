// External Dependencies
import React, { useState, useEffect, useCallback, useMemo, memo } from 'react';
import axios from 'axios';

// Local Dependencies
import { products as localProductsData } from './products';

// Styles
import './Api.css';
import './Cart.css';

// Product Card Component
const ProductCard = memo(({ 
  producto, 
  startEditing, 
  deleteProduct, 
  editingProduct, 
  updateFields, 
  setEditingProduct, 
  setUpdateFields, 
  updateProduct, 
  cancelEditing, 
  onAddToCart, 
  onRemoveFromCart, 
  cartQuantity = 0 
}) => {
  const isEditing = editingProduct && editingProduct.id === producto.id;

  return (
    <div className="product-card">
      <div className="product-image-container">
        <img 
          src={producto.image || producto.img} 
          alt={producto.title} 
          className="product-image"
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/300x200?text=No+Image';
          }}
        />
        {cartQuantity > 0 && (
          <span className="product-badge">{cartQuantity} in cart</span>
        )}
      </div>
      
      <div className="product-details">
        <h3 className="product-title">{producto.title}</h3>
        <p className="product-price">${Number(producto.price).toFixed(2)}</p>
        <p className="product-description">
          {producto.description?.length > 100 
            ? `${producto.description.substring(0, 100)}...` 
            : producto.description}
        </p>
        
        {isEditing ? (
          <div className="edit-overlay" onClick={(e) => {
            if (e.target.className === 'edit-overlay') {
              cancelEditing();
            }
          }}>
            <div className="edit-container" onClick={e => e.stopPropagation()}>
              <h4>Edit Product</h4>
              <div className="edit-fields">
                {Object.keys(updateFields).map(field => (
                  <label key={field} className="edit-field">
                    <div className="edit-field-header">
                      <input
                        type="checkbox"
                        checked={updateFields[field]}
                        onChange={(e) => setUpdateFields(prev => ({
                          ...prev,
                          [field]: e.target.checked
                        }))}
                      />
                      <span className="field-label">
                        {field.charAt(0).toUpperCase() + field.slice(1)}:
                      </span>
                    </div>
                    {field === 'description' ? (
                      <textarea
                        value={editingProduct[field] || ''}
                        onChange={(e) => setEditingProduct({
                          ...editingProduct, 
                          [field]: e.target.value
                        })}
                        disabled={!updateFields[field]}
                        className="edit-input"
                        rows="3"
                      />
                    ) : (
                      <input
                        type={field === 'price' ? 'number' : 'text'}
                        value={editingProduct[field] || ''}
                        onChange={(e) => setEditingProduct({
                          ...editingProduct, 
                          [field]: e.target.value
                        })}
                        disabled={!updateFields[field]}
                        className="edit-input"
                        step={field === 'price' ? '0.01' : ''}
                      />
                    )}
                  </label>
                ))}
              </div>
              <div className="edit-actions">
                <button 
                  className="secondary-btn"
                  onClick={cancelEditing}
                >
                  Cancel
                </button>
                <button 
                  className="primary-btn"
                  onClick={() => updateProduct(producto.id)}
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="product-actions">
            <div className="action-buttons">
              <button 
                className="secondary-btn"
                onClick={() => startEditing(producto)}
              >
                Edit
              </button>
              <button 
                className="secondary-btn"
                onClick={() => deleteProduct(producto.id)}
              >
                Delete
              </button>
            </div>
            <div className="quantity-controls">
              <button 
                className="quantity-btn"
                onClick={() => onRemoveFromCart(producto)}
                disabled={cartQuantity === 0}
              >
                -
              </button>
              <span className="quantity-display">
                {cartQuantity}
              </span>
              <button 
                className="quantity-btn"
                onClick={() => onAddToCart(producto)}
              >
                +
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
});

function Productos() {
  const [productos, setProductos] = useState([]);
  const [carrito, setCarrito] = useState([]);
  const [localProducts] = useState(localProductsData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);
  const [updateFields, setUpdateFields] = useState({
    title: false,
    price: false,
    description: false,
    img: false
  });

  // Fetch initial products
  const fetchData = useCallback(async () => {
    try {
      const response = await axios.get('https://fakestoreapi.com/products');
      const combinedProducts = [...response.data, ...localProducts];
      setProductos(combinedProducts);
      setLoading(false);
    } catch (error) {
      setError('Error al cargar los productos');
      setLoading(false);
      console.error('Error al obtener productos:', error);
    }
  }, [localProducts]);

  // Fetch products on component mount
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Clean up function for useEffect
  useEffect(() => {
    return () => {
      // Any cleanup code if needed
    };
  }, []);



  // Iniciar edición de producto
  const startEditing = useCallback((producto) => {
    setEditingProduct({...producto});
    setUpdateFields({
      title: false,
      price: false,
      description: false,
      img: false
    });
  }, []);

  // Cancelar edición
  const cancelEditing = useCallback(() => {
    setEditingProduct(null);
    setUpdateFields({
      title: false,
      price: false,
      description: false,
      img: false
    });
  }, []);

  // Actualizar producto
  const updateProduct = useCallback(async (id) => {
    try {
      if (!editingProduct) return;

      // Crear objeto con solo los campos seleccionados para actualizar
      const fieldsToUpdate = {};
      Object.keys(updateFields).forEach(field => {
        if (updateFields[field]) {
          fieldsToUpdate[field] = editingProduct[field];
        }
      });

      // Si no hay campos seleccionados, no hacer nada
      if (Object.keys(fieldsToUpdate).length === 0) {
        alert('Selecciona al menos un campo para actualizar');
        return;
      }

      const response = await axios.put(`https://fakestoreapi.com/products/${id}`, fieldsToUpdate);
      
      setProductos(productos.map(prod => 
        prod.id === id ? { ...prod, ...response.data } : prod
      ));
      
      setEditingProduct(null);
      setUpdateFields({
        title: false,
        price: false,
        description: false,
        img: false
      });

      alert('Producto actualizado con éxito');
    } catch (error) {
      console.error("Error al actualizar producto:", error);
      alert('Error al actualizar el producto');
    }
  }, [editingProduct, productos, updateFields]);

  // Eliminar producto
  const deleteProduct = useCallback(async (id) => {
    try {
      await axios.delete(`https://fakestoreapi.com/products/${id}`);
      setProductos(productos.filter(prod => prod.id !== id));
    } catch (error) {
      console.error("Error al eliminar producto:", error);
    }
  }, [productos]);

  // Funciones para manejar el carrito
  const addToCart = useCallback((product) => {
    setCarrito(prevCart => {
      const existingItem = prevCart.find(item => item.id === product.id);
      if (existingItem) {
        return prevCart.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });
  }, []);

  const removeFromCart = useCallback((product) => {
    setCarrito(prevCart => {
      const existingItem = prevCart.find(item => item.id === product.id);
      if (existingItem && existingItem.quantity > 1) {
        return prevCart.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity - 1 }
            : item
        );
      }
      return prevCart.filter(item => item.id !== product.id);
    });
  }, []);

  // State for cart sidebar
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Toggle cart sidebar
  const toggleCart = useCallback(() => {
    setIsCartOpen(prev => !prev);
  }, []);

  // Close cart
  const closeCart = useCallback(() => {
    setIsCartOpen(false);
  }, []);

  // Calculate cart total
  const cartTotal = useMemo(() => {
    return carrito.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2);
  }, [carrito]);

  // Calculate total items in cart
  const totalItems = useMemo(() => {
    return carrito.reduce((total, item) => total + item.quantity, 0);
  }, [carrito]);

  // Get quantity of a product in cart
  const getCartQuantity = useCallback((productId) => {
    const item = carrito.find(item => item.id === productId);
    return item ? item.quantity : 0;
  }, [carrito]);

  // Format price with 2 decimal places
  const formatPrice = useCallback((price) => {
    return Number(price).toFixed(2);
  }, []);

  // Memoiza la lista de productos
  const memoizedProducts = useMemo(() => productos.map(producto => {
    const cartQuantity = getCartQuantity(producto.id);
    return (
      <ProductCard 
        key={producto.id}
        producto={producto}
        startEditing={startEditing}
        deleteProduct={deleteProduct}
        editingProduct={editingProduct}
        updateFields={updateFields}
        setEditingProduct={setEditingProduct}
        setUpdateFields={setUpdateFields}
        updateProduct={updateProduct}
        cancelEditing={cancelEditing}
        onAddToCart={addToCart}
        onRemoveFromCart={removeFromCart}
        cartQuantity={cartQuantity}
      />
    );
  }), [productos, startEditing, deleteProduct, editingProduct, updateFields, updateProduct, cancelEditing, addToCart, removeFromCart, getCartQuantity]);

  if (loading) return (
    <div className="loading-container">
      <div className="loading-spinner"></div>
      <p>Cargando productos...</p>
    </div>
  );
  
  if (error) return (
    <div className="error-container">
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="12" y1="8" x2="12" y2="12"></line>
        <line x1="12" y1="16" x2="12.01" y2="16"></line>
      </svg>
      <p>{error}</p>
      <button onClick={fetchData} className="btn btn-primary">
        Reintentar
      </button>
    </div>
  );

  return (
    <div className="app-container">
      {/* Header */}
      <header className="main-header">
        <div className="header-content">
          <h1>Tienda de Productos</h1>
          <button 
            className="cart-button" 
            onClick={toggleCart}
            aria-label={`Ver carrito (${totalItems} ${totalItems === 1 ? 'producto' : 'productos'})`}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="9" cy="21" r="1"></circle>
              <circle cx="20" cy="21" r="1"></circle>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
            </svg>
            <span className="cart-count">{totalItems}</span>
            <span className="cart-total-amount">${cartTotal}</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="main-content">
        <div className="products-grid">
          {memoizedProducts}
        </div>
      </main>

      {/* Cart Sidebar */}
      <div className={`cart-sidebar ${isCartOpen ? 'open' : ''}`}>
        <div className="cart-header">
          <div>
            <h2>Tu carrito</h2>
            <p className="cart-item-count">
              {totalItems} {totalItems === 1 ? 'producto' : 'productos'}
            </p>
          </div>
          <button 
            onClick={closeCart} 
            className="close-cart"
            aria-label="Cerrar carrito"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <div className="cart-content">
          {carrito.length === 0 ? (
            <div className="empty-cart">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="9" cy="21" r="1"></circle>
                <circle cx="20" cy="21" r="1"></circle>
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
              </svg>
              <h3>Tu carrito está vacío</h3>
              <p>Agrega algunos productos increíbles a tu carrito</p>
              <button 
                onClick={closeCart}
                className="btn btn-outline"
              >
                Seguir comprando
              </button>
            </div>
          ) : (
            <>
              <ul className="cart-items">
                {carrito.map(item => (
                  <li key={`${item.id}-${item.quantity}`} className="cart-item">
                    <img 
                      src={item.image || item.img} 
                      alt={item.title}
                      className="cart-item-image"
                      loading="lazy"
                    />
                    <div className="cart-item-details">
                      <h4 className="cart-item-title" title={item.title}>
                        {item.title}
                      </h4>
                      <p className="cart-item-price">
                        ${formatPrice(item.price * item.quantity)}
                        {item.quantity > 1 && (
                          <span>${formatPrice(item.price)} c/u</span>
                        )}
                      </p>
                      <div className="quantity-controls">
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            removeFromCart(item);
                          }}
                          className="quantity-btn"
                          aria-label="Reducir cantidad"
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="5" y1="12" x2="19" y2="12"></line>
                          </svg>
                        </button>
                        <span className="quantity-display">{item.quantity}</span>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            addToCart(item);
                          }}
                          className="quantity-btn"
                          aria-label="Aumentar cantidad"
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="12" y1="5" x2="12" y2="19"></line>
                            <line x1="5" y1="12" x2="19" y2="12"></line>
                          </svg>
                        </button>
                      </div>
                    </div>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        setCarrito(carrito.filter(i => i.id !== item.id));
                      }}
                      className="remove-item"
                      aria-label="Eliminar producto"
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="3 6 5 6 21 6"></polyline>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                        <line x1="10" y1="11" x2="10" y2="17"></line>
                        <line x1="14" y1="11" x2="14" y2="17"></line>
                      </svg>
                    </button>
                  </li>
                ))}
              </ul>

              <div className="cart-summary">
                <div className="summary-row">
                  <span>Subtotal ({totalItems} {totalItems === 1 ? 'producto' : 'productos'})</span>
                  <span>${cartTotal}</span>
                </div>
                <div className="summary-row">
                  <span>Envío</span>
                  <span>Gratis</span>
                </div>
                <div className="summary-total">
                  <span>Total</span>
                  <span className="total-amount">${cartTotal}</span>
                </div>
              </div>

              <button 
                className="checkout-btn"
                onClick={() => {
                  alert('¡Gracias por tu compra!');
                  setCarrito([]);
                  closeCart();
                }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '8px' }}>
                  <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                  <line x1="3" y1="6" x2="21" y2="6"></line>
                  <path d="M16 10a4 4 0 0 1-8 0"></path>
                </svg>
                Proceder al pago
              </button>

              <p className="secure-payment">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                </svg>
                Pago seguro con tarjeta de crédito, débito o transferencia
              </p>
            </>
          )}
        </div>
      </div>

      {/* Overlay when cart is open */}
      {isCartOpen && (
        <div className="cart-overlay" onClick={closeCart}></div>
      )}
    </div>
  );
}

export default Productos;