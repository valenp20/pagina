const express = require('express');
const path = require('path');
const cors = require('cors');
const fs = require('fs');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 3000;

// Servir archivos estáticos desde la carpeta padre (raíz del proyecto)
const staticRoot = path.join(__dirname, '..');

app.use(cors());
app.use(express.json());
app.use(express.static(staticRoot));

// Archivo de productos dentro de backend/data (fallback si no hay Mongo)
const PRODUCTS_FILE = path.join(__dirname, 'data', 'products.json');

// Intentaremos usar MongoDB si se proporciona MONGO_URI en env
const MONGO_URI = process.env.MONGO_URI || process.env.DB_URI || null;
let ProductModel = null;

function readProducts() {
  try {
    const raw = fs.readFileSync(PRODUCTS_FILE, 'utf8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error leyendo productos:', err);
    return [];
  }
}

function writeProducts(products) {
  try {
    fs.writeFileSync(PRODUCTS_FILE, JSON.stringify(products, null, 2), 'utf8');
    return true;
  } catch (err) {
    console.error('Error escribiendo productos:', err);
    return false;
  }
}

async function initMongo() {
  if (!MONGO_URI) return false;
  try {
    await mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('Conectado a MongoDB');
    ProductModel = require(path.join(__dirname, 'models', 'product'));
    return true;
  } catch (err) {
    console.error('No se pudo conectar a MongoDB:', err.message || err);
    return false;
  }
}

// Endpoints: si hay Mongo, trabajamos con la colección; si no, usamos el archivo JSON

app.get('/api/products', async (req, res) => {
  if (ProductModel) {
    const docs = await ProductModel.find().lean().exec();
    return res.json(docs);
  }
  const products = readProducts();
  res.json(products);
});

app.get('/api/products/:id', async (req, res) => {
  const id = req.params.id;
  if (ProductModel) {
    // Intentar buscar por campo `id` numérico o por _id
    let doc = await ProductModel.findOne({ $or: [{ id: Number(id) }, { _id: id }] }).lean().exec();
    if (!doc) return res.status(404).json({ error: 'Producto no encontrado' });
    return res.json(doc);
  }
  const products = readProducts();
  const product = products.find(p => String(p.id) === String(id));
  if (!product) return res.status(404).json({ error: 'Producto no encontrado' });
  res.json(product);
});

app.post('/api/products', async (req, res) => {
  const { name, price, image, discount, category, weeklyOffer } = req.body || {};

  if (!name || price === undefined) {
    return res.status(400).json({ error: 'Los campos "name" y "price" son obligatorios' });
  }

  if (ProductModel) {
    try {
      const created = await ProductModel.create({ name, price, image, discount, category, weeklyOffer });
      return res.status(201).json(created);
    } catch (err) {
      console.error('Error creando producto (mongo):', err);
      return res.status(500).json({ error: 'No se pudo guardar el producto' });
    }
  }

  const products = readProducts();
  const nextId = products.reduce((max, p) => Math.max(max, p.id || 0), 0) + 1;
  const newProduct = {
    id: nextId,
    name: String(name),
    price: Number(price),
    image: image || '',
    discount: Number(discount) || 0,
    category: category || '',
    weeklyOffer: weeklyOffer === true || weeklyOffer === 'true' || weeklyOffer === 1 || weeklyOffer === '1' || false
  };

  products.push(newProduct);
  const ok = writeProducts(products);
  if (!ok) return res.status(500).json({ error: 'No se pudo guardar el producto' });

  res.status(201).json(newProduct);
});

app.put('/api/products/:id', async (req, res) => {
  const id = req.params.id;
  if (ProductModel) {
    try {
      const body = req.body || {};
      const fields = ['name', 'price', 'image', 'discount', 'category', 'weeklyOffer'];
      const update = {};
      fields.forEach(f => { if (body[f] !== undefined) update[f] = body[f]; });
      let doc = await ProductModel.findOneAndUpdate({ $or: [{ id: Number(id) }, { _id: id }] }, update, { new: true }).lean().exec();
      if (!doc) return res.status(404).json({ error: 'Producto no encontrado' });
      return res.json(doc);
    } catch (err) {
      console.error('Error actualizando producto (mongo):', err);
      return res.status(500).json({ error: 'No se pudo guardar el producto' });
    }
  }

  const products = readProducts();
  const idx = products.findIndex(p => String(p.id) === String(id));
  if (idx === -1) return res.status(404).json({ error: 'Producto no encontrado' });

  const body = req.body || {};
  const fields = ['name', 'price', 'image', 'discount', 'category', 'weeklyOffer'];
  fields.forEach(f => {
    if (body[f] !== undefined) {
      if (f === 'price' || f === 'discount') {
        products[idx][f] = Number(body[f]);
      } else if (f === 'weeklyOffer') {
        products[idx][f] = body[f] === true || body[f] === 'true' || body[f] === 1 || body[f] === '1';
      } else {
        products[idx][f] = body[f];
      }
    }
  });

  const ok = writeProducts(products);
  if (!ok) return res.status(500).json({ error: 'No se pudo guardar el producto' });

  res.json(products[idx]);
});

// Iniciar servidor: primero intentar conectar a Mongo si se configuró
(async () => {
  const mongoOk = await initMongo();
  app.listen(PORT, () => {
    console.log(`Servidor (backend) escuchando en http://localhost:${PORT}`);
    if (!mongoOk) console.log('MongoDB no configurado. Usando archivo JSON en backend/data/products.json');
  });
})();
