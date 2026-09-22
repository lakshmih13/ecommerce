-- Run this once against your codveda_ecommerce database
-- e.g. psql -U postgres -d codveda_ecommerce -f db/schema.sql

CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin')),
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    description TEXT,
    price NUMERIC(10, 2) NOT NULL CHECK (price >= 0),
    category VARCHAR(80),
    stock INTEGER NOT NULL DEFAULT 0 CHECK (stock >= 0),
    image_url TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- A few sample rows so the frontend has something to fetch immediately
INSERT INTO products (name, description, price, category, stock, image_url)
VALUES
    ('Wireless Mouse', 'Ergonomic 2.4GHz wireless mouse', 19.99, 'Electronics', 120, ''),
    ('Mechanical Keyboard', 'RGB backlit mechanical keyboard', 59.99, 'Electronics', 45, ''),
    ('Ceramic Mug', '350ml matte ceramic coffee mug', 9.50, 'Home', 200, ''),
    ('Running Shoes', 'Lightweight breathable running shoes', 74.99, 'Apparel', 30, '')
ON CONFLICT DO NOTHING;

CREATE TABLE IF NOT EXISTS orders (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id),
    items JSONB NOT NULL,
    total NUMERIC(10, 2) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'placed',
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);
