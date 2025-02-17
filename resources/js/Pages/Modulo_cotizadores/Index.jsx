import React from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { ZebraIcon, UlefonIcon } from '@/Components/icons/Icons'

const Index = ({ auth, unreadNotifications }) => {
    return (
        <AuthenticatedLayout
            auth={auth}
            unreadNotifications={unreadNotifications}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">Modulo de Cotizadores</h2>
            }
        >
            <div className="bg-white mt-4 mb-4 ml-4 mr-4 p-5 rounded-sm">
                <div className="flex flex-col sm:flex-row items-center justify-center">
                    <a href={route('ulefone.index')}> 
                        <div className="flex flex-col justify-center p-5 m-10 rounded-3xl border border-black/15 shadow-md shadow-gray-600 text-center transform duration-300 hover:scale-85">
                            <UlefonIcon size='250px' color='#FFC600' />
                            <p className="mt-3 text-xl">Cotizador Ulefone</p>
                        </div>
                    </a>
                    <a href={route('zebra.index')}>
                        <div className="flex flex-col item-center p-5 justify-center rounded-3xl border border-black/15 shadow-md shadow-gray-600 text-center transform duration-300 hover:scale-85">
                            <ZebraIcon size='250px' color='#000000' />
                            <p className="mt-3 text-xl">Cotizador Zebra</p>
                        </div>
                    </a>
                </div>
            </div>
        </AuthenticatedLayout>
    )
}

export default Index;