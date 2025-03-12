<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class KpiCategory extends Model
{
    use HasFactory;

    protected $fillable = ['category'];

    public function kpi() : HasMany
    {
        return $this->hasMany(KpiReport::class, 'category_id');
    }
}
