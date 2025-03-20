<?php
namespace App\Mail;

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;
use Illuminate\Support\Facades\Storage;

class CorreoKpisFirmadoSuperior {
    public function enviarCorreoSuperior($email,$pdfPath,$nombre_em) {
        $mail = new PHPMailer(true);

        try {
            // Configuración SMTP
            $mail->isSMTP();
            $mail->Host       = 'smtp.gmail.com'; // Servidor SMTP
            $mail->SMTPAuth   = true;
            $mail->Username   = 'transformaciondigital@meltec.com.co';
            $mail->Password   = 'vjjybmvfplouihbm';
            $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
            $mail->Port       = 587;

            // Configuración del correo
            $mail->setFrom('transformaciondigital@meltec.com.co', 'Intranet');
            $mail->addAddress($email);
            $mail->Subject = 'Kpi Firmado';
            $mail->Body    = "Adjunto encontraras el Kpi de {$nombre_em} con sus dos firmas correspondientes.";

            // Adjuntar PDF
            $mail->addAttachment(realpath(storage_path("app/public/{$pdfPath}")));            

            $mail->send();
            return "Correo enviado a $email";
        } catch (Exception $e) {
            return "Error al enviar: {$mail->ErrorInfo}";
        }
    }
}
