import React, {useEffect, useState} from "react";
import { Inertia } from "@inertiajs/inertia";
import { Select, SelectItem } from '@nextui-org/react';

export default function FolderDropdown({ folders }) {

  const [selectedFolderId, setSelectedFolderId] = useState(parseInt(localStorage.getItem("selectedFolderId"), 10) || 1);

  const handleSelectChange = (event) => {
    const folderId = parseInt(event.target.value, 10);
    setSelectedFolderId(folderId);
    const folderName = folders.find((folder) => folder.folder_id === parseInt(folderId))?.name || '';


    localStorage.setItem("selectedFolderId", folderId);
    localStorage.setItem("selectedFolderName", folderName);

    Inertia.get(route("resources.hseq.filter", { folder_id: folderId }));
  };

  useEffect(() => {
    setSelectedFolderId(parseInt(localStorage.getItem("selectedFolderId"), 10) || 1);
  }, []);

  return (
    <div className="flex w-full justify-center flex-wrap md:flex-nowrap gap-4">
      <Select
        id="folderSelect"
        className="max-w-xs px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-700"
        onChange={handleSelectChange}
        value={selectedFolderId}
        label='Seleccione una carpeta'
        placeholder={localStorage.getItem('selectedFolderName') || 'no ha seleccionado ninguna'}
      >
        <SelectItem key='1' className="text-gray-700">
          Todos los archivos
        </SelectItem>
        {folders && folders.length > 0 ? (
          folders.map((folder) => (
            <SelectItem key={folder.folder_id} value={folder.folder_id} className="text-gray-700">
              {folder.name}
            </SelectItem>
          ))
        ) : (
          <SelectItem disabled className="text-gray-400">
            Cargando carpetas...
          </SelectItem>
        )}
      </Select>
    </div>
  );
}
