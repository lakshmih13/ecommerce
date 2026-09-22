import React, { useEffect, useState } from "react";
import { api } from "../api";
import { socket } from "../socket";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  async function loadOrders() {
    try {
      const data = await api.getOrders();
      setOrders(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadOrders();
  }, []);

  // New orders placed by anyone arrive live — prepend without a full reload.
  useEffect(() => {
    function onOrderCreated() {
      loadOrders();
    }
    socket.on("order:created", onOrderCreated);
    return () => socket.off("order:created", onOrderCreated);
  }, []);

  return (
    <div className="orders-page">
      <h2>Orders</h2>
      {error && <p className="error-text">{error}</p>}
      {loading ? (
        <p>Loading...</p>
      ) : orders.length === 0 ? (
        <p className="hint-text">No orders placed yet.</p>
      ) : (
        <div className="orders-list">
          {orders.map((order) => (
            <div className="order-row" key={order.id}>
              <div className="order-row-header">
                <span className="order-id">Order #{order.id}</span>
                <span className="order-total">${Number(order.total).toFixed(2)}</span>
              </div>
              <div className="order-meta">
                {order.customer_name} · {new Date(order.created_at).toLocaleString()}
              </div>
              <ul className="order-items">
                {order.items.map((item, idx) => (
                  <li key={idx}>
                    {item.quantity} × {item.name}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
