import React from "react";
import { Divider } from '@heroui/react'

export default function CotizadoresHome() {

    return (
        <div className="p-5">
            <Divider className='h-[10px]' />
            <p className="mb-5 p-2 bg-[#dcdcdc] w-full sm:w-64 text-center font-bold">Cotizadores Web</p>
            
            <div className="w-full relative">
                <img
                    className="w-full object-cover rounded-md"
                    src="https://lh3.googleusercontent.com/d/1BP-e6sBbnb7IlN6l_3FUVlhMMYcnWUVo"
                    alt="Imagen"
                />
                <a href={route('modulo.cotizadores.index')}>
                    <button
                        className="mt-4 w-full bg-blue-500 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-blue-600 md:absolute md:bottom-4 md:right-4 md:w-auto md:mt-0"
                    >
                        Ir a los cotizadores
                    </button>
                </a>
            </div>
        </div>
    )
}