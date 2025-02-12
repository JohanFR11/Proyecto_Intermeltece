import React from "react";
import { TrmGraph } from "@/Components/Trm";
import { Button, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from '@nextui-org/react';

export default function ModalDolar({ open, close, size, valores, trmInCop }) {
  return (
    <Modal isOpen={open} onClose={close} size={size}>
      <ModalContent>
        <ModalHeader className="text-lg font-semibold text-center text-gray-800">Precio del Dolar</ModalHeader>
        <ModalBody className="max-h-[70vh] overflow-y-auto"> {/* Ajustamos el alto y habilitamos el scroll */}
          <TrmGraph valores={valores} trmInCop={trmInCop} />
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
