// External Dependencies
import React, { useState, useEffect, useCallback, useMemo, memo } from 'react';
import axios from 'axios';

// Styles
import './Api.css';
import './Cart.css';

// Product Card Component

const ProductCard = memo(({ 
  producto, 
  onAddToCart, 
  onRemoveFromCart, 
  cartQuantity = 0 
}) => {
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
        
        <div className="quantity-controls">
          <button 
            className="quantity-btn"
            onClick={() => onRemoveFromCart(producto.id)}
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
    </div>
  );
});

function Productos({
  onAddToCart,
  onRemoveFromCart,
  carrito,
  productos,
  onProductsLoaded
}) {
  const [editingProduct, setEditingProduct] = useState(null);
  const [updateFields, setUpdateFields] = useState({
    title: false,
    price: false,
    description: false,
    img: false
  });

  // Iniciar edición de producto
  const startEditing = (producto) => {
    setEditingProduct({ ...producto });
    setUpdateFields({
      title: false,
      price: false,
      description: false,
      img: false
    });
  };

  // Cancelar edición
  const cancelEditing = () => {
    setEditingProduct(null);
    setUpdateFields({
      title: false,
      price: false,
      description: false,
      img: false
    });
  };

  // Actualizar producto (simulación local, puedes conectar a API real si lo deseas)
  const updateProduct = (id) => {
    if (!editingProduct) return;
    const fieldsToUpdate = {};
    Object.keys(updateFields).forEach(field => {
      if (updateFields[field]) {
        fieldsToUpdate[field] = editingProduct[field];
      }
    });
    if (Object.keys(fieldsToUpdate).length === 0) {
      alert('Selecciona al menos un campo para actualizar');
      return;
    }
    // Simulación: solo actualiza localmente
    if (typeof onProductsLoaded === 'function') {
      const nuevos = productos.map(prod =>
        prod.id === id ? { ...prod, ...fieldsToUpdate } : prod
      );
      onProductsLoaded(nuevos);
    }
    setEditingProduct(null);
    setUpdateFields({
      title: false,
      price: false,
      description: false,
      img: false
    });
    alert('Producto actualizado con éxito');
  };

  // Eliminar producto (simulación local)
  const deleteProduct = (id) => {
    if (typeof onProductsLoaded === 'function') {
      const nuevos = productos.filter(prod => prod.id !== id);
      onProductsLoaded(nuevos);
    }
    setEditingProduct(null);
    alert('Producto eliminado');
  };

  const memoizedProducts = useMemo(() => {
    if (!productos || productos.length === 0) {
      return <div style={{textAlign: 'center', color: '#888', fontSize: '1.2rem', marginTop: '2rem'}}>No hay productos que coincidan con los filtros seleccionados.</div>;
    }
    return productos.map(producto => {
      const cartQuantity = carrito ? (carrito.find(item => item.id === producto.id)?.quantity || 0) : 0;
      const isEditing = editingProduct && editingProduct.id === producto.id;
      return (
        <div className={`product-card${isEditing ? ' editing-active' : ''}`} key={producto.id}>
          <div className="product-image-container">
            <img 
              src={producto.image || producto.img} 
              alt={producto.title} 
              className="product-image"
              onError={e => { e.target.src = 'https://via.placeholder.com/300x200?text=No+Image'; }}
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
              <div className="edit-overlay" tabIndex={-1} aria-modal="true" role="dialog" onClick={e => {
                if (e.target.className === 'edit-overlay') cancelEditing();
              }}>
                <div className="edit-container" onClick={e => e.stopPropagation()}>
                  <h4>Editar Producto</h4>
                  <div className="edit-fields">
                    {Object.keys(updateFields).map(field => (
                      <label key={field} className="edit-field">
                        <div className="edit-field-header">
                          <input
                            type="checkbox"
                            checked={updateFields[field]}
                            onChange={e => setUpdateFields(prev => ({ ...prev, [field]: e.target.checked }))}
                          />
                          <span className="field-label">
                            {field.charAt(0).toUpperCase() + field.slice(1)}:
                          </span>
                        </div>
                        {field === 'description' ? (
                          <textarea
                            value={editingProduct[field] || ''}
                            onChange={e => setEditingProduct({ ...editingProduct, [field]: e.target.value })}
                            disabled={!updateFields[field]}
                            className="edit-input"
                            rows="3"
                          />
                        ) : (
                          <input
                            type={field === 'price' ? 'number' : 'text'}
                            value={editingProduct[field] || ''}
                            onChange={e => setEditingProduct({ ...editingProduct, [field]: e.target.value })}
                            disabled={!updateFields[field]}
                            className="edit-input"
                            step={field === 'price' ? '0.01' : undefined}
                          />
                        )}
                      </label>
                    ))}
                  </div>
                  <div className="edit-actions">
                    <button className="secondary-btn" onClick={cancelEditing}>Cancelar</button>
                    <button className="primary-btn" onClick={() => updateProduct(producto.id)}>Guardar</button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="product-actions">
                <div className="action-buttons">
                  <button className="secondary-btn" onClick={() => startEditing(producto)}>Editar</button>
                  <button className="secondary-btn" onClick={() => deleteProduct(producto.id)}>Eliminar</button>
                </div>
                <div className="quantity-controls">
                  <button className="quantity-btn" onClick={() => onRemoveFromCart(producto.id)} disabled={cartQuantity === 0}>-</button>
                  <span className="quantity-display">{cartQuantity}</span>
                  <button className="quantity-btn" onClick={() => onAddToCart(producto)}>+</button>
                </div>
              </div>
            )}
          </div>
        </div>
      );
    });
  }, [productos, carrito, editingProduct, updateFields, onAddToCart, onRemoveFromCart]);

  return (
    <div className="app-container">
      <main className="main-content" style={{minHeight: '70vh', background: '#f7f7f9', padding: '2rem 0'}}>
        <div className="products-grid" style={{maxWidth: '1200px', margin: '0 auto'}}>
          {memoizedProducts}
        </div>
      </main>
    </div>
  );
}

export default Productos;