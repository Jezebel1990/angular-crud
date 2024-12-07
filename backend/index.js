// Usando @sqlitecloud/drivers dentro de um app Express com Javascript

const { Database } = require('@sqlitecloud/drivers'); // Importa o SQLiteCloud
require('dotenv').config(); // Carrega as variáveis de ambiente do arquivo .env

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

const app = express();

// Lê a URL de conexão do banco de dados SQLiteCloud da variável de ambiente
const DATABASE_URL = process.env.DATABASE_URL;
console.assert(DATABASE_URL, 'DATABASE_URL environment variable not set in .env');

const port = process.env.PORT || 3000;

// Cria uma instância do banco de dados usando a URL de conexão do SQLiteCloud
const db = new Database(DATABASE_URL);

// Middleware para processar dados JSON no corpo da requisição
app.use(express.json());
app.use(helmet());

const allowedOrigins = ['http://localhost:4200'];
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Origem não permitida pelo CORS'));
    }
  },
  credentials: true
}));

(async () => {
  try {
    await db.sql`SELECT 1;`;
    console.log('Conexão com o banco de dados estabelecida com sucesso.');
  } catch (err) {
    console.error('Erro ao conectar ao banco de dados:', err.message);
    process.exit(1);
  }
})();


// Rota GET para retornar todos os produtos
app.get('/products', async (req, res) => {
  try {
    const products = await db.sql`
      SELECT * FROM products;
    `;
    res.send(products);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erro ao acessar o banco de dados');
  }
});

// Rota GET para retornar um único produto por ID
app.get('/products/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const product = await db.sql`
      SELECT * FROM products WHERE id = ${id};
    `;
    if (product.length === 0) {
      res.status(404).send('Produto não encontrado');
    } else {
      res.send(product[0]);
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erro ao acessar o banco de dados');
  }
});

// Rota POST para adicionar um novo produto
app.post('/products', async (req, res) => {
  const { name, price } = req.body;
  if (!name || !price) {
    res.status(400).send('Nome e preço são obrigatórios');
  } else {
    try {
      const result = await db.sql`
        INSERT INTO products (name, price) VALUES (${name}, ${price});
      `;
      res.status(201).send({ id: result.lastID, name, price });
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Erro ao adicionar o produto');
    }
  }
});

// Rota PUT para atualizar um produto por ID
app.put('/products/:id', async (req, res) => {
  const { id } = req.params;
  const { name, price } = req.body;
  if (!name || !price) {
    res.status(400).send('Nome e preço são obrigatórios');
  } else {
    try {
      const result = await db.sql`
        UPDATE products SET name = ${name}, price = ${price} WHERE id = ${id};
      `;
      if (result.changes === 0) {
        res.status(404).send('Produto não encontrado');
      } else {
        res.status(200).send({ id, name, price });
      }
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Erro ao atualizar o produto');
    }
  }
});

// Rota DELETE para remover um produto por ID
app.delete('/products/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db.sql`
      DELETE FROM products WHERE id = ${id};
    `;
    if (result.changes === 0) {
      res.status(404).send('Produto não encontrado');
    } else {
      res.status(204).send();
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erro ao excluir o produto');
  }
});

// Inicia o servidor na porta configurada
app.listen(port, () => {
  console.log(`Servidor escutando na porta ${port}.`);
});

module.exports = app;
