import React, {useEffect, useState} from "react";
import { Inertia } from "@inertiajs/inertia";

export default function FolderDropdown({ folders }) {

  const [selectedFolderId, setSelectedFolderId] = useState(
    parseInt(localStorage.getItem("selectedFolderId"), 10) || 1
  );

  const handleSelectChange = (event) => {
    const folderId = parseInt(event.target.value, 10);
    setSelectedFolderId(folderId);

    localStorage.setItem("selectedFolderId", folderId);

    Inertia.get(route("resources.hseq.filter", { folder_id: folderId }));
  };

  useEffect(() => {
    setSelectedFolderId(parseInt(localStorage.getItem("selectedFolderId"), 10) || 1);
  }, []);

  return (
    <div className="form-group">
      <label
        htmlFor="folderSelect"
        className="text-gray-700 font-medium mb-2 block"
      >
        Seleccione una Carpeta:
      </label>
      <select
        id="folderSelect"
        className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-700"
        onChange={handleSelectChange}
        value={selectedFolderId}
      >
        <option value='1' className="text-gray-400">
          Todos los archivos
        </option>
        {folders && folders.length > 0 ? (
          folders.map((folder) => (
            <option key={folder.folder_id} value={folder.folder_id} className="text-gray-700">
              {folder.name}
            </option>
          ))
        ) : (
          <option disabled className="text-gray-400">
            Cargando carpetas...
          </option>
        )}
      </select>
    </div>
  );
}
