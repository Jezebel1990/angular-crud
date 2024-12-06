const express = require('express');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const port = process.env.PORT || 3000;

const db = new sqlite3.Database('./products.db', (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log('Conectado ao banco de dados de produtos.');
});

app.use(express.json());

// GET all products
app.get('/products', (req, res) => {
  db.all('SELECT * FROM products', (err, rows) => {
    if (err) {
      console.error(err.message);
      res.status(500).send('Erro Interno do Servidor');
    } else {
      res.send(rows);
    }
  });
});

// GET single product by ID
app.get('/products/:id', (req, res) => {
  const { id } = req.params;
  db.get('SELECT * FROM products WHERE id = ?', [id], (err, row) => {
    if (err) {
      console.error(err.message);
      res.status(500).send('Erro Interno do Servidor');
    } else if (!row) {
      res.status(404).send('Produto não encontrado');
    } else {
      res.send(row);
    }
  });
});

// POST new product
app.post('/products', (req, res) => {
  const { name, price } = req.body;
  if (!name || !price) {
    res.status(400).send('Nome e preço são obrigatórios');
  } else {
    const sql = 'INSERT INTO products(name, price) VALUES (?, ?)';
    db.run(sql, [name, price], function(err) {
      if (err) {
        console.error(err.message);
        res.status(500).send('Erro Interno do Servidor');
      } else {
        const id = this.lastID;
        res.status(201).send({ id, name, price });
      }
    });
  }
});

// PUT update product by ID
app.put('/products/:id', (req, res) => {
  const { id } = req.params;
  const { name, price } = req.body;
  if (!name || !price) {
    res.status(400).send('Name and price are required');
  } else {
    const sql = 'UPDATE products SET name = ?, price = ? WHERE id = ?';
    db.run(sql, [name, price, id], function(err) {
      if (err) {
        console.error(err.message);
        res.status(500).send('Erro Interno do Servidor');
      } else if (this.changes === 0) {
        res.status(404).send('Produto não encontrado');
      } else {
        res.status(200).send({ id, name, price });
      }
    });
  }
});

// DELETE product by ID
app.delete('/products/:id', (req, res) => {
  const { id } = req.params;
  db.run('DELETE FROM products WHERE id = ?', [id], function(err) {
    if (err) {
      console.error(err.message);
      res.status(500).send('Erro Interno do Servidor');
    } else if (this.changes === 0) {
      res.status(404).send('Produto não encontrado');
    } else {
      res.status(204).send();
    }
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Servidor escutando na porta ${port}.`);
});