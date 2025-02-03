<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Mail;
use Illuminate\Http\Request;


class TestEmailController extends Controller
{
    public function sendTestEmail()
    {
        $data = [
            'subject' => 'Correo de prueba',
            'body' => 'Este es un correo de prueba enviado desde Laravel.',
        ];

        Mail::raw($data['body'], function($message) use ($data) {
            $message->to('jeruiz@meltec.com.co')
                    ->subject($data['subject']);
        });

        return 'Correo enviado exitosamente!';
    }
}
