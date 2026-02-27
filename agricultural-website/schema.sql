-- Create database
CREATE DATABASE IF NOT EXISTS agricultural_marketplace;
USE agricultural_marketplace;

-- =====================================================
-- 1. ROLES TABLE
-- =====================================================
CREATE TABLE roles (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert default roles
INSERT INTO roles (name) VALUES ('admin'), ('user');

-- =====================================================
-- 2. USERS TABLE
-- =====================================================
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone VARCHAR(20),
    password VARCHAR(255),
    google_id VARCHAR(100) UNIQUE,
    role_id INT NOT NULL DEFAULT 2,
    delivery_address TEXT,
    avatar VARCHAR(500),
    email_verified BOOLEAN DEFAULT FALSE,
    email_verification_token VARCHAR(255),
    reset_password_token VARCHAR(255),
    reset_password_expires DATETIME,
    is_active BOOLEAN DEFAULT TRUE,
    last_login DATETIME,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE RESTRICT,
    
    INDEX idx_email (email),
    INDEX idx_google_id (google_id),
    INDEX idx_role (role_id),
    INDEX idx_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- 3. CATEGORIES TABLE
-- =====================================================
CREATE TABLE categories (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    image_url VARCHAR(500),
    slug VARCHAR(100) UNIQUE,
    parent_id INT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    sort_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (parent_id) REFERENCES categories(id) ON DELETE SET NULL,
    
    INDEX idx_parent (parent_id),
    INDEX idx_active (is_active),
    INDEX idx_slug (slug)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert default categories
INSERT INTO categories (name, slug, description, sort_order) VALUES 
('Cereals', 'cereals', 'Fresh cereals including maize, rice, wheat, and more', 1),
('Grains', 'grains', 'Nutritious grains like millet, sorghum, and oats', 2),
('Flour', 'flour', 'Various types of flour including corn flour, wheat flour', 3),
('Legumes', 'legumes', 'Protein-rich legumes like beans, groundnuts, and peas', 4),
('Tubers', 'tubers', 'Fresh tubers including yam, cassava, and sweet potatoes', 5),
('Vegetables', 'vegetables', 'Fresh organic vegetables', 6);

-- =====================================================
-- 4. PRODUCTS TABLE
-- =====================================================
CREATE TABLE products (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    old_price DECIMAL(10, 2),
    stock_quantity INT NOT NULL DEFAULT 0,
    category_id INT,
    seller_id INT,
    image_url VARCHAR(500),
    additional_images JSON,
    sku VARCHAR(50) UNIQUE,
    slug VARCHAR(200) UNIQUE,
    unit VARCHAR(50) DEFAULT 'piece',
    minimum_order INT DEFAULT 1,
    tags JSON,
    is_featured BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    views_count INT DEFAULT 0,
    sold_count INT DEFAULT 0,
    rating_avg DECIMAL(3,2) DEFAULT 0.00,
    rating_count INT DEFAULT 0,
    date_added TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL,
    FOREIGN KEY (seller_id) REFERENCES users(id) ON DELETE SET NULL,
    
    INDEX idx_category (category_id),
    INDEX idx_seller (seller_id),
    INDEX idx_price (price),
    INDEX idx_featured (is_featured),
    INDEX idx_active (is_active),
    INDEX idx_slug (slug),
    INDEX idx_sku (sku),
    FULLTEXT idx_search (name, description),
    
    CONSTRAINT chk_price_positive CHECK (price >= 0),
    CONSTRAINT chk_stock_non_negative CHECK (stock_quantity >= 0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- 5. CART TABLE
-- =====================================================
CREATE TABLE cart (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    
    UNIQUE KEY unique_user_product (user_id, product_id),
    INDEX idx_user (user_id),
    INDEX idx_product (product_id),
    
    CONSTRAINT chk_quantity_positive CHECK (quantity > 0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- 6. ORDERS TABLE
-- =====================================================
CREATE TABLE orders (
    id INT PRIMARY KEY AUTO_INCREMENT,
    order_number VARCHAR(50) UNIQUE NOT NULL,
    user_id INT NOT NULL,
    total_amount DECIMAL(10, 2) NOT NULL,
    subtotal DECIMAL(10, 2) NOT NULL,
    tax_amount DECIMAL(10, 2) DEFAULT 0.00,
    shipping_amount DECIMAL(10, 2) DEFAULT 0.00,
    discount_amount DECIMAL(10, 2) DEFAULT 0.00,
    delivery_address TEXT NOT NULL,
    phone_number VARCHAR(20) NOT NULL,
    email VARCHAR(100),
    notes TEXT,
    payment_method ENUM('mobile_money', 'cash_on_delivery', 'card') NOT NULL,
    payment_status ENUM('pending', 'processing', 'completed', 'failed', 'refunded') DEFAULT 'pending',
    order_status ENUM('pending', 'processing', 'shipped', 'delivered', 'cancelled') DEFAULT 'pending',
    transaction_id VARCHAR(100),
    estimated_delivery_date DATE,
    delivered_at DATETIME,
    cancelled_at DATETIME,
    cancellation_reason TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE RESTRICT,
    
    INDEX idx_order_number (order_number),
    INDEX idx_user (user_id),
    INDEX idx_status (order_status),
    INDEX idx_payment_status (payment_status),
    INDEX idx_created (created_at),
    
    CONSTRAINT chk_total_positive CHECK (total_amount >= 0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- 7. ORDER ITEMS TABLE
-- =====================================================
CREATE TABLE order_items (
    id INT PRIMARY KEY AUTO_INCREMENT,
    order_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL,
    price_at_time DECIMAL(10, 2) NOT NULL,
    product_name VARCHAR(200) NOT NULL,
    product_image VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE RESTRICT,
    
    INDEX idx_order (order_id),
    INDEX idx_product (product_id),
    
    CONSTRAINT chk_item_quantity_positive CHECK (quantity > 0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- 8. PAYMENTS TABLE
-- =====================================================
CREATE TABLE payments (
    id INT PRIMARY KEY AUTO_INCREMENT,
    order_id INT NOT NULL,
    transaction_id VARCHAR(100) UNIQUE,
    amount DECIMAL(10, 2) NOT NULL,
    payment_method ENUM('mobile_money', 'cash_on_delivery', 'card') NOT NULL,
    mobile_money_provider ENUM('mtn', 'vodafone', 'airteltigo'),
    mobile_money_number VARCHAR(20),
    status ENUM('pending', 'processing', 'completed', 'failed', 'refunded') DEFAULT 'pending',
    payment_date DATETIME,
    response_code VARCHAR(50),
    response_message TEXT,
    metadata JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    
    INDEX idx_order (order_id),
    INDEX idx_transaction (transaction_id),
    INDEX idx_status (status),
    
    CONSTRAINT chk_payment_amount_positive CHECK (amount > 0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- 9. REVIEWS TABLE
-- =====================================================
CREATE TABLE reviews (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    product_id INT NOT NULL,
    rating INT NOT NULL,
    title VARCHAR(200),
    comment TEXT,
    images JSON,
    verified_purchase BOOLEAN DEFAULT FALSE,
    helpful_count INT DEFAULT 0,
    status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    
    UNIQUE KEY unique_user_product_review (user_id, product_id),
    INDEX idx_product (product_id),
    INDEX idx_user (user_id),
    INDEX idx_rating (rating),
    INDEX idx_status (status),
    
    CONSTRAINT chk_rating_range CHECK (rating BETWEEN 1 AND 5)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- 10. WISHLIST TABLE
-- =====================================================
CREATE TABLE wishlist (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    product_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    
    UNIQUE KEY unique_user_product_wishlist (user_id, product_id),
    INDEX idx_user (user_id),
    INDEX idx_product (product_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- 11. COMPANY SETTINGS TABLE
-- =====================================================
CREATE TABLE company_settings (
    id INT PRIMARY KEY AUTO_INCREMENT,
    company_name VARCHAR(200) NOT NULL DEFAULT 'AgriMarket',
    company_logo VARCHAR(500),
    company_email VARCHAR(100),
    company_phone VARCHAR(20),
    company_address TEXT,
    social_media JSON,
    seo_settings JSON,
    payment_settings JSON,
    shipping_settings JSON,
    email_settings JSON,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    updated_by INT,
    
    FOREIGN KEY (updated_by) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert default company settings
INSERT INTO company_settings (
    company_name, 
    company_email, 
    company_phone, 
    company_address,
    social_media,
    seo_settings
) VALUES (
    'AgriMarket',
    'info@agrimarket.com',
    '+233 XX XXX XXXX',
    '123 Farm Road, Accra, Ghana',
    '{
        "facebook": "https://facebook.com/agrimarket",
        "twitter": "https://twitter.com/agrimarket",
        "instagram": "https://instagram.com/agrimarket",
        "linkedin": null
    }',
    '{
        "title": "AgriMarket - Fresh Agricultural Products Online",
        "description": "Buy fresh agricultural products directly from farmers. Best prices, quality guaranteed.",
        "keywords": "agriculture, farming, fresh produce, grains, cereals, flour, Ghana",
        "ogImage": null
    }'
);

-- =====================================================
-- 12. ACTIVITY LOGS TABLE
-- =====================================================
CREATE TABLE activity_logs (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(50),
    entity_id INT,
    details JSON,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    
    INDEX idx_user (user_id),
    INDEX idx_action (action),
    INDEX idx_entity (entity_type, entity_id),
    INDEX idx_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- 13. NOTIFICATIONS TABLE
-- =====================================================
CREATE TABLE notifications (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    type ENUM('order', 'payment', 'product', 'system') NOT NULL,
    title VARCHAR(200) NOT NULL,
    message TEXT,
    data JSON,
    is_read BOOLEAN DEFAULT FALSE,
    read_at DATETIME,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    
    INDEX idx_user (user_id),
    INDEX idx_read (is_read),
    INDEX idx_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- 14. COUPONS TABLE
-- =====================================================
CREATE TABLE coupons (
    id INT PRIMARY KEY AUTO_INCREMENT,
    code VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    discount_type ENUM('percentage', 'fixed') NOT NULL,
    discount_value DECIMAL(10, 2) NOT NULL,
    minimum_order DECIMAL(10, 2),
    maximum_discount DECIMAL(10, 2),
    usage_limit INT,
    used_count INT DEFAULT 0,
    per_user_limit INT DEFAULT 1,
    applicable_categories JSON,
    start_date DATETIME,
    end_date DATETIME,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_code (code),
    INDEX idx_active (is_active),
    INDEX idx_dates (start_date, end_date),
    
    CONSTRAINT chk_discount_positive CHECK (discount_value > 0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- 15. USER_COUPONS TABLE (for tracking usage)
-- =====================================================
CREATE TABLE user_coupons (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    coupon_id INT NOT NULL,
    order_id INT,
    used_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (coupon_id) REFERENCES coupons(id) ON DELETE CASCADE,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE SET NULL,
    
    UNIQUE KEY unique_user_coupon_order (user_id, coupon_id, order_id),
    INDEX idx_user (user_id),
    INDEX idx_coupon (coupon_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- CREATE TRIGGERS
-- =====================================================

-- Trigger to update product rating when new review is added
DELIMITER //
CREATE TRIGGER update_product_rating_after_review
AFTER INSERT ON reviews
FOR EACH ROW
BEGIN
    DECLARE avg_rating DECIMAL(3,2);
    DECLARE review_count INT;
    
    SELECT AVG(rating), COUNT(*) INTO avg_rating, review_count
    FROM reviews
    WHERE product_id = NEW.product_id AND status = 'approved';
    
    UPDATE products 
    SET rating_avg = avg_rating, rating_count = review_count
    WHERE id = NEW.product_id;
END//

CREATE TRIGGER update_product_rating_after_review_update
AFTER UPDATE ON reviews
FOR EACH ROW
BEGIN
    IF NEW.status != OLD.status OR NEW.rating != OLD.rating THEN
        DECLARE avg_rating DECIMAL(3,2);
        DECLARE review_count INT;
        
        SELECT AVG(rating), COUNT(*) INTO avg_rating, review_count
        FROM reviews
        WHERE product_id = NEW.product_id AND status = 'approved';
        
        UPDATE products 
        SET rating_avg = avg_rating, rating_count = review_count
        WHERE id = NEW.product_id;
    END IF;
END//

-- Trigger to generate order number
CREATE TRIGGER generate_order_number
BEFORE INSERT ON orders
FOR EACH ROW
BEGIN
    DECLARE year_prefix CHAR(4);
    DECLARE month_prefix CHAR(2);
    DECLARE sequence INT;
    
    SET year_prefix = YEAR(CURDATE());
    SET month_prefix = LPAD(MONTH(CURDATE()), 2, '0');
    
    SELECT COUNT(*) + 1 INTO sequence
    FROM orders
    WHERE YEAR(created_at) = YEAR(CURDATE()) 
    AND MONTH(created_at) = MONTH(CURDATE());
    
    SET NEW.order_number = CONCAT('ORD-', year_prefix, month_prefix, '-', LPAD(sequence, 6, '0'));
END//

-- Trigger to update product sold count
CREATE TRIGGER update_product_sold_count
AFTER INSERT ON order_items
FOR EACH ROW
BEGIN
    UPDATE products 
    SET sold_count = sold_count + NEW.quantity
    WHERE id = NEW.product_id;
END//

DELIMITER ;

-- =====================================================
-- CREATE STORED PROCEDURES
-- =====================================================

-- Get dashboard statistics
DELIMITER //
CREATE PROCEDURE GetDashboardStats(
    IN p_start_date DATE,
    IN p_end_date DATE
)
BEGIN
    -- Total orders
    SELECT COUNT(*) as total_orders,
           SUM(total_amount) as total_revenue
    FROM orders
    WHERE created_at BETWEEN p_start_date AND p_end_date;
    
    -- Orders by status
    SELECT order_status, COUNT(*) as count
    FROM orders
    WHERE created_at BETWEEN p_start_date AND p_end_date
    GROUP BY order_status;
    
    -- Top selling products
    SELECT p.id, p.name, SUM(oi.quantity) as total_sold
    FROM products p
    JOIN order_items oi ON p.id = oi.product_id
    JOIN orders o ON oi.order_id = o.id
    WHERE o.created_at BETWEEN p_start_date AND p_end_date
    GROUP BY p.id, p.name
    ORDER BY total_sold DESC
    LIMIT 10;
    
    -- Revenue by day
    SELECT DATE(created_at) as date,
           COUNT(*) as orders,
           SUM(total_amount) as revenue
    FROM orders
    WHERE created_at BETWEEN p_start_date AND p_end_date
    GROUP BY DATE(created_at)
    ORDER BY date;
END//

-- Search products with filters
CREATE PROCEDURE SearchProducts(
    IN p_search_term VARCHAR(255),
    IN p_category_id INT,
    IN p_min_price DECIMAL(10,2),
    IN p_max_price DECIMAL(10,2),
    IN p_sort_by VARCHAR(50),
    IN p_sort_order VARCHAR(4),
    IN p_page INT,
    IN p_limit INT
)
BEGIN
    DECLARE v_offset INT;
    SET v_offset = (p_page - 1) * p_limit;
    
    SELECT SQL_CALC_FOUND_ROWS *
    FROM products
    WHERE is_active = TRUE
    AND (p_search_term IS NULL OR 
         MATCH(name, description) AGAINST(p_search_term IN BOOLEAN MODE))
    AND (p_category_id IS NULL OR category_id = p_category_id)
    AND (p_min_price IS NULL OR price >= p_min_price)
    AND (p_max_price IS NULL OR price <= p_max_price)
    ORDER BY 
        CASE WHEN p_sort_by = 'price' AND p_sort_order = 'ASC' THEN price END ASC,
        CASE WHEN p_sort_by = 'price' AND p_sort_order = 'DESC' THEN price END DESC,
        CASE WHEN p_sort_by = 'name' AND p_sort_order = 'ASC' THEN name END ASC,
        CASE WHEN p_sort_by = 'name' AND p_sort_order = 'DESC' THEN name END DESC,
        CASE WHEN p_sort_by = 'date' OR p_sort_by IS NULL THEN created_at END DESC
    LIMIT v_offset, p_limit;
    
    SELECT FOUND_ROWS() as total_count;
END//

DELIMITER ;

-- =====================================================
-- CREATE INDEXES FOR PERFORMANCE
-- =====================================================

-- Additional indexes for better query performance
CREATE INDEX idx_products_price_category ON products(category_id, price);
CREATE INDEX idx_products_featured_active ON products(is_featured, is_active);
CREATE INDEX idx_orders_user_status ON orders(user_id, order_status);
CREATE INDEX idx_orders_date_status ON orders(created_at, order_status);
CREATE INDEX idx_order_items_product ON order_items(product_id, order_id);
CREATE INDEX idx_reviews_product_status ON reviews(product_id, status);
CREATE INDEX idx_payments_order_status ON payments(order_id, status);

-- =====================================================
-- INSERT SAMPLE DATA
-- =====================================================

-- Insert admin user (password: Admin@123 - hashed with bcrypt)
INSERT INTO users (name, email, password, phone, role_id, email_verified, is_active) VALUES 
('Admin User', 'admin@agrimarket.com', '$2a$10$YourHashedPasswordHere', '+233 XX XXX XXXX', 1, TRUE, TRUE);

-- Insert sample products
INSERT INTO products (name, description, price, stock_quantity, category_id, sku, slug, unit, is_featured, image_url) VALUES
('Organic Corn Dough', 'Freshly milled organic corn dough, perfect for banku and kenkey. Made from locally sourced maize.', 15.00, 100, 3, 'SKU-CRN-001', 'organic-corn-dough', 'kg', TRUE, 'https://images.unsplash.com/photo-1590779033100-94f60f7a7e97'),
('Premium White Maize', 'High-quality white maize, perfect for grinding or cooking. Non-GMO and locally grown.', 25.00, 200, 1, 'SKU-MZE-001', 'premium-white-maize', 'kg', TRUE, 'https://images.unsplash.com/photo-1551754655-cd27e38d2076'),
('Brown Beans', 'Nutritious brown beans, rich in protein and fiber. Perfect for stews and soups.', 20.00, 150, 4, 'SKU-BEN-001', 'brown-beans', 'kg', FALSE, 'https://images.unsplash.com/photo-1515543904379-3d757f8fe823'),
('Cassava Flour', 'Gluten-free cassava flour, perfect for baking and cooking. Made from fresh cassava.', 18.00, 80, 3, 'SKU-CSF-001', 'cassava-flour', 'kg', FALSE, 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5'),
('Groundnuts', 'Roasted groundnuts, perfect for snacks or making groundnut paste. High in protein.', 12.00, 300, 4, 'SKU-GNT-001', 'groundnuts', 'kg', TRUE, 'https://images.unsplash.com/photo-1547487430-d1e4b4a7f3c9'),
('Millet Grains', 'Traditional millet grains, rich in nutrients. Perfect for porridge and local dishes.', 22.00, 120, 2, 'SKU-MLT-001', 'millet-grains', 'kg', FALSE, 'https://images.unsplash.com/photo-1614961233913-a5113a4a3ed8');

-- =====================================================
-- CREATE VIEWS
-- =====================================================

-- Product details view
CREATE VIEW vw_product_details AS
SELECT 
    p.*,
    c.name as category_name,
    c.slug as category_slug,
    (SELECT COUNT(*) FROM reviews r WHERE r.product_id = p.id AND r.status = 'approved') as review_count,
    (SELECT AVG(rating) FROM reviews r WHERE r.product_id = p.id AND r.status = 'approved') as average_rating
FROM products p
LEFT JOIN categories c ON p.category_id = c.id;

-- Order summary view
CREATE VIEW vw_order_summary AS
SELECT 
    o.*,
    u.name as customer_name,
    u.email as customer_email,
    u.phone as customer_phone,
    COUNT(oi.id) as total_items
FROM orders o
LEFT JOIN users u ON o.user_id = u.id
LEFT JOIN order_items oi ON o.id = oi.order_id
GROUP BY o.id;

