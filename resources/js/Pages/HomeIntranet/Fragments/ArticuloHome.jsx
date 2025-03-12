import React from "react";
import { Divider } from '@heroui/react'

export default function ArticuloHome() {
    return (
        <div className="p-5">
            <Divider className='h-[10px]' />
            <p className="mb-5 p-2 bg-[#dcdcdc] w-full sm:w-64 text-center font-bold">Articulo</p>
            
            <div className="w-full relative">
                <img
                    className="w-full object-cover rounded-md"
                    src="https://lh3.googleusercontent.com/d/1Uz9V1xoYHaT4-p5JppUknJE6nRyv795l"
                    alt="Imagen"
                />
                
                {/* Para pantallas pequeñas el botón estará debajo */}
                <a href={route("resources.modulo.articulos")}>
                    <button
                        className="mt-4 w-full bg-blue-500 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-blue-600 md:absolute md:bottom-4 md:right-4 md:w-auto md:mt-0"
                    >
                        Ver artículos
                    </button>
                </a>
            </div>
        </div>
    );
}
