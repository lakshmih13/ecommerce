import React, { useEffect, useState } from "react";

const emptyForm = { name: "", category: "", price: "", stock: "", description: "" };

export default function ProductForm({ editingProduct, onSubmit, onCancel }) {
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    if (editingProduct) {
      setForm({
        name: editingProduct.name || "",
        category: editingProduct.category || "",
        price: editingProduct.price ?? "",
        stock: editingProduct.stock ?? "",
        description: editingProduct.description || "",
      });
    } else {
      setForm(emptyForm);
    }
  }, [editingProduct]);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleSubmit(e) {
    e.preventDefault();
    onSubmit({
      ...form,
      price: parseFloat(form.price),
      stock: parseInt(form.stock || "0", 10),
    });
  }

  return (
    <form className="product-form" onSubmit={handleSubmit}>
      <h2>{editingProduct ? "Edit Product" : "Add Product"}</h2>
      <input name="name" placeholder="Name" value={form.name} onChange={handleChange} required />
      <input name="category" placeholder="Category" value={form.category} onChange={handleChange} />
      <input
        name="price"
        type="number"
        step="0.01"
        min="0"
        placeholder="Price"
        value={form.price}
        onChange={handleChange}
        required
      />
      <input
        name="stock"
        type="number"
        min="0"
        placeholder="Stock"
        value={form.stock}
        onChange={handleChange}
      />
      <textarea
        name="description"
        placeholder="Description"
        value={form.description}
        onChange={handleChange}
      />
      <div className="form-buttons">
        <button type="submit">{editingProduct ? "Update Product" : "Add Product"}</button>
        {editingProduct && (
          <button type="button" onClick={onCancel}>
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
