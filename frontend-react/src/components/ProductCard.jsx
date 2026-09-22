import React from "react";
import { useCart } from "../context/CartContext.jsx";

export default function ProductCard({ product, isAdmin, canOrder, onEdit, onDelete }) {
  const { addItem } = useCart();
  const lowStock = product.stock > 0 && product.stock <= 5;
  const outOfStock = product.stock === 0;

  return (
    <div className="product-card">
      <div className="price-tag">${Number(product.price).toFixed(2)}</div>
      <h3>{product.name}</h3>
      <div className="meta">
        <span>{product.category || "Uncategorized"}</span>
        <span className={`stock-badge ${outOfStock ? "out" : lowStock ? "low" : ""}`}>
          {outOfStock ? "Out of stock" : `${product.stock} in stock`}
        </span>
      </div>
      <p>{product.description}</p>

      <div className="card-actions">
        {canOrder && !isAdmin && (
          <button
            className="add-to-cart-btn"
            onClick={() => addItem(product)}
            disabled={outOfStock}
          >
            {outOfStock ? "Unavailable" : "Add to Cart"}
          </button>
        )}
        {isAdmin && (
          <>
            <button onClick={() => onEdit(product)}>Edit</button>
            <button className="delete-btn" onClick={() => onDelete(product.id)}>
              Delete
            </button>
          </>
        )}
      </div>
    </div>
  );
}
