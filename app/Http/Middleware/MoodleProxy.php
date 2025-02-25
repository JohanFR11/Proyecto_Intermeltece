<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class MoodleProxy
{
    public function handle(Request $request, Closure $next)
    {
        header("Access-Control-Allow-Origin: http://127.0.0.1:8000");
        header("Access-Control-Allow-Credentials: true");
        return $next($request);
    }
}
