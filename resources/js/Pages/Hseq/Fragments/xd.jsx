import React, { useState, useEffect } from 'react';

const ODataQuery = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // URL con el filtro aplicado por TPROD_CAT_UUID
  const url = "https://my345513.sapbydesign.com/sap/byd/odata/ana_businessanalytics_analytics.svc/RPSCMINVV02_Q0001QueryResults?$select=TPROD_CAT_UUID,CMATERIAL_UUID,TMATERIAL_UUID,TLOG_AREA_UUID,KCON_HAND_STOCK&$top=99999&$filter=TPROD_CAT_UUID eq 'TERMINALES ULEFONE ARMOR'&$format=json";

  // Efecto para obtener los datos de la API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(url);

        // Verificar si la solicitud fue exitosa
        if (!response.ok) {
          throw new Error('Error en la solicitud');
        }

        const result = await response.json();

        // Aquí filtras o extraes los datos específicos de la respuesta
        const filteredData = result.value.map(item => ({
          materialId: item.CMATERIAL_UUID,          // Extracción de CMATERIAL_UUID
          materialText: item.TMATERIAL_UUID,        // Extracción de TMATERIAL_UUID
          categoryText: item.TPROD_CAT_UUID,        // Extracción de TPROD_CAT_UUID
          stock: item.KCON_HAND_STOCK,              // Extracción de KCON_HAND_STOCK
          logArea: item.TLOG_AREA_UUID              // Extracción de TLOG_AREA_UUID
        }));

        setData(filteredData); // Guardamos los datos filtrados
        setLoading(false); // Cambiamos el estado de carga a false
      } catch (err) {
        setError(err.message); // Manejo de errores
        setLoading(false);
      }
    };

    fetchData(); // Ejecutar la función de obtención de datos
  }, []); // El array vacío asegura que la solicitud se realice solo una vez al montar el componente

  // Mostrar carga o error
  if (loading) return <div>Cargando...</div>;
  if (error) return <div>Error: {error}</div>;

  // Renderizar los datos obtenidos
  return (
    <div>
      <h1>Datos de Stock</h1>
      <table border="1">
        <thead>
          <tr>
            <th>Material ID</th>
            <th>Material Texto</th>
            <th>Categoría de Producto</th>
            <th>Stock en Almacén</th>
            <th>Área de Logística</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={index}>
              <td>{item.materialId}</td>
              <td>{item.materialText}</td>
              <td>{item.categoryText}</td>
              <td>{item.stock}</td>
              <td>{item.logArea}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ODataQuery;
