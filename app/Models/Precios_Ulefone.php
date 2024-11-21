<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

class Precios_Ulefone extends Model
{   
    protected $connection = 'sqlsrv';

    protected $table = 'PRECIOS_ULEFONE';
}
