// server.js
import express from 'express';
import multer from 'multer';
import { google } from 'googleapis';
import path from 'path';
import fs from 'fs';
import cors from 'cors';

const app = express();
const port = 5001;

// Configuración de multer para recibir archivos
const upload = multer({ dest: 'uploads/' });

app.use(cors());

// Ruta para subir archivos
app.post('/upload', upload.single('file'), async (req, res) => {
  const filePath = req.file.path; // Ruta del archivo temporal

  // Cargar las credenciales de la cuenta de servicio
  const auth = new google.auth.GoogleAuth({
    keyFile: path.resolve(path.dirname(new URL(import.meta.url).pathname).replace(/^\/([a-zA-Z]):\//, '$1:/'), 'claveCLient.json'),
    scopes: 'https://www.googleapis.com/auth/drive.file',
  });

  const drive = google.drive({ version: 'v3', auth });

  const fileMetadata = {
    name: req.file.originalname,
    parents: ['1CFMfx5iLuGmf9aeA24fyeIMObea-azVa'], // Nombre original del archivo
  };

  const media = {
    mimeType: req.file.mimetype,
    body: fs.createReadStream(filePath), // Cargar el archivo desde la ruta temporal
  };

  try {
    // Subir el archivo a Google Drive
    const response = await drive.files.create({
      requestBody: fileMetadata,
      media: media,
    });
    res.status(200).send('Archivo subido con éxito');
  } catch (error) {
    console.error('Error subiendo el archivo:', error);
    res.status(500).send('Error al subir el archivo');
  } finally {
    // Limpiar el archivo temporal
    fs.unlinkSync(filePath);
  }
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor ejecutándose en el puerto ${port}`);
});
