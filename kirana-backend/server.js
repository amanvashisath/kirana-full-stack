// ── IMPORTS ──────────────────────────────────────────────────
const express = require('express');
const cors    = require('cors');
const dotenv  = require('dotenv');
const mysql   = require('mysql2/promise');

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());


// ── DATABASE CONNECTION ───────────────────────────────────────
// mysql.createPool creates a "pool" of connections to MySQL
// A pool is better than a single connection because:
// it handles multiple requests at the same time
const pool = mysql.createPool({
  host:     process.env.DB_HOST,      // localhost
  user:     process.env.DB_USER,      // root
  password: process.env.DB_PASSWORD,  // your password
  database: process.env.DB_NAME,      // kirana_db
});

// Test the connection when server starts
pool.getConnection()
  .then(() => console.log('MySQL connected!'))
  .catch(err => console.log('MySQL error:', err.message));


// ── ROUTES ───────────────────────────────────────────────────

// Test route
app.get('/', (req, res) => {
  res.json({ message: 'Kirana backend is running!' });
});


// GET all products — now from REAL database!
// async/await is how we handle database calls
// await means "wait for this to finish before continuing"
app.get('/products', async (req, res) => {
  try {
    // pool.execute runs a SQL query
    // It returns [rows, fields] — we only need rows
    const [rows] = await pool.execute('SELECT * FROM products');

    // rows is now an array of all products from MySQL
    res.json(rows);

  } catch (err) {
    // If anything goes wrong, send an error message
    console.log('Error:', err.message);
    res.status(500).json({ error: 'Something went wrong' });
  }
});


// GET single product by id
app.get('/products/:id', async (req, res) => {
  try {
    const id = req.params.id;

    // The ? is a placeholder — mysql2 fills it in safely
    // This prevents SQL injection attacks
    const [rows] = await pool.execute(
      'SELECT * FROM products WHERE id = ?',
      [id]  // this array fills in the ? above
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json(rows[0]); // send just the one product
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// POST — add a new product to database
app.post('/products', async (req, res) => {
  try {
    const { name, category, price, cost_price, stock, min_stock, unit, barcode } = req.body;

    const [result] = await pool.execute(
      'INSERT INTO products (name, category, price, cost_price, stock, min_stock, unit, barcode) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [name, category, price, cost_price, stock, min_stock, unit, barcode]
    );

    // result.insertId gives us the id of the newly created product
    res.json({ success: true, id: result.insertId });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// PUT — update a product
app.put('/products/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const { name, category, price, cost_price, stock, min_stock, unit, barcode } = req.body;

    await pool.execute(
      'UPDATE products SET name=?, category=?, price=?, cost_price=?, stock=?, min_stock=?, unit=?, barcode=? WHERE id=?',
      [name, category, price, cost_price, stock, min_stock, unit, barcode, id]
    );

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// DELETE — remove a product
app.delete('/products/:id', async (req, res) => {
  try {
    const id = req.params.id;
    await pool.execute('DELETE FROM products WHERE id = ?', [id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// ── START SERVER ─────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running → http://localhost:${PORT}`);
});