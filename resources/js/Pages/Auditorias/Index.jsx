import React, { useState, useEffect, Suspense } from 'react';
/* import GoogleDriveUpload from './GoogleDriveUpload';
import DocumentList from './ListaDocumentos'; */
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
/* import { SnackbarProvider } from 'notistack'; */
import ImagenUno from './Img/pdf.png';
import ImagenDos from './Img/portapapeles.png';
import axios from 'axios';
import { motion } from "framer-motion";
const Preview = React.lazy(() => import('./Fragments/Preview'));

const Index = ({ auth, unreadNotifications }) => {
  const [user, setUser] = useState([]);  // Almacena los datos del usuario
  const [rol, setRol] = useState(null);  // Almacena los datos del usuario
  const [habilitado, setPrincipio] = useState(true);

  const [fileStatusData, setstatusFile] = useState(true);
  const [fileStatusDatados, setstatusFileDos] = useState(false);
  const [filename, setFileName] = useState(false);


  const [dataStatus, setDataStatus] = useState([]);
  const [fileStatus, setFileStatus] = useState([]);
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  console.log(fileStatus)
  const data = fileStatus[0] || {};
  const file_id = data['id_file'] ?? null;

  const handleFileChange = (e) => {
    setFile(e.target.files[0]); // Guarda el archivo seleccionado
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.size > 0) {
      setFileName(selectedFile.name);
    }

  };

  const refreshAccessToken = async () => {
    const refreshToken = localStorage.getItem('refresh_token');
    if (refreshToken) {
      try {

        console.log(refreshToken)
        const response = await axios.post('http://127.0.0.1:8000/refresh-token', {
          refresh_token: refreshToken
        });

        if (response.data.access_token) {
          localStorage.setItem('access_token', response.data.access_token);

        } else {
          alert('No se pudo renovar el token de acceso.');
          console.log("datos recibidos al intentar renovar el token: ", response.data)
        }
      } catch (error) {
        console.error('Error al refrescar el token:', error);
        alert('Error al refrescar el token.');
      }
    } else {
      alert('No se ha encontrado un refresh_token. Por favor, autentica primero. O comunicate con los desarrolladores para poder obtener permisos');
    }
  };

  const handleUpload = async () => {
    if (!file) {
      alert("Por favor, selecciona un archivo PDF.");
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    const area = user.rol;
    console.log(area)

    formData.append("folder_id", area);

    let token = localStorage.getItem('access_token');
    const tokenExpiry = 3599;

    // Verificar si el token está vencido
    const isTokenExpired = tokenExpiry && Date.now() > parseInt(tokenExpiry, 10);

    if (!token || isTokenExpired) {
      await refreshAccessToken();
      token = localStorage.getItem('access_token');
    }

    if (!token) {
      console.error('No se pudo obtener un token válido.');
      return;
    }

    try {
      const response = await axios.post("http://127.0.0.1:8000/upload/file", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          'Authorization': `Bearer ${token}`
        },
      });

      alert("Archivo subido exitosamente: ");
      window.location.reload();
      setFile(null);
    } catch (error) {
      console.error("Error al subir el archivo:", error);
      alert("Error al subir el archivo.");
    } finally {
      setUploading(false);
    }
  };

  useEffect(() => {
    axios
      .get("/user", { withCredentials: true }) // Llamada a la API
      .then((res) => {
        const accessTokenDB = res.data; // Extrae directamente el token
        setUser(accessTokenDB); // Guarda el token en el estado
      })
      .catch((error) => {
        console.error("Error al obtener el usuario:", error);
        setUser(null); // Si hay error, no hay usuario
      })
  }, []);
  useEffect(() => {
    setRol(user.rol);

  }, [user]);

  const handlehabilitar = async () => {

    try {

      const EstadoRol = await axios.get(`/habilitar/${rol}`, {
        headers: {
          "Content-Type": "application/json",
        }
      });

      setDataStatus(EstadoRol.data.estadoLista);
      setFileStatus(EstadoRol.data.EstadoSubir);

      const estado_habilitado = EstadoRol.data.estadoLista[0] || {}; // Accede de manera segura

      // Extraer el valor 'primer_estado' del objeto si existe
      const extactor = estado_habilitado['estado_auditoria'] ?? false;

      // Comparación y lógica condicional
      if (extactor === 0) {
        setPrincipio(false)
      } else if (extactor === 1) {
        setPrincipio(true)
      } else {
        setPrincipio(false)
      }


      /* Estado para subida del documento */
      const estado_doc = EstadoRol.data.EstadoSubir[0] || {}; // Accede de manera segura

      // Extraer el valor 'primer_estado' del objeto si existe
      const extactor_doc = estado_doc['estado_file'] ?? true;

      // Comparación y lógica condicional
      if (extactor_doc === 0) {
        setstatusFile(false)
      } else if (extactor_doc === 1) {
        setstatusFile(true)
      } else {
        setstatusFile(true)
      }

      const estado_doc_dos = EstadoRol.data.EstadoSubir[0] || {}; // Accede de manera segura

      // Extraer el valor 'primer_estado' del objeto si existe
      const extactor_doc_dos = estado_doc_dos['estado_file_dos'] ?? false;

      // Comparación y lógica condicional
      if (extactor_doc_dos === 0) {
        setstatusFileDos(false)
      } else if (extactor_doc_dos === 1) {
        setstatusFileDos(true)
      } else {
        setstatusFileDos(false)
      }


    } catch (error) {
      console.error("Error al generar PDF:", error.response ? error.response.data : error.message);
    }

  }
  useEffect(() => {
    if (rol) handlehabilitar();
  }, [rol]);


  const [mostrarTodo, setMostrarTodo] = useState(true);
  const [mostrarPreview, setMostrarPreviw] = useState(false);

  const mostrarPreviewFile = (estado, estadoDos) => {
    setMostrarTodo(estadoDos);
    setMostrarPreviw(estado);
  }

  console.log(file_id)

  return (
    <AuthenticatedLayout
      auth={auth}
      unreadNotifications={unreadNotifications}
      header={
        <h2 className="font-semibold text-xl text-gray-800 leading-tight"> {rol} Modulo A </h2>
      }>
      <div className="bg-white mt-4 mb-4 ml-4 mr-4 p-5">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.7 }}
          className="flex flex-col md:flex-row items-center justify-center"
        >
          <div className="flex flex-col items-center md:mr-14 mb-4 md:mb-0">
            <p className="text-center rounded-lg p-4">Documento Actividades</p>
            <img src={ImagenUno} className="w-[65px] h-[65px]" alt="Signo" />

            {fileStatusData && (
              <div className="flex flex-col items-center gap-4 p-4 border border-gray-300 rounded-lg shadow-md bg-gray-50">
                <label className="flex flex-col items-center w-full cursor-pointer">
                  <span className="text-sm font-medium text-gray-700 mb-2">Selecciona un archivo PDF</span>
                  <input
                    type="file"
                    accept="application/pdf"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <div className="flex items-center justify-center w-full h-12 px-4 text-sm text-gray-600 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                    Elegir archivo
                  </div>

                  {filename && (
                    <p className="mt-2 text-sm text-gray-500">{filename}</p>
                  )}
                </label>
                <button
                  onClick={handleUpload}
                  disabled={uploading}
                  className={`p-2 w-full rounded-lg text-white ${uploading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
                    } duration-150`}
                >
                  {uploading ? "Subiendo..." : "Subir PDF"}
                </button>
              </div>
            )}

            {fileStatusDatados && (
              <div className='flex flex-col items-center'>
                <p className='mt-2'>Documento Firmado</p>
                <a href={`https://drive.google.com/file/d/${file_id}/view?usp=drive_link`} target="_blank" rel="noopener noreferrer"><button className='p-3 text-white rounded-lg bg-[#395181] duration-100 hover:bg-[#5577bd]'>Ver</button></a>
              </div>
            )}

          </div>
          {habilitado && (
            <div className="flex flex-col items-center cursor-pointer">
              <img src={ImagenDos} className="w-[65px] h-[65px]" alt="Signo" />
              <p className="text-center border border-gray-400/20 rounded-lg p-4">Lista de Chequeo</p>
            </div>
          )}
        </motion.div>
      </div>

    </AuthenticatedLayout>
  );
};

export default Index;