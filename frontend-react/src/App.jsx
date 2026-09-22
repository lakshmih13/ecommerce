import React, { useState } from "react";
import { Routes, Route, Navigate, Link } from "react-router-dom";
import { useAuth } from "./context/AuthContext.jsx";
import { useCart } from "./context/CartContext.jsx";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import Catalog from "./pages/Catalog.jsx";
import Orders from "./pages/Orders.jsx";
import CartDrawer from "./components/CartDrawer.jsx";

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <p className="loading-text">Loading...</p>;
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

function AdminRoute({ children }) {
  const { isAdmin, loading } = useAuth();
  if (loading) return <p className="loading-text">Loading...</p>;
  if (!isAdmin) return <Navigate to="/" replace />;
  return children;
}

export default function App() {
  const { user, logout, loading, isAdmin } = useAuth();
  const { count } = useCart();
  const [cartOpen, setCartOpen] = useState(false);

  return (
    <div>
      <header className="app-header">
        <div className="brand">
          <span className="brand-mark">Codveda</span>
          <span className="brand-sub">General Store &amp; Catalog</span>
        </div>
        <nav>
          {!loading && user ? (
            <>
              {isAdmin && <Link to="/orders">Orders</Link>}
              <Link to="/">Catalog</Link>
              {!isAdmin && (
                <button className="cart-btn" onClick={() => setCartOpen(true)}>
                  Cart{count > 0 ? ` (${count})` : ""}
                </button>
              )}
              <span className="user-badge">
                {user.name} · {user.role}
              </span>
              <button onClick={logout}>Log Out</button>
            </>
          ) : (
            !loading && (
              <>
                <Link to="/login">Log In</Link>
                <Link to="/signup">Sign Up</Link>
              </>
            )
          )}
        </nav>
      </header>
      <div className="header-stripe" aria-hidden="true"></div>

      <main>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Catalog />
              </ProtectedRoute>
            }
          />
          <Route
            path="/orders"
            element={
              <ProtectedRoute>
                <AdminRoute>
                  <Orders />
                </AdminRoute>
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>

      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </div>
  );
}
