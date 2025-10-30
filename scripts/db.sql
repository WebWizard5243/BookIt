-- Drop tables if they exist
DROP TABLE IF EXISTS bookings;
DROP TABLE IF EXISTS slots;
DROP TABLE IF EXISTS experiences;

-- Create experiences table
CREATE TABLE experiences (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  price INTEGER NOT NULL,
  image_url VARCHAR(500),
  location VARCHAR(255),
  min_age INTEGER
);

-- Create slots table
CREATE TABLE slots (
  id SERIAL PRIMARY KEY,
  experience_id INTEGER REFERENCES experiences(id),
  date VARCHAR(20) NOT NULL,
  time VARCHAR(20) NOT NULL,
  total_capacity INTEGER NOT NULL,
  booked_count INTEGER DEFAULT 0
);

-- Create bookings table
CREATE TABLE bookings (
  id SERIAL PRIMARY KEY,
  reference_id VARCHAR(50) UNIQUE NOT NULL,
  experience_id INTEGER REFERENCES experiences(id),
  slot_id INTEGER REFERENCES slots(id),
  full_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  quantity INTEGER NOT NULL,
  promo_code VARCHAR(50),
  subtotal INTEGER NOT NULL,
  taxes INTEGER NOT NULL,
  total INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
