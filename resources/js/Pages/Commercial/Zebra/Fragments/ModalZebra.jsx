import { Button, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, DatePicker, Input } from '@nextui-org/react';
import React, { useState } from 'react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import images from './images.png';
import meltec from './meltec.png';

export default function ModalZebra({ open, close, size, partDetails }) {
  const [selectedDate, setSelectedDate] = useState(null);
  const [deliveryTime, setDeliveryTime] = useState('');
  const [LugarEntrega, setLugarEntrega] = useState('');
  const [Persona, setPersona] = useState('');
  const [correoPersona, setcorreoPersona] = useState('');
  const [Cantidad, setCantidad] = useState('');
  

  const getFormattedDate = () => {
    if (!selectedDate) return 'No seleccionada';

    const date = selectedDate.toDate(); // Asegúrate de que sea un objeto Date
    const formatter = new Intl.DateTimeFormat('es-ES');

    return formatter.format(date);
  };

  const formatDeliveryTime = (deliveryTime) => {
    const numbersToWords = {
      1: 'Uno', 2: 'Dos', 3: 'Tres', 4: 'Cuatro', 5: 'Cinco',
      6: 'Seis', 7: 'Siete', 8: 'Ocho', 9: 'Nueve', 10: 'Diez',
      11: 'Once', 12: 'Doce', 13: 'Trece', 14: 'Catorce', 15: 'Quince',
      16: 'Dieciséis', 17: 'Diecisiete', 18: 'Dieciocho', 19: 'Diecinueve',
      20: 'Veinte', 21: 'Veintiuno', 22: 'Veintidós', 23: 'Veintitrés', 24: 'Veinticuatro',
      25: 'Veinticinco', 26: 'Veintiséis', 27: 'Veintisiete', 28: 'Veintiocho', 29: 'Veintinueve',
      30: 'Treinta', 31: 'Treintaiuno',
    };

    const number = parseInt(deliveryTime, 10); // Convertir la entrada a un número

    if (isNaN(number)) {
      return 'Días no válidos'; // Manejo de error si el valor no es numérico
    }

    const words = numbersToWords[number] || number.toString(); // Convertir a palabras o dejar como número
    const formattedNumber = number < 10 ? `0${number}` : number; // Formatear como "05" si es menor a 10

    return `${words} (${formattedNumber}) Días`;
  };

  // Función para generar el PDF
  const generatePDF = () => {
    const doc = new jsPDF(); // Crea un nuevo documento PDF

    doc.addImage(images, 'PNG', 20, 5, 40, 30);
    doc.addImage(meltec, 'PNG', 130, 5, 60, 20);

    // Fecha y descripción
    const formattedDate = getFormattedDate();
    doc.setFontSize(12);
    doc.text(`Bogotá D.C. ,   ${formattedDate}`, 20, 50);
    doc.text('Cotizacion N°  -----', 20, 60);
    doc.text('Señores: cliente', 20, 70);
    doc.text('Asunto:  asdasdasfasfa', 20, 80);

    // Título de la cotización
    doc.setFontSize(16);
    doc.text('COTIZACION MELTEC COMUNICACIONES S.A.', 45, 90);

    doc.setFontSize(12);
    doc.text(
      'Reciba un cordial saludo en nombre de MELTEC COMUNICACIONES S.A., compañía dedicada al suministro, integración y desarrollo de soluciones empresariales y movilidad digital en Colombia. A continuación, me permito enviarle nuestra cotización de acuerdo a sus requerimientos. Esperamos que esta propuesta cumpla con sus expectativas y estaremos atentos a sus comentarios.',
      20,
      100,
      { maxWidth: 180 }
    );

    // Generar la tabla de productos
    doc.text('OFERTA ECONOMICA', 90, 130);
    doc.autoTable({
      startY: 140,
      head: [
        ['N° Parte', 'Tipo Producto', 'Moneda', 'Precio Lista', 'Precio Final', 'Descuento', 'Categoria Producto', 'Descripción'],
      ],
      body: partDetails.map((partDetail) => [
        partDetail.partNumber || '----',
        '----', // Puedes agregar un valor si tienes datos del tipo de producto
        '----', // Lo mismo para la moneda
        `${partDetail.listPrice || 0}$`,
        '----',
        `${partDetail.finalPrice || 0}$`,
        `${partDetail.descuento || 0}%`,
        '----', // Lo mismo para la categoría
        '----', // Lo mismo para la descripción
      ]),
      theme: 'grid', // El tema para la tabla
      headStyles: { fillColor: [148, 199, 255] }, // Color de fondo para la cabecera
      styles: { fontSize: 10 }, // Tamaño de la fuente
    });

    // Si el contenido sobrepasa una página, automáticamente agregará una nueva
    const formattedDeliveryTime = formatDeliveryTime(deliveryTime);

    // Comprobar si el espacio restante en la página es suficiente
    if (doc.lastAutoTable.finalY) { // Si el contenido excede la página actual
      doc.addPage(); // Agregar una nueva página

      doc.addImage(images, 'PNG', 20, 5, 40, 30);
      doc.addImage(meltec, 'PNG', 130, 5, 60, 20);

      doc.setFontSize(12);
      doc.text(`Tiempo de Entrega: ${deliveryTime}`, 20, 45);
      doc.text(`Lugar de Entrega: ${LugarEntrega}`, 20, 55);
      doc.text(`Validez de la oferta: ${formattedDeliveryTime}`, 20, 65);

      doc.setFontSize(12);
      doc.text('comentario', 20, 75);
      doc.text(
        'En nombre de MELTEC COMUNICACIONES S.A., quiero expresarle mis agradecimientos por considerarnos una alternativa de solución. Todos nuestros equipos están debidamente amparados por licencias de importación de las cuales usted podrá disponer en el momento que lo solicite.',
        20,
        85,
        { maxWidth: 180 }
      );

      doc.setFontSize(12);
      doc.text('Cordialmente, ', 20, 105);
      doc.text(`${Persona}`, 20, 115);
      doc.text(`${correoPersona}`, 20, 125);
      doc.text('+57 4111899, ', 20, 135);

      doc.setFontSize(16);
      doc.text('MELTEC COMUNICACIONES S.A., ', 20, 145);
    }

    // Descarga el PDF generado
    doc.save('cotizacion_meltec.pdf');
  };

  return (
    <Modal isOpen={open} onClose={close} size={size}>
      <ModalContent className="mt-60">
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">Factura</ModalHeader>
            <ModalBody style={{ maxHeight: '70vh', overflowY: 'auto' }}>
              <div className="flex w-full flex-row flex-wrap md:flex-nowrap gap-4">
                <p>Bogotá D.C. ,</p>
                <DatePicker
                  isRequired
                  className="max-w-[284px] max-h-[30px] mb-5"
                  label="Fecha de la cotización"
                  value={selectedDate}
                  onChange={setSelectedDate} // Establece la fecha seleccionada
                />
              </div>
              <div className="flex w-full flex-row flex-wrap md:flex-nowrap gap-4">
                <p>Cotizacion N°</p>
                <p>1231231231</p>
              </div>
              <div className="flex w-full flex-row flex-wrap md:flex-nowrap gap-4">
                <p>Señores:   </p>
                <p>cliente</p>
              </div>
              <div className="flex w-full flex-row flex-wrap md:flex-nowrap gap-4">
                <p>Asunto:   </p>
                <p>asdasdasdasda</p>
              </div>
              <div className="flex flex-col md:flex-col items-start gap-6 p-4">
                <h1 className="text-center">COTIZACION MELTEC COMUNICACIONES S.A.</h1>
                <p className="text-justify">
                  Reciba un cordial saludo en nombre de MELTEC COMUNICACIONES S.A., compañía dedicada al suministro, integración y desarrollo de soluciones empresariales y movilidad digital en Colombia. A continuación, me permito enviarle nuestra cotización de acuerdo a sus requerimientos. Esperamos que esta propuesta cumpla con sus expectativas y estaremos atentos a sus comentarios.
                </p>
              </div>

              {/* Tabla de los productos seleccionados */}
              <div className="flex flex-col md:flex-row items-start gap-6 p-4">
                <div className="overflow-x-auto w-full">
                <div className="flex w-full flex-row flex-wrap md:flex-nowrap gap-4">
                  <p>OFERTA ECONOMICA</p>
                </div>
                  <table className="min-w-full bg-white shadow-lg rounded-lg overflow-hidden">
                    <thead>
                      <tr className="bg-blue-300 text-white text-sm font-semibold uppercase">
                        <th className="py-3 px-6 text-left text-gray-700">N° Parte</th>
                        <th className="py-3 px-6 text-left text-gray-700">Tipo Producto</th>
                        <th className="py-3 px-6 text-left text-gray-700">Moneda</th>
                        <th className="py-3 px-6 text-left text-gray-700">Precio Lista</th>
                        <th className="py-3 px-6 text-left text-gray-700">Cantidad</th>
                        <th className="py-3 px-6 text-left text-gray-700">Precio Final</th>
                        <th className="py-3 px-6 text-left text-gray-700">Descuento</th>
                        <th className="py-3 px-6 text-left text-gray-700">Categoria Producto</th>
                        <th className="py-3 px-6 text-left text-gray-700">Descripción</th>
                      </tr>
                    </thead>
                    <tbody className="text-sm text-gray-800">
                      {partDetails.length > 0 ? (
                        partDetails.map((partDetail, index) => (
                          <tr className="border-b hover:bg-gray-100" key={index}>
                            <td className="py-3 px-6">{partDetail.partNumber}</td>
                            <td className="py-3 px-6">----</td>
                            <td className="py-3 px-6">----</td>
                            <td className="py-3 px-6">{`${partDetail.listPrice}$`}</td>
                            <td className="py-3 px-6"></td>
                            <td className="py-3 px-6">{`${partDetail.finalPrice}$`}</td>
                            <td className="py-3 px-6">{`${partDetail.descuento}%`}</td>
                            <td className="py-3 px-6">----</td>
                            <td className="py-3 px-6">----</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="8" className="py-3 px-6 text-center">
                            No se han seleccionado productos aún.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="flex flex-row w-full flex-wrap md:flex-nowrap gap-4">
                <p>Tiempo de entrega: </p>
                <Input
                  isRequired
                  className="max-w-xs max-h-[30px]"
                  label="Tiempo de entrega"
                  type="text"
                  value={deliveryTime}
                  onChange={(e) => setDeliveryTime(e.target.value)}
                />
              </div>
              <div className="flex flex-row w-full flex-wrap md:flex-nowrap gap-4">
                    <p>
                      Lugar de Entrega:  
                    </p>
                    <Input
                      isRequired
                      className="max-w-xs max-h-[30px]"
                      label="Lugar de entrega"
                      type="text"
                      value={LugarEntrega}
                      onChange={(e) => setLugarEntrega(e.target.value)}
                    />
                  </div>
                  <div className="flex flex-col w-full flex-wrap md:flex-nowrap gap-4">
                    <p>
                    Comentario
                    </p>
                    <p>
                    En nombre de MELTEC COMUNICACIONES S.A., quiero expresarle mis agradecimientos por considerarnos
                    una alternativa de solución. Todos nuestros equipos están debidamente amparados por licencias de importación
                    de las cuales usted podrá disponer en el momento que lo solicite.
                    </p>
                  </div>
                  <div className="flex flex-col w-full flex-wrap md:flex-nowrap gap-4">
                    <p>
                    Cordialmente, 
                    </p>
                    <div className="flex flex-row w-full flex-wrap md:flex-nowrap gap-4">
                      <p>
                        Responsable:
                      </p>
                      <Input
                        isRequired
                        className="max-w-xs max-h-[30px]"
                        label="Persona"
                        type="text"
                        value={Persona}
                        onChange={(e) => setPersona(e.target.value)}
                      />
                    </div>
                    <div className="flex flex-row w-full flex-wrap md:flex-nowrap gap-4">
                      <p>
                        Correo: 
                      </p>
                      <Input
                        isRequired
                        className="max-w-xs max-h-[30px]"
                        label="Correo"
                        type="email"
                        value={correoPersona}
                        onChange={(e) => setcorreoPersona(e.target.value)}
                      />
                    </div>    
                  </div>
            </ModalBody>

            <ModalFooter>
              <Button color="danger" variant="light" onPress={onClose}>
                Cerrar
              </Button>
              <Button color="primary" onPress={() => generatePDF()}> 
                Generar Factura
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
