import React, { useEffect, useRef, useState } from "react";
import { api } from "../api";
import { socket } from "../socket";
import { useAuth } from "../context/AuthContext.jsx";
import ProductCard from "../components/ProductCard.jsx";
import ProductForm from "../components/ProductForm.jsx";
import NotificationList from "../components/NotificationList.jsx";

export default function Catalog() {
  const { isAdmin, user } = useAuth();
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState([]);
  const [connected, setConnected] = useState(socket.connected);
  const notificationId = useRef(0);

  function pushNotification(message, type = "info") {
    const id = ++notificationId.current;
    setNotifications((prev) => [...prev, { id, message, type }]);
    // auto-dismiss after 4 seconds so the list doesn't grow forever
    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, 4000);
  }

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

  // Real-time updates: any admin's change (from any browser/tab) is
  // pushed here over the WebSocket and merged into local state,
  // so everyone sees the catalog change live without refreshing.
  useEffect(() => {
    function onConnect() {
      setConnected(true);
    }
    function onDisconnect() {
      setConnected(false);
    }
    function onCreated(product) {
      setProducts((prev) => [product, ...prev]);
      pushNotification(`New product added: ${product.name}`, "success");
    }
    function onUpdated(product) {
      setProducts((prev) => prev.map((p) => (p.id === product.id ? product : p)));
      pushNotification(`${product.name} was updated`, "info");
    }
    function onDeleted(product) {
      setProducts((prev) => prev.filter((p) => p.id !== product.id));
      pushNotification(`${product.name} was removed`, "warning");
    }
    function onLowStock(product) {
      pushNotification(`Low stock: ${product.name} (${product.stock} left)`, "warning");
    }
    function onOrderCreated(order) {
      if (isAdmin) {
        pushNotification(
          `New order from ${order.customerName}: $${Number(order.total).toFixed(2)}`,
          "success"
        );
      }
    }

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("product:created", onCreated);
    socket.on("product:updated", onUpdated);
    socket.on("product:deleted", onDeleted);
    socket.on("product:low-stock", onLowStock);
    socket.on("order:created", onOrderCreated);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("product:created", onCreated);
      socket.off("product:updated", onUpdated);
      socket.off("product:deleted", onDeleted);
      socket.off("product:low-stock", onLowStock);
      socket.off("order:created", onOrderCreated);
    };
  }, [isAdmin]);

  async function handleSubmit(payload) {
    try {
      if (editingProduct) {
        await api.updateProduct(editingProduct.id, payload);
      } else {
        await api.createProduct(payload);
      }
      // No need to manually reload — the socket event will update the list.
      setEditingProduct(null);
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleDelete(id) {
    if (!confirm("Delete this product?")) return;
    try {
      await api.deleteProduct(id);
      // The socket event removes it from state for us.
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="catalog-page">
      <NotificationList notifications={notifications} />

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
        <div className="catalog-heading">
          <h2>Products</h2>
          <span className={`live-badge ${connected ? "live" : "offline"}`}>
            {connected ? "\u25CF Live" : "\u25CB Reconnecting..."}
          </span>
        </div>
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
                canOrder={!!user}
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
