import React from "react";
import { Divider } from '@heroui/react'


export default function HSEQencuesta() {

    return (
        <div className="p-5">
            <Divider className='h-[10px]' />
            <p className="mb-5 p-2 bg-[#dcdcdc] w-full sm:w-[340px] text-center font-bold"> HSEQ - sociodemográfico y de condiciones </p>
            <div className="w-full relative">
                <img
                    className="w-full object-cover rounded-md"
                    src="https://lh3.googleusercontent.com/d/1CtQD-hCJ0T0qvZLZvyRHGn4f_BVqGsXU"
                    alt="Imagen"
                />
                <a href="https://forms.gle/twAVqi6vfvAr6TGf6">
                    <button
                        className="mt-4 w-full bg-blue-500 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-blue-600 md:absolute md:bottom-4 md:right-4 md:w-auto md:mt-0"
                    >
                        Realizar Encuesta
                    </button>
                </a>
            </div>
        </div>
    )
}