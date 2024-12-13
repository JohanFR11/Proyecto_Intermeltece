import React from "react";
import { Head } from '@inertiajs/react'
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import DocumentoAuditoria from "./Fragments/DocAuditoria";

export default function Index({ auth, unreadNotifications })
{
return(
    <AuthenticatedLayout auth={auth}
    unreadNotifications={unreadNotifications}
    header={<h2 className='font-semibold text-xl text-gray-800 leading-tight'>Documentos de Auditoria</h2>}>
        <Head title='Documentos Auditoria' />

        <DocumentoAuditoria/>

    </AuthenticatedLayout>
)
}