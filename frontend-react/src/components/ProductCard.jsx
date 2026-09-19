import React from "react";

export default function ProductCard({ product, isAdmin, onEdit, onDelete }) {
  return (
    <div className="product-card">
      <h3>{product.name}</h3>
      <div className="price">${Number(product.price).toFixed(2)}</div>
      <div className="meta">
        {product.category || "Uncategorized"} · Stock: {product.stock}
      </div>
      <p>{product.description}</p>
      {isAdmin && (
        <div className="card-actions">
          <button onClick={() => onEdit(product)}>Edit</button>
          <button className="delete-btn" onClick={() => onDelete(product.id)}>
            Delete
          </button>
        </div>
      )}
    </div>
  );
}
