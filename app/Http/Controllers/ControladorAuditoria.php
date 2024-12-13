<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Illuminate\Support\Str;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;

class ControladorAuditoria extends Controller
{

    public function index()
    {
        return Inertia::render('Auditoria/Index', [
            
        ]);
    }

}