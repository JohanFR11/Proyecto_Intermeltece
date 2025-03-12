import { Button, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, DatePicker, Input } from '@nextui-org/react';
import React, { useState, useMemo} from 'react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import images from './images.png';
import meltec from './meltec.png';
export default function ModalZebra({ open, close, size, partDetails,quantities, odataClientes, selectedDataMA}) {
    const [selectedDate, setSelectedDate] = useState(null);
    const [deliveryTime, setDeliveryTime] = useState('');
    const [LugarEntrega, setLugarEntrega] = useState('');
    const [Persona, setPersona] = useState('');
    const [correoPersona, setcorreoPersona] = useState('');
    const [Cantidad, setCantidad] = useState('');
    const [Asunto, setAsunto] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [selectedCliente, setSelectedCliente] = useState(null);
    
    const filteredClientes = useMemo(() => {
      return odataClientes.filter((cliente) =>
          cliente.NombreCliente.toLowerCase().includes(searchQuery.toLowerCase())
      );
  }, [odataClientes, searchQuery]);
    
      const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
      };
    
      const handleSelectCliente = (cliente) => {
        setSelectedCliente(cliente.NombreCliente);
        setIsDropdownOpen(false); // Cierra el dropdown al seleccionar un cliente
      };

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
        doc.text('Cotizacion N°  ', 20, 60);
        doc.text(`Señores: ${selectedCliente || 'cliente no seleccionado'}`, 20, 70);
        doc.text(`Asunto:  ${Asunto}`, 20, 80);
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
                ['N° Parte', 'Tipo Producto', 'Descripción','Und', 'Moneda', 'Precio Lista', 'Precio Final','Precio Mesa Ayuda', 'Descuento', 'Categoria Producto'],
            ],
            body: partDetails.map((partDetail, index) => {
                const quantity = quantities[partDetail.partNumber] || 1; // Obtén la cantidad o usa 1 por defecto
                const listPrice = parseFloat(partDetail.listPrice.replace(/,/g, "")) || 0; // Convierte listPrice a número
                const finalPrice = parseFloat(partDetail.finalPrice.replace(/,/g, "")) || 0; // Convierte finalPrice a número
                const totalListPrice = (listPrice * quantity).toFixed(2); // Calcula totalListPrice con 2 decimales
                const totalFinalPrice = selectedDataMA[index] ? ((finalPrice * quantity) + selectedDataMA[index]).toFixed(2) : (finalPrice * quantity).toFixed(2); // Calcula totalFinalPrice con 2 decimales
            
                return [
                    partDetail.partNumber || '----',
                    partDetail.dataInfo.Product_Type || '----',
                    partDetail.dataInfo.Short_Marketing_Desc || '----',
                    quantity, // Cantidad seleccionada
                    partDetail.dataInfo.Currency || '----', // Moneda
                    `${totalListPrice}$`,
                    `${totalFinalPrice}$`, 
                    `$${selectedDataMA[index]||0}`,
                    `${parseInt(partDetail.descuento) || 0}%`, // Descuento
                    partDetail.dataInfo.Product_Category || '----', // Categoría del producto

                ];
            })
            ,
            theme: 'grid', // El tema para la tabla
            headStyles: { fillColor: [148, 199, 255] }, // Color de fondo para la cabecera
            styles: { fontSize: 7 }, // Tamaño de la fuente
            
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
  <ModalContent className="mt-16">
    {(onClose) => (
      <>
        <ModalHeader className="flex flex-col gap-2">
          <h2 className="text-xl font-semibold">Factura</h2>
        </ModalHeader>
        
        <ModalBody style={{ maxHeight: '70vh', overflowY: 'auto' }} className="space-y-6">
          <div className="mb-6 flex flex-wrap gap-4 justify-between items-center">
            <div className="w-full sm:w-1/2">
              <p className="font-medium">Bogotá D.C. ,</p>
              <DatePicker
                isRequired
                className="max-w-[284px] mb-2 mt-1"
                label="Fecha de la cotización"
                value={selectedDate}
                onChange={setSelectedDate}
              />
            </div>
            <div className="w-full sm:w-1/2">
              <p className="font-medium">Cotización N°</p>
              <p className="text-gray-700">[proximo]</p>
            </div>
          </div>
          <div className="mb-6 flex flex-wrap gap-4 justify-between items-center">
            <div className="relative w-full">
              <button
                type="button"
                className="w-full bg-gray-100 border border-gray-300 text-gray-700 rounded-lg px-4 py-2 text-left focus:outline-none focus:ring-2 focus:ring-blue-500"
                onClick={toggleDropdown}
              >
                {selectedCliente || '-- Selecciona un cliente --'}
                <span className="float-right text-gray-500">&#9660;</span>
              </button>
              {isDropdownOpen && (
                <div className="absolute z-10 bg-white border border-gray-300 rounded-lg shadow-md w-full mt-1 max-h-60 overflow-y-auto">
                  <div className="p-2">
                    <Input
                      placeholder="Buscar cliente..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full"
                    />
                  </div>
                  {filteredClientes.map((cliente, index) => (
                    <div
                      key={index}
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                      onClick={() => handleSelectCliente(cliente)}
                    >
                      {cliente.NombreCliente}
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="w-full sm:w-1/2">
              <p className="font-medium">Asunto:</p>
              <Input
              isRequired
              className="max-w-xs"
              value={Asunto}
              onChange={(e) => setAsunto(e.target.value)}
            />
            </div>
          </div>

          <div className="text-center mb-6">
            <h1 className="text-xl font-semibold text-blue-600">COTIZACIÓN MELTEC COMUNICACIONES S.A.</h1>
            <p className="text-justify mt-4 text-sm text-gray-600">
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
                            <th className="py-3 px-6 text-left text-gray-700">Cantidad</th>
                            <th className="py-3 px-6 text-left text-gray-700">Precio Lista</th>
                            <th className="py-3 px-6 text-left text-gray-700">Precio Final</th>
                            <th className="py-3 px-6 text-left text-gray-700">Precio mesa AYUDA</th>
                            <th className="py-3 px-6 text-left text-gray-700">Descuento</th>
                            <th className="py-3 px-6 text-left text-gray-700">Categoria Producto</th>
                            <th className="py-3 px-6 text-left text-gray-700">Descripción</th>
                        </tr>
                    </thead>
                    <tbody className="text-sm text-gray-800">
                                            {partDetails.length > 0 ? (
                                                partDetails.map((partDetail, index) => {
                                                    const quantity = quantities[partDetail.partNumber] || 1;
                                                    const listPrice = parseFloat(partDetail.listPrice.replace(/,/g, ""));
                                                    const finalPrice = parseFloat(partDetail.finalPrice.replace(/,/g, ""));
                                                    const totalListPrice =( listPrice* quantity).toFixed(2);
                                                    const totalFinalPrice = selectedDataMA[index] ? ((finalPrice * quantity) + selectedDataMA[index]).toFixed(2) : (finalPrice * quantity).toFixed(2);

                                                    return (
                                                    <tr className="border-b hover:bg-gray-100" key={index}>
                                                        <td className="py-3 px-6">{partDetail.partNumber}</td>
                                                        <td className="py-3 px-6">{partDetail.dataInfo.Product_Type}</td>
                                                        <td className="py-3 px-6">{partDetail.dataInfo.Currency}</td>
                                                        <td className="py-3 px-6">{quantity}</td>
                                                        <td className="py-3 px-6">{totalListPrice}</td>
                                                        <td className="py-3 px-6">{totalFinalPrice}</td>
                                                        <td className="py-3 px-6">{selectedDataMA[index]||0}</td>
                                                        <td className="py-3 px-6">{`${partDetail.descuento}%`}</td>
                                                        <td className="py-3 px-6">{partDetail.dataInfo.Product_Category}</td>
                                                        <td className="py-3 px-6">{partDetail.dataInfo.Short_Marketing_Desc}</td>
                                                    </tr>
                                                )})
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

          <div className="flex flex-wrap gap-4 justify-between items-center">
            <div className="w-full sm:w-1/2">
              <p className="font-medium">Tiempo de Entrega:</p>
              <Input
                isRequired
                className="max-w-xs mb-4"
                label="Ejm: 5 días hábiles"
                type="text"
                value={deliveryTime}
                onChange={(e) => setDeliveryTime(e.target.value)}
              />
            </div>

            <div className="w-full sm:w-1/2">
              <p className="font-medium">Lugar de Entrega:</p>
              <Input
                isRequired
                className="max-w-xs mb-4"
                label="Lugar de entrega"
                type="text"
                value={LugarEntrega}
                onChange={(e) => setLugarEntrega(e.target.value)}
              />
            </div>
          </div>

          <div className="text-sm text-gray-600 mb-6">
            <p><span className="font-semibold">Comentario:</span> En nombre de MELTEC COMUNICACIONES S.A., quiero expresarle mis agradecimientos por considerarnos una alternativa de solución. Todos nuestros equipos están debidamente amparados por licencias de importación de las cuales usted podrá disponer en el momento que lo solicite.</p>
          </div>

          <div className="flex flex-wrap gap-4 justify-between items-center">
            <div className="w-full sm:w-1/2">
              <p className="font-medium">Cordialmente,</p>
            </div>
            <div className="w-full sm:w-1/2">
              <div className="mb-4">
                <p className="font-medium">Responsable:</p>
                <Input
                  isRequired
                  className="max-w-xs"
                  label="Persona"
                  type="text"
                  value={Persona}
                  onChange={(e) => setPersona(e.target.value)}
                />
              </div>
              <div>
                <p className="font-medium">Correo:</p>
                <Input
                  isRequired
                  className="max-w-xs"
                  label="Correo"
                  type="email"
                  value={correoPersona}
                  onChange={(e) => setcorreoPersona(e.target.value)}
                />
              </div>
            </div>
          </div>
        </ModalBody>
        
        <ModalFooter className="space-x-4">
          <Button color="danger" variant="light" onPress={onClose}>Cerrar</Button>
          <Button color="primary" onPress={() => generatePDF()}>Generar Factura</Button>
        </ModalFooter>
      </>
    )}
  </ModalContent>
</Modal>

    );
}