<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class MoodleProxy
{
    public function handle(Request $request, Closure $next)
    {
        header("Access-Control-Allow-Origin: https://fleet-cub-able.ngrok-free.app");
        header("Access-Control-Allow-Credentials: true");
        return $next($request);
    }
}
