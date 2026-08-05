-- Create Bookings table to track table reservations
CREATE TABLE IF NOT EXISTS bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_name TEXT NOT NULL,
    user_email TEXT NOT NULL,
    booking_date DATE NOT NULL,
    booking_time TIME NOT NULL,
    guests_count INTEGER NOT NULL CHECK (guests_count > 0),
    notes TEXT,
    status TEXT DEFAULT 'Pending' CHECK (status IN ('Pending', 'Confirmed', 'Cancelled')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Allow public inserts (so users can book tables anonymously or via registration)
CREATE POLICY "Allow public booking inserts" 
ON bookings FOR INSERT 
WITH CHECK (true);

-- Allow public read access to bookings for the dashboard display (optional/for simplicity in demo)
CREATE POLICY "Allow public read access to bookings" 
ON bookings FOR SELECT 
USING (true);


-- Create Menu Items table to display kitchen offers
CREATE TABLE IF NOT EXISTS menu_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    price NUMERIC(10, 2) NOT NULL CHECK (price >= 0),
    category TEXT CHECK (category IN ('Starter', 'Main', 'Dessert', 'Drink', 'Special')),
    image_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS for menu_items
ALTER TABLE menu_items ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read menu items
CREATE POLICY "Allow public read access to menu items" 
ON menu_items FOR SELECT 
USING (true);

-- Insert some starter items for Reneey's Kitchen
INSERT INTO menu_items (name, description, price, category) VALUES
('Pan-Seared Foie Gras', 'Served with brioche, caramelized apples, and a balsamic reduction.', 28.00, 'Starter'),
('Truffle Butter Tagliatelle', 'Fresh hand-cut pasta tossed in shaved black truffles and organic butter.', 36.00, 'Main'),
('Heritage Ribeye Steak', 'Dry-aged 35 days, served with rosemary roasted fingerling potatoes.', 45.00, 'Main'),
('Deconstructed Lemon Tart', 'Meyer lemon curd, toasted meringue kisses, and shortbread crumble.', 14.00, 'Dessert')
ON CONFLICT DO NOTHING;
