<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Inertia\Inertia;

class MoodleAuthMiddleware
{
    public function handle(Request $request, Closure $next)
    {
        if (!session('moodle_token')) {
            return redirect('/modulo');
        }
    
        return $next($request);
    }
}
