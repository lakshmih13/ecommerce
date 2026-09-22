import React, { useState } from "react";
import { useCart } from "../context/CartContext.jsx";

export default function CartDrawer({ open, onClose }) {
  const { items, removeItem, updateQuantity, total, checkout } = useCart();
  const [placing, setPlacing] = useState(false);
  const [confirmation, setConfirmation] = useState(null);
  const [error, setError] = useState("");

  async function handleCheckout() {
    setError("");
    setPlacing(true);
    try {
      const order = await checkout();
      setConfirmation(order);
    } catch (err) {
      setError(err.message);
    } finally {
      setPlacing(false);
    }
  }

  function handleClose() {
    setConfirmation(null);
    setError("");
    onClose();
  }

  if (!open) return null;

  return (
    <div className="cart-overlay" onClick={handleClose}>
      <div className="cart-drawer" onClick={(e) => e.stopPropagation()}>
        <div className="cart-drawer-header">
          <h2>Your Cart</h2>
          <button className="cart-close-btn" onClick={handleClose}>
            Close
          </button>
        </div>

        {confirmation ? (
          <div className="order-confirmation">
            <p className="receipt-mark">Order Placed</p>
            <p>
              Order #{confirmation.id} — ${Number(confirmation.total).toFixed(2)}
            </p>
            <p className="hint-text">Thanks for your order.</p>
            <button onClick={handleClose}>Continue Browsing</button>
          </div>
        ) : items.length === 0 ? (
          <p className="hint-text">Your cart is empty.</p>
        ) : (
          <>
            <div className="cart-items">
              {items.map((item) => (
                <div className="cart-item" key={item.id}>
                  <div className="cart-item-info">
                    <span className="cart-item-name">{item.name}</span>
                    <span className="cart-item-price">${Number(item.price).toFixed(2)}</span>
                  </div>
                  <div className="cart-item-controls">
                    <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>-</button>
                    <span>{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
                    <button className="cart-remove-btn" onClick={() => removeItem(item.id)}>
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <div className="cart-total">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
            {error && <p className="error-text">{error}</p>}
            <button className="checkout-btn" onClick={handleCheckout} disabled={placing}>
              {placing ? "Placing order..." : "Place Order"}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
