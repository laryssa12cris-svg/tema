import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;
const distPath = path.join(__dirname, 'dist');

// Middleware to serve static assets
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
  
  // SPA Fallback: send index.html for all client routes
  app.get('*', (req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
} else {
  app.get('*', (req, res) => {
    res.status(503).send('Aplicação SENAI-SP iniciando ou compilando. Execute npm run build se necessário.');
  });
}

app.listen(PORT, '0.0.0.0', () => {
  console.log(`[SENAI-SP] Servidor de produção ativo na porta ${PORT}`);
});
