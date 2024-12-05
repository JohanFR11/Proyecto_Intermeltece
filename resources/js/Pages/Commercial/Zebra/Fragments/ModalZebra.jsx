import { useDisclosure, Button, Input, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from '@nextui-org/react'

/* import axios from 'axios' */
import React, { useState } from 'react'
/* import { handleSwalSuccess, handleSwalError } from '@/helpers/swalHelper'
import { usePage } from '@inertiajs/react' */


export default function ModalZebra({open, close, size, partDetails})
{
    return (
        <>
            <Modal isOpen={open} onClose={close} size={size}>
            <ModalContent >
              {(onClose) => (
                <>
                  <ModalHeader className="flex flex-col gap-1">Factura</ModalHeader>
                  <ModalBody>
                    <div className="flex flex-col md:flex-col items-start gap-6 p-4">
                        <h1>
                            COTIZACION MELTEC COMUNICACIONES S.A.
                        </h1>
                        <p>
                        Reciba un cordial saludo en nombre de MELTEC COMUNICACIONES S.A., compañía dedicada al suministro,
                        integración y desarrollo de soluciones empresariales y movilidad digital en Colombia. A continuación, me permito
                        enviarle nuestra cotización de acuerdo a sus requerimientos. Esperamos que esta propuesta cumpla con sus
                        expectativas y estaremos atentos a sus comentarios.
                        </p>
                    </div>
                    {/* Tabla de los productos seleccionados */}
                    <div className="flex flex-col md:flex-row items-start gap-6 p-4">
                        <div className="overflow-x-auto w-full"> {/* Se agrega un contenedor para el scroll horizontal */}
                            <h1>
                                OFERTA ECONOMICA
                            </h1>
                            <table className="min-w-full bg-white shadow-lg rounded-lg overflow-hidden">
                                <thead>
                                    <tr className="bg-blue-300 text-white text-sm font-semibold uppercase">
                                        <th className="py-3 px-6 text-left text-gray-700">N° Parte</th>
                                        <th className="py-3 px-6 text-left text-gray-700">Tipo Producto</th>
                                        <th className="py-3 px-6 text-left text-gray-700">Moneda</th>
                                        <th className="py-3 px-6 text-left text-gray-700">Precio Lista</th>
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
                                                <td className="py-3 px-6">{`${partDetail.finalPrice}$`}</td>
                                                <td className="py-3 px-6">{`${partDetail.descuento}%`}</td>
                                                <td className="py-3 px-6">----</td>
                                                <td className="py-3 px-6">----</td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="8" className="py-3 px-6 text-center">No se han seleccionado productos aún.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                  </ModalBody>
                  <ModalFooter>
                    <Button color="danger" variant="light" onPress={onClose}>
                      Close
                    </Button>
                    <Button color="primary" onPress={onClose}>
                      Action
                    </Button>
                  </ModalFooter>
                </>
              )}
            </ModalContent>
            </Modal>
        </>
      );
}