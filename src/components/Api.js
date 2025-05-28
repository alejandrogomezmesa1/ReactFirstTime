import React, { useState, useEffect, useCallback, useMemo, memo } from "react";
import axios from "axios";
import { products as localProductsData } from './products';
import './Api.css';

// Componente ProductCard memoizado
const ProductCard = memo(({ producto, startEditing, deleteProduct, editingProduct, updateFields, setEditingProduct, setUpdateFields, updateProduct, cancelEditing }) => {
  return (
    <div key={producto.id} className="product-card">
      <img src={producto.image || producto.img} alt={producto.title} />
      <h3>{producto.title}</h3>
      <p>${producto.price}</p>
      <p>{producto.description}</p>
      <div className="product-actions">
        {editingProduct && editingProduct.id === producto.id ? (
          <div className="edit-overlay" onClick={(e) => {
            if (e.target.className === 'edit-overlay') {
              cancelEditing();
            }
          }}>
            <div className="edit-container">
              <div className="edit-fields">
                <label>
                  <input
                    type="checkbox"
                    checked={updateFields.title}
                    onChange={(e) => setUpdateFields({...updateFields, title: e.target.checked})}
                  />
                  <span>Título:</span>
                  <input
                    type="text"
                    value={editingProduct.title}
                    onChange={(e) => setEditingProduct({...editingProduct, title: e.target.value})}
                    disabled={!updateFields.title}
                  />
                </label>
              
                <label>
                  <input
                    type="checkbox"
                    checked={updateFields.price}
                    onChange={(e) => setUpdateFields({...updateFields, price: e.target.checked})}
                  />
                  <span>Precio:</span>
                  <input
                    type="number"
                    value={editingProduct.price}
                    onChange={(e) => setEditingProduct({...editingProduct, price: e.target.value})}
                    disabled={!updateFields.price}
                  />
                </label>
              
                <label>
                  <input
                    type="checkbox"
                    checked={updateFields.description}
                    onChange={(e) => setUpdateFields({...updateFields, description: e.target.checked})}
                  />
                  <span>Descripción:</span>
                  <textarea
                    value={editingProduct.description}
                    onChange={(e) => setEditingProduct({...editingProduct, description: e.target.value})}
                    disabled={!updateFields.description}
                  />
                </label>
              
                <label>
                  <input
                    type="checkbox"
                    checked={updateFields.img}
                    onChange={(e) => setUpdateFields({...updateFields, img: e.target.checked})}
                  />
                  <span>URL Imagen:</span>
                  <input
                    type="text"
                    value={editingProduct.img || editingProduct.image}
                    onChange={(e) => setEditingProduct({...editingProduct, img: e.target.value})}
                    disabled={!updateFields.img}
                  />
                </label>
              </div>
              <div className="edit-actions">
                <button onClick={() => updateProduct(producto.id)}>Guardar Cambios</button>
                <button onClick={cancelEditing}>Cancelar</button>
              </div>
            </div>
          </div>
        ) : (
          <>
            <button onClick={() => startEditing(producto)}>
              Editar
            </button>
            <button onClick={() => deleteProduct(producto.id)}>
              Eliminar
            </button>
          </>
        )}
      </div>
    </div>
  );
});

function Productos() {
  const [productos, setProductos] = useState([]);
  const [localProducts, setLocalProducts] = useState(localProductsData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newProduct, setNewProduct] = useState({
    title: '',
    price: '',
    description: '',
    img: ''
  });
  const [editingProduct, setEditingProduct] = useState(null);
  const [updateFields, setUpdateFields] = useState({
    title: false,
    price: false,
    description: false,
    img: false
  });

  // Fetch inicial de productos
  useEffect(() => {
    fetchData();
  }, []);

  // Obtener productos
  const fetchData = async () => {
    try {
      const response = await axios.get("https://fakestoreapi.com/products");
      const combinedProducts = [...response.data, ...localProducts];
      setProductos(combinedProducts);
      setLoading(false);
    } catch (error) {
      setError("Error al cargar los productos");
      setLoading(false);
      console.error("Error al obtener productos:", error);
    }
  };

  // Crear producto
  const createProduct = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("https://fakestoreapi.com/products", newProduct);
      setProductos([...productos, response.data]);
      setNewProduct({ title: '', price: '', description: '', img: '' });
    } catch (error) {
      console.error("Error al crear producto:", error);
    }
  };

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

  // Memoiza la lista de productos
  const memoizedProducts = useMemo(() => productos.map(producto => (
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
    />
  )), [productos, startEditing, deleteProduct, editingProduct, updateFields, updateProduct, cancelEditing]);

  if (loading) return <div>Cargando productos...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <h2>Lista de Productos</h2>
      
      

      {/* Lista de productos */}
      <div className="products-grid">
        {memoizedProducts}
      </div>
    </div>
  );
}

export default Productos;