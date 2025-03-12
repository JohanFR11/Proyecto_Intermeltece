<?php

namespace App\Mail;


use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class EstadoCompleto extends Mailable
{
    use Queueable, SerializesModels;

    public $data;

    public function __construct($data)
    {
        $this -> data = $data;
    }

    public function build()
    {
        return $this->from(env('MAIL_FROM_ADDRESS'), env('MAIL_FROM_NAME'))->view('estadocompleto')->subject('Estado de Auditoria')->with($this->data);
    }

}


