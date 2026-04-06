-- Create tables in Supabase for ProInspect.io

-- Users table (simplified for demo)
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE,
  name TEXT,
  company_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Clients table
CREATE TABLE IF NOT EXISTS clients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  address TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Inspections table
CREATE TABLE IF NOT EXISTS inspections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
  property_address TEXT,
  property_city TEXT,
  property_state TEXT,
  property_zip TEXT,
  inspection_type TEXT,
  inspection_date TIMESTAMP WITH TIME ZONE,
  status TEXT DEFAULT 'scheduled',
  total_amount DECIMAL(10,2),
  paid_amount DECIMAL(10,2),
  notes TEXT,
  pdf_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE inspections ENABLE ROW LEVEL SECURITY;

-- Create policies (for demo, allow all operations)
CREATE POLICY "Allow all for users" ON users FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for clients" ON clients FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for inspections" ON inspections FOR ALL USING (true) WITH CHECK (true);

-- Insert a demo user (for testing)
INSERT INTO users (id, email, name) 
VALUES ('demo-user-id', 'demo@example.com', 'Demo User')
ON CONFLICT (id) DO NOTHING;

-- Insert a demo client (for testing)
INSERT INTO clients (id, user_id, name, email) 
VALUES ('demo-client-id', 'demo-user-id', 'Demo Client', 'client@example.com')
ON CONFLICT (id) DO NOTHING;

-- Enable realtime if needed
-- ALTER PUBLICATION supabase_realtime ADD TABLE inspections;