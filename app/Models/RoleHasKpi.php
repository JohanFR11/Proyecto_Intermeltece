<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RoleHasKpi extends Model
{
    use HasFactory;

    protected $table = 'role_has_kpis';

    protected $fillable = ['UUID_kpi', 'role_id'];

    public $timestamps = false;
}
