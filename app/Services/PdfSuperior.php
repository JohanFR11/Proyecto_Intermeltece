<?php
namespace App\Services;

use Barryvdh\DomPDF\Facade\Pdf;
use Intervention\Image\ImageManager;
use Intervention\Image\Drivers\Imagick\Driver as ImagickDriver;
use Intervention\Image\Encoders\JpegEncoder;
use Illuminate\Support\Facades\Storage;
use Google\Service\Drive\DriveFile;
use Illuminate\Support\Facades\View;

class PdfSuperior
{
    public function generarPDF($data_empleado, $firmaempleado, $firmasuperior, $id_carpeta_empleado, $service)
    {

        $data_empleado = json_decode(json_encode($data_empleado), true);

        if (is_string($data_empleado)) {
            $data_empleado = json_decode($data_empleado, true);
        }

        if (is_array($data_empleado)) {
            if (!isset($data_empleado[0]) || !is_array($data_empleado[0])) {
                $data_empleado = [$data_empleado];
            }

            $data_empleado = array_filter($data_empleado, 'is_array');
        } else {
            return null;
        }

        $rutaFirma = public_path("storage/firmas/" . basename($firmaempleado));
        $firmaBase64 = '';

        if (file_exists($rutaFirma)) {
            $manager = new ImageManager(new ImagickDriver());
            $img = $manager->read($rutaFirma)->encode(new JpegEncoder(100));
            $firmaBase64 = 'data:image/jpeg;base64,' . base64_encode($img->toString());
        } else {
            \Log::error("No se encontró la imagen de la firma: {$rutaFirma}");
        }

        $rutaFirma_superior = public_path("storage/firmasuperior/" . basename($firmasuperior));
        $firmaBase64__superior = '';

        if (file_exists($rutaFirma_superior)) {
            $manager = new ImageManager(new ImagickDriver());
            $img = $manager->read($rutaFirma_superior)->encode(new JpegEncoder(100));
            $firmaBase64__superior = 'data:image/jpeg;base64,' . base64_encode($img->toString());
        } else {
            \Log::error("No se encontró la imagen de la firma: {$rutaFirma_superior}");
        }

        $html = View::make('pdfs.reportesuperior', [
            'data' => $data_empleado,
            'firmaBase64' => $firmaBase64,
            'firmaBase64__superior' => $firmaBase64__superior,
        ])->render();

        set_time_limit(300);
        ini_set('max_execution_time', 300);
        /* Crea el folder para los archivos de cada persona  */
        $pdf = Pdf::loadHTML($html);
        $timestamp = date('Ymd_His');
        $filename = "reporte_{$timestamp}.pdf";
        $pdfPath = storage_path("app/public/{$filename}");
        $pdf->save($pdfPath);


        if (!file_exists($pdfPath)) {
            \Log::error("El archivo PDF no se creó: {$pdfPath}");
            return "Error: El archivo PDF no existe";
        }

        $query = "name contains \"reporte_\" and '{$id_carpeta_empleado}' in parents";

        $files = $service->files->listFiles([
            'q' => $query,
            'fields' => 'files(id, name)',
        ]);

        $fileId = null;

        if (!empty($files->getFiles())) {
            // Si hay un archivo existente, tomamos su ID
            $fileId = $files->getFiles()[0]->id;
            \Log::info("Se encontró un archivo existente en Drive con ID: " . $fileId);
        }

        $fileContent = file_get_contents($pdfPath);

        if (!$fileContent) {
            \Log::error("No se pudo leer el archivo para subirlo a Drive: {$pdfPath}");
            return "Error: No se pudo leer el archivo PDF";
        }

        if ($fileId) {
            // Si el archivo ya existe, lo actualizamos
            $updatedFile = $service->files->update($fileId, new DriveFile(), [
                'data' => $fileContent,
                'mimeType' => 'application/pdf',
                'uploadType' => 'multipart',
            ]);
            \Log::info("Archivo PDF actualizado en Drive con ID: " . $updatedFile->id);
        } else {
            // Si no existe, subimos uno nuevo
            $fileSaveFolder = new DriveFile([
                'name' => $filename,
                'parents' => [$id_carpeta_empleado],
            ]);

            $uploadFile = $service->files->create($fileSaveFolder, [
                'data' => $fileContent,
                'mimeType' => 'application/pdf',
                'uploadType' => 'multipart',
                'fields' => 'id',
            ]);
            \Log::info("Archivo PDF subido a Drive con ID: " . $uploadFile->id);
        }

        $imagen = "firmas/{$firmaempleado}";

        if (Storage::exists($imagen)) {
            Storage::delete($imagen);
            \Log::info("Firma eliminada: {$imagen}");
        } else {
            \Log::warning("Firma no encontrada para eliminar: {$imagen}");
        }

        $imagensuperior = "firmasuperior/{$firmasuperior}";

        if (Storage::exists($imagensuperior)) {
            Storage::delete($imagensuperior);
            \Log::info("Firma eliminada: {$imagensuperior}");
        } else {
            \Log::warning("Firma no encontrada para eliminar: {$imagensuperior}");
        }

        return [
            'folder_id' => $id_carpeta_empleado,
            'filename' => $filename
        ];
        ;
    }
}
