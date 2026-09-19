import React from "react";
import { Routes, Route, Navigate, Link } from "react-router-dom";
import { useAuth } from "./context/AuthContext.jsx";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import Catalog from "./pages/Catalog.jsx";

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <p className="loading-text">Loading...</p>;
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

export default function App() {
  const { user, logout, loading } = useAuth();

  return (
    <div>
      <header className="app-header">
        <div>
          <h1>Codveda Product Catalog</h1>
          <p>Level 2 — React + JWT authentication ({user?.role === "admin" ? "Admin" : "Viewer"} view)</p>
        </div>
        <nav>
          {!loading && user ? (
            <>
              <span className="user-badge">
                {user.name} ({user.role})
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
        </Routes>
      </main>
    </div>
  );
}
