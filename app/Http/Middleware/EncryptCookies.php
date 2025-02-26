<?php

namespace App\Http\Middleware;

use Illuminate\Cookie\Middleware\EncryptCookies as Middleware;

class EncryptCookies extends Middleware
{
    /**
     * The names of the cookies that should not be encrypted.
     *
     * @var array<int, string>
     */
    protected $except = [
        'MoodleSession', // ❌ No encriptar esta cookie
        'MOODLEID1_' // ❌ También asegúrate de que esta no se encripte
    ];
}
