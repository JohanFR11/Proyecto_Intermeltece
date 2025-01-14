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

export default function Ranking({ OdataRanking }) {

  const [chartData, setChartData] = useState([]);

  // Actualizar los datos del gráfico cuando OdataRanking cambia
  useEffect(() => {
    const groupedData = OdataRanking.reduce((acc, item) => {
      const name = item.TIP_SAL_EMP;
      const revenue = parseInt(item.KCNT_REVENUE.replace(/[^\d.-]/g, ''), 10); // Eliminar símbolos y convertir a entero
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
    <div>
      <div className="flex justify-center items-center h-full mt-10 mb-5 ">
        <div className="text-center">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Ranking ventas diarias asesores Meltec {new Date().getDate()} de {mesNombre}, {new Date().getFullYear()}</h3>
        </div>
      </div>

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
            formatter={(value) => new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(value)} 
          />
          <Legend />
          <ReferenceLine y={0} stroke="#000" />
          <Bar
            dataKey="Ventas"
            fill={"#395181"} // Cambiar el color a rojo si el valor es negativo
          >
            <LabelList 
              dataKey="Ventas" 
              position="center" 
              formatter={(value) => new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(value)} 
              fontSize={16} 
              fill="#fff"
            />
          </Bar>
        </BarChart>
      </div>
    </div>
  );
}
