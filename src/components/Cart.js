import React from 'react';

function Cart({
  isCartOpen,
  closeCart,
  carrito,
  totalItems,
  cartTotal,
  formatPrice,
  handleDecrease,
  handleIncrease,
  handleRemove
}) {
  return (
    <>
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
            X
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
                x
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
                          onClick={() => handleDecrease(item.id)}
                          className="quantity-btn"
                          aria-label="Reducir cantidad"
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="5" y1="12" x2="19" y2="12"></line>
                          </svg>
                        </button>
                        <span className="quantity-display">{item.quantity}</span>
                        <button 
                          onClick={() => handleIncrease(item.id)}
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
                      onClick={() => handleRemove(item.id)}
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
                  alert('¡Compra realizada con éxito!');
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
    </>
  );
}

export default Cart;