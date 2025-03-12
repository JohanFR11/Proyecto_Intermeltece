import React from 'react';
import axios from 'axios';

const PreviewButton = ({ fileId, fileName }) => {

  const handlePreview = async () => {
    // Llama al backend para obtener la URL pública
    const response = await axios.get(route("resources.hseq.filepreview", { id: fileId }));
    const fileUrl = response.data.url;
    
    if (fileName.endsWith('.pdf')) {
    // Abrir PDF directamente en el navegador
      window.open(fileUrl, '_blank');
    } else if (fileName.endsWith('.docx') || fileName.endsWith('.xlsx')) {
      //logica para previsualizar word y excel
      const googleDocsUrl = `https://docs.google.com/viewer?url=${encodeURIComponent(fileUrl)}&embedded=true`;
      window.open(googleDocsUrl, "_blank");
    } else if (
      fileName.endsWith('.jpg') ||
      fileName.endsWith('.jpeg') ||
      fileName.endsWith('.png') ||
      fileName.endsWith('.gif')
    ) {
      // Previsualización de imágenes
      const imageWindow = window.open('', '_blank');
      imageWindow.document.write(
        `<img src="${fileUrl}" alt="Imagen" style="width:100%; height:auto;">`
      );
    } else if (
      fileName.endsWith('.mp4') ||
      fileName.endsWith('.webm') ||
      fileName.endsWith('.ogg')
    ) {
      // Previsualización de videos
      const videoWindow = window.open('', '_blank');
      videoWindow.document.write(`
        <video controls autoplay style="width:100%; height:auto;">
          <source src="${fileUrl}" type="video/${fileName.split('.').pop()}">
          Tu navegador no soporta reproducción de video.
        </video>
      `);
    } else {
      alert('Tipo de archivo no soportado para previsualización.');
    }
  };
  return (
    <button className="btn btn-primary" onClick={handlePreview}>
      Previsualizar
    </button>
  );
};

export default PreviewButton;

