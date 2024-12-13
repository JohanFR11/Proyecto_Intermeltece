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
        size="4xl"
        scrollBehavior="inside"
      >
        <ModalContent>
          <ModalHeader className="text-xl font-bold">
            Datos de Contratos
           {/* Dropdown de Categorías */}
          </ModalHeader>
          <ModalBody>
            <div className="overflow-x-auto">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="p-2 border border-gray-300 rounded-md"
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
        
              <table className="w-full border-collapse min-w-full">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="p-2 border text-left text-sm font-semibold">
                      Número de Parte
                    </th>
                    <th className="p-2 border text-left text-sm font-semibold">
                      Nivel
                    </th>
                    <th className="p-2 border text-left text-sm font-semibold">
                      Recomendaciones
                    </th>
                    <th className="p-2 border text-left text-sm font-semibold">
                      Descripción
                    </th>
                    <th className="p-2 border text-left text-sm font-semibold">
                      Periodo/Meses
                    </th>
                    <th className="p-2 border text-center text-sm font-semibold">
                      Perfil EA
                    </th>
                    <th className="p-2 border text-left text-sm font-semibold">
                      Moneda
                    </th>
                    <th className="p-2 border text-right text-sm font-semibold">
                      Valor por Equipo
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData.length > 0 ? (
                    filteredData.map((row, index) => (
                      <tr 
                        key={index} 
                        className="hover:bg-gray-50 cursor-pointer"  // Agregamos un estilo para indicar que es seleccionable
                        onClick={() => handleRowClick(row)}  // Llamamos a handleRowClick cuando se hace clic en una fila
                      >
                        <td className="p-2 border text-sm">
                          {row.numero_de_parte}
                        </td>
                        <td className="p-2 border text-sm">{row.nivel}</td>
                        <td className="p-2 border text-sm">
                          {row.recomendaciones}
                        </td>
                        <td className="p-2 border text-sm">
                          {row.descripcion}
                        </td>
                        <td className="p-2 border text-sm">
                          {row.periodo_meses}
                        </td>
                        <td className="p-2 border text-center text-sm">
                          {row.perfil_ea}
                        </td>
                        <td className="p-2 border text-sm">USD</td>
                        <td className="p-2 border text-right text-sm">
                          {row.venta_usd_periodo_equipo}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="8" className="py-3 px-6 text-center">
                        no se han encontrado datos, por favor comuniquese con el
                        desarrollador de la pagina.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
              
            </div>
          </ModalBody>
          <ModalFooter>
            <h3>
              ◉ Punto central de contacto de usuarios/clientes con la unidad de soporte técnico. <br/>
              ◉ Responsable por la recepción del reporte de falla <br/>
              ◉ Diagnóstico preliminar <br/>
              ◉ Nivel de solución basica <br/>
              ◉Escalamiento del incidente al siguiente nivel si no logra resolver la falla (Garantia de Fabrica). <br/>
              ◉ Logistica de doble via, durante el periodo de garantia. <br/>
              ◉ Documenta la solución al incidente en caso de resolverlo. <br/>
              ◉ También brinda información a clientes con incidentes en proceso de atención.<br/>
            </h3>
            <Button
              color="danger"
              variant="light"
              onPress={() => setIsOpen(false)}
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
