# Supabase Setup Instructions

To make the application work with Supabase, follow these steps:

## 1. Create a Supabase Project
1. Go to [Supabase](https://supabase.com/) and sign in.
2. Create a new project.
3. Wait for the database to start.

## 2. Run Database Migration (SQL)
Go to the **SQL Editor** in your Supabase dashboard and run the following SQL query to create the necessary tables and insert sample data:

```sql
-- Create Menu Items Table
CREATE TABLE public.menu_items (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    price NUMERIC NOT NULL,
    prep_time INTEGER NOT NULL, -- in minutes
    complexity TEXT CHECK (complexity IN ('low', 'med', 'high')),
    category TEXT NOT NULL,
    description TEXT,
    image_url TEXT,
    is_available BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create Orders Table
CREATE TABLE public.orders (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    student_id TEXT NOT NULL,
    vendor_id TEXT NOT NULL,
    break_slot TEXT,
    status TEXT CHECK (status IN ('ordered', 'preparing', 'ready', 'completed', 'cancelled')) DEFAULT 'ordered',
    order_time TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    predicted_pickup TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create Order Items Table
CREATE TABLE public.order_items (
    id SERIAL PRIMARY KEY,
    order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
    menu_item_id INTEGER REFERENCES public.menu_items(id),
    quantity INTEGER NOT NULL,
    price_at_time NUMERIC NOT NULL
);

-- Turn on Realtime for Orders (Important for Vendor Dashboard)
alter publication supabase_realtime add table orders;

-- Insert Sample Menu Items
INSERT INTO public.menu_items (name, price, prep_time, complexity, category, description) VALUES
('Chicken Wrap', 120, 3, 'low', 'Wraps', 'Grilled chicken with fresh veggies.'),
('Veg Burger', 90, 5, 'med', 'Burgers', 'Crispy patty with cheese slice.'),
('Spicy Paneer Wrap', 110, 4, 'med', 'Wraps', 'Cottage cheese in spicy marinade.'),
('Cold Coffee', 60, 2, 'low', 'Drinks', 'Chilled brewed coffee with milk.'),
('Grilled Sandwich', 80, 6, 'high', 'Sandwiches', 'Bombay style vegetable grill.'),
('Cheese Omelette', 50, 4, 'low', 'Special', 'Three egg omelette with cheddar.'),
('Masala Chai', 20, 2, 'low', 'Drinks', 'Hot spiced tea.');
```

## 3. Set Environment Variables
1. Go to **Project Settings** > **API**.
2. Copy the **Project URL** and **anon public** key.
3. Create a file named `.env.local` in the root of your project (`canteen-rush-ai`) and add the following:

```env
NEXT_PUBLIC_SUPABASE_URL=your_project_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
```

Replace the values with your actual credentials.

## 4. Restart the Server
Restart your Next.js development server to load the new environment variables:

```bash
npm run dev
```
