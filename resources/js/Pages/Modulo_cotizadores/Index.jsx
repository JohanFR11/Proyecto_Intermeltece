import React from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { ZebraIcon, UlefonIcon } from "@/Components/icons/Icons";
import { motion } from "framer-motion";

const Index = ({ auth, unreadNotifications }) => {
    return (
        <AuthenticatedLayout
            auth={auth}
            unreadNotifications={unreadNotifications}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Módulo de Cotizadores
                </h2>
            }
        >
            <div className="bg-white mt-4 mb-4 ml-4 mr-4 p-5 rounded-sm">
                <div className="flex flex-col sm:flex-row items-center justify-center space-x-6">
                    {/* Cotizador Ulefone */}
                    <a href={route("ulefone.index")}>
                        <motion.div
                            whileHover={{
                                scale: 1.05,
                                y: -5,
                                boxShadow: "0px 10px 20px rgba(0, 0, 0, 0.2)",
                            }}
                            transition={{ duration: 0.3, ease: "easeOut" }}
                            className="flex flex-col justify-center p-5 m-5 rounded-3xl border border-black/15 shadow-md shadow-gray-600 text-center"
                        >
                            <UlefonIcon size="250px" color="#FFC600" />
                            <p className="mt-3 text-xl">Cotizador Ulefone</p>
                        </motion.div>
                    </a>

                    {/* Cotizador Zebra */}
                    <a href={route("zebra.index")}>
                        <motion.div
                            whileHover={{
                                scale: 1.05,
                                y: -5,
                                boxShadow: "0px 10px 20px rgba(0, 0, 0, 0.2)",
                            }}
                            transition={{ duration: 0.3, ease: "easeOut" }}
                            className="flex flex-col justify-center p-5 m-5 rounded-3xl border border-black/15 shadow-md shadow-gray-600 text-center"
                        >
                            <ZebraIcon size="250px" color="#000000" />
                            <p className="mt-3 text-xl">Cotizador Zebra</p>
                        </motion.div>
                    </a>
                </div>
            </div>
        </AuthenticatedLayout>
    );
};

export default Index;
