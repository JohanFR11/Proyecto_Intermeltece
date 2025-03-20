/* import React, { useState,Suspense} from "react";
import { Input, Form } from "@heroui/react";
const InfoUser = React.lazy(() => import("../Fragments/InfoKpis"));
import { motion } from "framer-motion";


export default function InputEmail({refreshAccessToken, name}) {
    const [idUser, setIDUser] = useState("");
    const [loading, setLoading] = useState(false);

    const onSubmit = (e) => {
        e.preventDefault();

        const formData = new FormData(e.target);
        const id = formData.get("identificacion");

        setIDUser(id);
        setLoading(true);
        setTimeout(() => setLoading(false), 3000);
    };

    return (
        <div className="flex flex-col items-center justify-center text-center">
            <p className="mb-4 text-lg mt-5">Ingresa tu numero de identificacion para ver los KPI's que tienes vinculados</p>
            <Form className="w-full max-w-xs flex flex-col items-center justify-center text-center" onSubmit={onSubmit}>
                <Input
                    isRequired
                    name="identificacion"
                    errorMessage={({ validationDetails, validationErrors }) => {
                        if (validationDetails.typeMismatch) {
                            return "Por favor ingresa una identificacion válida";
                        }
                        return validationErrors;
                    }}
                    className="max-w-xs"
                    label="Identificacion"
                    type="number"
                />
                <button className="rounded-lg p-3 text-white bg-[#395181] duration-150 hover:bg-[#4c6dad]" type="submit">
                    Cargar KPI's
                </button>
            </Form>
            {idUser && (
                <Suspense fallback={<p>Cargando KPI's...</p>}>
                    <InfoUser idUser={idUser} refreshAccessToken={refreshAccessToken}/>
                </Suspense>
            )}
            {loading && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
                >
                    <div className="flex flex-col items-center">
                        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-white"></div>
                        <p className="text-white mt-2">Cargando...</p>
                    </div>
                </motion.div>
            )}
        </div>
    );
}
 */