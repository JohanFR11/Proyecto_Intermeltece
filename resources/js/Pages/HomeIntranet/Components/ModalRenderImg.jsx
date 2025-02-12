import React from 'react';
import { Button, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from '@nextui-org/react';

export default function ModalRenderImg({ open, close, size, isimgNovedad }) {
    return (
        <Modal size={size} isOpen={open} onClose={close}>
            <ModalContent className="max-h-[70vh] overflow-y-auto p-4 bg-white/10">
                <ModalBody className='flex items-center'>
                    <div className="">
                        <div className="">
                            <img
                                className=""
                                src={isimgNovedad}
                                alt="Imagen Completa"
                            />
                        </div>
                    </div>
                </ModalBody>
                <ModalFooter>
                    <button
                        color="danger"
                        variant="light"
                        onClick={close}
                        className="w-full rounded-lg sm:w-auto bg-sky-400 p-3 duration-200 hover:bg-sky-300 hover:font-bold"
                    >
                        Cerrar
                    </button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}