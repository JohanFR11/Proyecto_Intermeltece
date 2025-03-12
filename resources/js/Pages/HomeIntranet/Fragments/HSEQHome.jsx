import React from "react";
import { Divider } from '@heroui/react'

export default function HSEQHome() {

    return (
        <div className="p-5">
            <Divider className='h-[10px]' />
            <p className="mb-5 p-2 bg-[#dcdcdc] w-full sm:w-64 text-center font-bold">HSEQ - Proceso Flokzu</p>
            
            <div className="w-full relative">
                <img
                    className="w-full object-cover rounded-md"
                    src="https://lh3.googleusercontent.com/d/1L0Gshf6y8UBgAT5eG6ooIVv-4LzGvchK"
                    alt="Imagen"
                />
                <a href="https://app.flokzu.com/public/039e4LACTCI">
                    <button
                        className="mt-4 w-full bg-blue-500 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-blue-600 md:absolute md:bottom-4 md:right-4 md:w-auto md:mt-0"
                    >
                        Realizar Formulario
                    </button>
                </a>
            </div>
        </div>
    )
}