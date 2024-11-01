<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class LogSapApi extends Model
{
    use HasFactory;

    protected $connection = 'logs';

    protected $fillable = ['type_phase', 'request', 'response', 'code', 'uuid_sap'];
}
