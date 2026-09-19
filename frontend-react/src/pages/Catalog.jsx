import React, { useEffect, useState } from "react";
import { api } from "../api";
import { useAuth } from "../context/AuthContext.jsx";
import ProductCard from "../components/ProductCard.jsx";
import ProductForm from "../components/ProductForm.jsx";

export default function Catalog() {
  const { isAdmin } = useAuth();
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  async function loadProducts() {
    setError("");
    try {
      const data = await api.getProducts();
      setProducts(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadProducts();
  }, []);

  async function handleSubmit(payload) {
    try {
      if (editingProduct) {
        await api.updateProduct(editingProduct.id, payload);
      } else {
        await api.createProduct(payload);
      }
      setEditingProduct(null);
      loadProducts();
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleDelete(id) {
    if (!confirm("Delete this product?")) return;
    try {
      await api.deleteProduct(id);
      loadProducts();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="catalog-page">
      {isAdmin && (
        <section className="form-section">
          <ProductForm
            editingProduct={editingProduct}
            onSubmit={handleSubmit}
            onCancel={() => setEditingProduct(null)}
          />
        </section>
      )}

      <section className="catalog-section">
        <h2>Products</h2>
        {error && <p className="error-text">{error}</p>}
        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className="product-grid">
            {products.map((p) => (
              <ProductCard
                key={p.id}
                product={p}
                isAdmin={isAdmin}
                onEdit={setEditingProduct}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
