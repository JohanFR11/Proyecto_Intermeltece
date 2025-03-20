<?php
namespace App\Services;

use Barryvdh\DomPDF\Facade\Pdf;
use Intervention\Image\ImageManager;
use Intervention\Image\Drivers\Imagick\Driver as ImagickDriver;
use Intervention\Image\Encoders\JpegEncoder;
use Google\Service\Drive\DriveFile;
use Illuminate\Support\Facades\Storage;

class PdfService
{
    public function generarPDF($data, $nombreFirma, $service)
    {
        if (is_string($data)) {
            $data = json_decode($data, true);
        }

        if (is_array($data)) {
            if (!isset($data[0]) || !is_array($data[0])) {
                $data = [$data];
            }
            $data = array_filter($data, 'is_array');
        } else {
            return null;
        }

        // Construcción de las filas de la tabla
        $rows = "";
        foreach ($data as $item) {
            $identificacion = $item['identificacion_empleado'] ?? 'N/A';
            $correo = $item['correo_empleado'] ?? 'N/A';
            $nombre = $item['nombre_indicado'] ?? 'N/A';
            $descripcion = $item['descripcion_kpi'] ?? 'N/A';
            $peso = $item['peso_objetivo'] ?? 'N/A';

            $rows .= "
                <tr>
                    <td>{$identificacion}</td>
                    <td>{$correo}</td>
                    <td>{$nombre}</td>
                    <td>{$descripcion}</td>
                    <td>{$peso}</td>
                </tr>
            ";
        }

        // Procesamiento de la firma
        $rutaFirma = public_path("storage/firmas/" . basename($nombreFirma));
        $firmaBase64 = '';

        if (file_exists($rutaFirma)) {
            $manager = new ImageManager(new ImagickDriver());
            $img = $manager->read($rutaFirma)->encode(new JpegEncoder(100));
            $firmaBase64 = 'data:image/jpeg;base64,' . base64_encode($img->toString());
        } else {
            \Log::error("No se encontró la imagen de la firma: {$rutaFirma}");
        }

        // Generación del HTML del PDF
        $html = "
            <style>
                table {
                    width: 100%;
                    border-collapse: collapse;
                    font-family: Arial, sans-serif;
                    font-size: 13px;
                }
                th, td {
                    border: 1px solid #000;
                    padding: 10px;
                    text-align: center;
                }
                th {
                    background-color: #d6fdff;
                    font-weight: bold;
                }
                h1 {
                    text-align: center;
                    font-size: 16px;
                    margin-bottom: 5px;
                }
                .firma {
                    text-align: center;
                    margin-top: 20px;
                }
            </style>
            <h1>Reporte de KPI's</h1>
            <table>
                <tr>
                    <th>Identificación</th>
                    <th>Correo</th>
                    <th>Nombre Indicado</th>
                    <th>Descripción KPI</th>
                    <th>Peso Objetivo</th>
                </tr>
                {$rows}
            </table>
            <div class='firma'>
                <div>
                    <p>Firma del empleado</p>
                    " . ($firmaBase64 ? "<img src='{$firmaBase64}' width='150' />" : "<p>No hay firma disponible</p>") . "
                </div>              
            </div>
        ";

        // Creación del PDF
        $pdf = Pdf::loadHTML($html);

        $seleccionar = $data[0] ?? null;
        $nombre_superior = $seleccionar["nombre_superior"];
        $nombre_empleado = $seleccionar["nombre_empleado"];
        $identificacion = $seleccionar["identificacion_empleado"];

        // ID de la carpeta raíz en Drive donde se almacenarán las carpetas
        $carpetaRaizId = '1nf_9Sd6KNfVoO4Qu0UNUCdZmKZztv9Lp';

        // Buscar la carpeta del superior
        $folderSuperiorId = $this->buscarCarpetaEnDrive($service, $nombre_superior, $carpetaRaizId);

        if (!$folderSuperiorId) {
            // Si no existe, se crea
            $folderMetadata = new DriveFile([
                'name' => $nombre_superior,
                'mimeType' => 'application/vnd.google-apps.folder',
                'parents' => [$carpetaRaizId]
            ]);

            $folder = $service->files->create($folderMetadata, ['fields' => 'id']);
            $folderSuperiorId = $folder->id;
        }

        // Buscar la carpeta del empleado dentro de la carpeta del superior
        $folderEmpleadoId = $this->buscarCarpetaEnDrive($service, "{$nombre_empleado}_{$identificacion}", $folderSuperiorId);

        if (!$folderEmpleadoId) {
            // Si no existe, se crea
            $folderMetadata = new DriveFile([
                'name' => "{$nombre_empleado}_{$identificacion}",
                'mimeType' => 'application/vnd.google-apps.folder',
                'parents' => [$folderSuperiorId]
            ]);

            $folderEmpleado = $service->files->create($folderMetadata, ['fields' => 'id']);
            $folderEmpleadoId = $folderEmpleado->id;
        }

        // Guardar el PDF localmente
        $timestamp = date('Ymd_His');
        $filename = "reporte_{$timestamp}.pdf";
        $pdfPath = storage_path("app/public/{$filename}");
        $pdf->save($pdfPath);

        if (!file_exists($pdfPath)) {
            \Log::error("El archivo PDF no se creó: {$pdfPath}");
            return "Error: El archivo PDF no existe";
        }

        // Subir el PDF a la carpeta del empleado en Google Drive
        $fileSaveFolder = new DriveFile([
            'name' => $filename,
            'parents' => [$folderEmpleadoId],
        ]);

        $fileContent = file_get_contents($pdfPath);

        if (!$fileContent) {
            \Log::error("No se pudo leer el archivo para subirlo a Drive: {$pdfPath}");
            return "Error: No se pudo leer el archivo PDF";
        }

        $uploadFile = $service->files->create($fileSaveFolder, [
            'data' => $fileContent,
            'mimeType' => 'application/pdf',
            'uploadType' => 'multipart',
            'fields' => 'id',
        ]);

        \Log::info("Archivo PDF subido a Drive con ID: " . $uploadFile->id);

        return [
            'folder_id' => $folderEmpleadoId,
            'file_id' => $uploadFile->id,
            'filename' => $filename
        ];
    }

    private function buscarCarpetaEnDrive($service, $nombreCarpeta, $parentId)
    {

        if (!$parentId) {
            \Log::error("El parentId está vacío o incorrecto");
            return null;
        }

        $query = "name contains '{$nombreCarpeta}' and mimeType = 'application/vnd.google-apps.folder' and '{$parentId}' in parents and trashed = false";

        $results = $service->files->listFiles(['q' => $query, 'fields' => 'files(id)']);

        \Log::info("Carpetas dentro de parentId", ['folders' => $results->getFiles()]);

        $folders = $results->getFiles();

        if (!empty($folders) && isset($folders[0])) {
            return $folders[0]->getId();
        } else {
            \Log::error("No se encontraron carpetas en el parentId proporcionado.", ['parentId' => $parentId, 'nombreCarpeta' => $nombreCarpeta]);
            return null; // Manejar el error de forma adecuada
        }

    }
}

