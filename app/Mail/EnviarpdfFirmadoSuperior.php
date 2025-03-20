<?php
namespace App\Mail;

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;
use Illuminate\Support\Facades\Storage;

class EnviarpdfFirmadoSuperior {
    public function enviarCorreo($email, $pdfPath) {

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
            $mail->Subject = 'Kpi firmado por el superior';
            $mail->Body    = 'Adjunto encontrarás tu reporte de kpis firmado por tu superior.';

            // Adjuntar PDF
            $mail->addAttachment(realpath(storage_path("app/public/{$pdfPath}")));

            $mail->send();
            return "Correo enviado a $email";
        } catch (Exception $e) {
            return "Error al enviar: {$mail->ErrorInfo}";
        }
    }
}
