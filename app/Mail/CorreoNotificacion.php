<?php
namespace App\Mail;

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

class CorreoNotificacion {
    public function enviarCorreoSuperior($email,$nombre_em) {
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
            $mail->Subject = 'Kpi por firmar';
            $mail->isHTML(true);
            $mail->Body = "En el presente correo se le informa que usted tiene un Kpi de <b>{$nombre_em}</b> por revisión y firma.<br><br>
               Ingresa al siguiente link para realizar la acción respectiva: <a href='http://127.0.0.1:8000/superior/kpis'>Haz clic aquí</a>.";

            $mail->send();
            return "Correo enviado a $email";
        } catch (Exception $e) {
            return "Error al enviar: {$mail->ErrorInfo}";
        }
    }
}
