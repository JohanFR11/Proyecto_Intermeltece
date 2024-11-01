<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Spatie\Permission\Models\Role;

class KpiReport extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = ['reportName', 'data', 'category_id'];

    protected $casts = ['data' => 'array'];

    public function roles() : BelongsToMany
    {
        return $this->belongsToMany(Role::class, 'role_has_kpis', 'UUID_kpi', 'role_id');
    }

    public function category() :BelongsTo
    {
        return $this->belongsTo(KpiCategory::class);
    }

    protected static function boot()
    {
        parent::boot();

        static::deleting(function ($kpiReport) {
        $kpiReport->roles()->detach();
        });
    }
}
