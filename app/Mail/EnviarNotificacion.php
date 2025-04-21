<?php
namespace App\Mail;

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;
use Illuminate\Support\Facades\DB;

class EnviarNotificacion
{
    public function enviarCorreoNotificaion($area)
    {

        \Log::info("area:", ['area' => $area]);

        $email = DB::select('SELECT email_area_encargado FROM docFirmado WHERE area_auditoria = ?', [$area]);
        \Log::info("email:", ['email' => $email]);

        if (!empty($email) && is_array($email) && isset($email[0]->email_area_encargado)) {
            $email = $email[0]->email_area_encargado;
        } else {
            $email = null;
        }

        $estado = DB::select('SELECT estado_auditoria FROM docFirmado WHERE area_auditoria = ?', [$area]);
        \Log::info("estado:", ['estado' => $estado]);

        if (!empty($estado) && is_array($estado) && isset($estado[0]->estado_auditoria)) {
            $estado = $estado[0]->estado_auditoria;
        } else {
            $estado = null;
        }

        if ($estado === 1) {
            $estado = "Habilitado";
        } else {
            $estado = "Deshabilitado";
        }

        $mail = new PHPMailer(true);

        try {
            // Configuración SMTP
            $mail->isSMTP();
            $mail->Host = 'smtp.gmail.com'; // Servidor SMTP
            $mail->SMTPAuth = true;
            $mail->Username = 'transformaciondigital@meltec.com.co';
            $mail->Password = 'vjjybmvfplouihbm';
            $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
            $mail->Port = 587;

            // Configuración del correo
            $mail->setFrom('transformaciondigital@meltec.com.co', 'Intranet');
            $mail->addAddress($email);
            $mail->Subject = 'Estado de auditoria';
            $mail->isHTML(true);
            $mail->Body = "Por medio de este correo se le informa que en la pagina intranet su estado es '{$estado}' para la seccion de lista de chequos. (Si tienes alguna duda dirigirse a su superior correspondiente.)";

            $mail->send();
            return "Correo enviado a $email";
        } catch (Exception $e) {
            return "Error al enviar: {$mail->ErrorInfo}";
        }
    }
}
