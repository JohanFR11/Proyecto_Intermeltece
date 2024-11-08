import React from 'react';
import { Inertia } from '@inertiajs/inertia';

export default function FolderDropdown({ folders }) {
    
    const handleSelectChange = (event) => {
        const selectedFolderId = event.target.value;
        console.log('ID de carpeta seleccionada:',selectedFolderId);

        Inertia.get(route('resources.hseq.filter', { folder_id: selectedFolderId }));
    };

    return (
        <div className="form-group">
        <label htmlFor="folderSelect">Seleccione una Carpeta:</label>
        <select
            id="folderSelect"
            className="form-control"
            onChange={handleSelectChange}
            defaultValue=""
        >
            <option value="" disabled>-- Seleccione una Carpeta --</option>
            {folders && folders.length > 0 ? (
                folders.map((folder) => (
                    <option key={folder.id} value={folder.id}>
                        {folder.name}
                    </option>
                ))
            ) : (
                <option disabled>Cargando carpetas...</option>
            )}
        </select>
    </div>
);
}
