import React, { useState, useEffect } from "react";
import {
  Button,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@nextui-org/react";

const ModalMesaAyuda = ({ MAData, categories, onSelectData, index }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [filteredData, setFilteredData] = useState(MAData);
  const [selectedCategory, setSelectedCategory] = useState("");

  const handleRowClick = (rowData) => {
    onSelectData(index,rowData);
    setIsOpen(false);
  };

  useEffect(() => {
    // Filtrar datos cuando cambie la categoría seleccionada
    if (selectedCategory === "") {
      setFilteredData(MAData); // Mostrar todos los datos si no se selecciona categoría
    } else {
      const filtered = MAData.filter(
        (item) => item.categoria_producto === selectedCategory
      );
      setFilteredData(filtered);
    }
  }, [selectedCategory, MAData]);

  return (
    <>
      <Button onPress={() => setIsOpen(true)} color="primary">
        Seleccionar
      </Button>
      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        size="6xl"
        scrollBehavior="inside"
      >
        <ModalContent className="bg-blue-900 text-white rounded-lg shadow-lg max-w-[90%]">
          <ModalHeader className="text-2xl font-bold border-b border-blue-700">
            Datos de Contratos
          </ModalHeader>
          <ModalBody>
            <div className="flex flex-col gap-6">
              <div className="flex">
                <div  className="w-1/4 pr-4">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full p-3 bg-blue-800 text-white border border-blue-700 rounded-md focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Todas las Categorías</option>
              {categories?.map((category) => (
                <option
                  key={category.categoria_producto}
                  value={category.categoria_producto}
                >
                  {category.categoria_producto}
                </option>
              ))}
            </select>
            <div className="mt-9 bg-blue-800 p-4 rounded-md text-sm text-white">
      <h3>
        ◉ Punto central de contacto de usuarios/clientes con la unidad de soporte técnico. <br />
        ◉ Responsable por la recepción del reporte de falla <br />
        ◉ Diagnóstico preliminar <br />
        ◉ Nivel de solución básica <br />
        ◉ Escalamiento del incidente al siguiente nivel si no logra resolver la falla (Garantía de Fábrica). <br />
        ◉ Logística de doble vía durante el periodo de garantía. <br />
        ◉ Documenta la solución al incidente en caso de resolverlo. <br />
        ◉ También brinda información a clientes con incidentes en proceso de atención.<br />
      </h3>
    </div>
            </div>
              <div className="flex-1 overflow-x-auto">
              <table className="w-full border-collapse min-w-full">
                <thead>
                  <tr className="bg-blue-800">
                    <th className="p-3 border-b border-blue-700 text-left text-sm font-semibold">
                      Número de Parte
                    </th>
                    <th className="p-3 border-b border-blue-700 text-left text-sm font-semibold">
                      Nivel
                    </th>
                    <th className="p-3 border-b border-blue-700 text-left text-sm font-semibold">
                      Recomendaciones
                    </th>
                    <th className="p-3 border-b border-blue-700 text-left text-sm font-semibold">
                      Descripción
                    </th>
                    <th className="p-3 border-b border-blue-700 text-left text-sm font-semibold">
                      Periodo/Meses
                    </th>
                    <th className="p-3 border-b border-blue-700 text-center text-sm font-semibold">
                      Perfil EA
                    </th>
                    <th className="p-3 border-b border-blue-700 text-left text-sm font-semibold">
                      Moneda
                    </th>
                    <th className="p-3 border-b border-blue-700 text-right text-sm font-semibold">
                      Valor por Equipo
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData.length > 0 ? (
                    filteredData.map((row, index) => (
                      <tr 
                        key={index} 
                        className="hover:bg-blue-700 transition-colors"  // Agregamos un estilo para indicar que es seleccionable
                        onClick={() => handleRowClick(row)}  // Llamamos a handleRowClick cuando se hace clic en una fila
                      >
                        <td className="p-3 border-b border-blue-700 text-sm">
                          {row.numero_de_parte}
                        </td>
                        <td className="p-3 border-b border-blue-700 text-sm">{row.nivel}</td>
                        <td className="p-3 border-b border-blue-700 text-sm">
                          {row.recomendaciones}
                        </td>
                        <td className="p-3 border-b border-blue-700 text-sm">
                          {row.descripcion}
                        </td>
                        <td className="p-3 border-b border-blue-700 text-sm">
                          {row.periodo_meses}
                        </td>
                        <td className="p-3 border-b border-blue-700 text-center text-sm">
                          {row.perfil_ea}
                        </td>
                        <td className="p-3 border-b border-blue-700 text-sm">USD</td>
                        <td className="p-3 border-b border-blue-700 text-right text-sm">
                          {row.venta_usd_periodo_equipo}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="8" className="py-4 px-6 text-center text-sm">
                        no se han encontrado datos, por favor comuniquese con el
                        desarrollador de la pagina.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
              </div>
              </div>
              
            </div>
          </ModalBody>
          <ModalFooter className="border-t border-blue-700">
          
            <Button
              color="danger"
              variant="ghost"
              onPress={() => setIsOpen(false)}
               className="text-white hover:bg-blue-800 hover:shadow-lg"
            >
              Cerrar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ModalMesaAyuda;
