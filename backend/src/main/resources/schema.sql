-- Database: hahn_crud_db
-- Create database if it doesn't exist
CREATE DATABASE hahn_crud_db;

-- Use the database
\c hahn_crud_db;

-- Create products table
CREATE TABLE IF NOT EXISTS products (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 0,
    category VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index on name for faster searches
CREATE INDEX IF NOT EXISTS idx_products_name ON products(name);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);

-- Insert sample data
INSERT INTO products (name, description, price, quantity, category) VALUES
('Laptop Pro 15', 'High-performance laptop with 16GB RAM and 512GB SSD', 1299.99, 25, 'Electronics'),
('Wireless Mouse', 'Ergonomic wireless mouse with precision tracking', 29.99, 150, 'Accessories'),
('USB-C Hub', 'Multi-port USB-C hub with HDMI and USB 3.0 ports', 49.99, 75, 'Accessories'),
('Monitor 27"', '4K UHD monitor with IPS panel and USB-C connectivity', 399.99, 40, 'Electronics'),
('Mechanical Keyboard', 'RGB backlit mechanical keyboard with blue switches', 89.99, 60, 'Accessories');

-- Update trigger for updated_at column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

