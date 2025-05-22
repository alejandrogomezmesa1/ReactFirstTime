import React from 'react';
import './ProductCard.css';

function ProductCard({ image, name, price, description,category,year }) {
  return (
    <div className="product-card">
            <div className="product-image">
                <img src={image} alt={name}/>
            </div>
    
        <div className="product-info">

            <h2 className="product-name">{name}</h2>
            <p className="product-price">${price}</p>
            <div className="product-data">
                <p className="product-data-category">{category}</p>
                <p className="product-data-year">{year}</p>
            </div>
            <p className="product-description">{description}</p>
            <button className="buy-button">Comprar ahora</button>
        </div>
    </div> 
  );
}
 export default ProductCard;
// ProductCard.css




