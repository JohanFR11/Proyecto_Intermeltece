import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
  LabelList
} from "recharts";
import { Button, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from '@nextui-org/react';

export default function Ranking({ open, close, size, OdataRanking, totalRankingRevenue }) {

  const [chartData, setChartData] = useState([]);

  // Actualizar los datos del gráfico cuando OdataRanking cambia
  useEffect(() => {
    const groupedData = OdataRanking.reduce((acc, item) => {
      const name = item.responsable;
      const revenue = item.valor_net; // Eliminar símbolos y convertir a entero
      if (acc[name]) {
        acc[name] += revenue; // Sumar si ya existe
      } else {
        acc[name] = revenue; // Inicializar si no existe
      }
      return acc;
    }, {});

    // Convertimos el objeto de agrupación a un array de datos para el gráfico
    const data = Object.keys(groupedData).map((name) => ({
      name, // Responsable
      Ventas: groupedData[name], // Ventas sumadas
      VentasFormatted: new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(groupedData[name]), // Formateo de la venta sumada
    }));

    setChartData(data.sort((a, b) => b.Ventas - a.Ventas)); // Ordenamos los datos por ventas de mayor a menor
  }, [OdataRanking]);

  const maxValue = Math.max(...chartData.map((d) => d.Ventas));
  const marginValue = maxValue * 0.1;

  const meses = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
  ];
  const fechaActual = new Date();
  const mesNombre = meses[fechaActual.getMonth()];

  return (
    <Modal isOpen={open} onClose={close} size={size}>
      <ModalContent>
        <ModalHeader className="text-lg font-semibold text-center text-gray-800">Ranking de ventas</ModalHeader>
        <ModalBody className="max-h-[70vh] overflow-y-auto">
          <div>
            <div className="flex justify-center items-center h-full mt-10 mb-5">
              <div className="text-center">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">
                  Ranking ventas diarias asesores Meltec {new Date().getDate()} de {mesNombre}, {new Date().getFullYear()}
                </h3>
              </div>
            </div>

            {/* Div de total ventas */}
            <div className="bg-[#395181] text-white p-4 rounded-lg shadow-lg max-w-md mb-5 sm:max-w-48">
              <p className="text-lg font-semibold">Total Ventas Hoy:</p>
              <p className="text-xl font-bold">
                {new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(totalRankingRevenue)}
              </p>
            </div>

            {/* Gráfico de barras */}
            <div>
              <BarChart
                layout="vertical"
                width={850}
                height={570}
                data={chartData}
                barSize={60}
                margin={{
                  top: 5,
                  right: 30,
                  left: 100,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <YAxis dataKey="name" type="category" width={280} fontSize={16} />
                <XAxis type="number" domain={[0, maxValue + marginValue]} />
                <Tooltip
                  formatter={(value) =>
                    new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(value)
                  }
                />
                <Legend />
                <ReferenceLine y={0} stroke="#000" />
                <Bar
                  dataKey="Ventas"
                  fill={"#395181"}
                >
                  <LabelList
                    dataKey="Ventas"
                    position="center"
                    formatter={(value) =>
                      new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(value)
                    }
                    fontSize={10}
                    fill="#fff"
                  />
                </Bar>
              </BarChart>
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button color="danger" variant="light" onPress={close} className="w-full sm:w-auto">
            Cerrar
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
