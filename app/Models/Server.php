<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Server extends Model
{
    use HasFactory;

    protected $table = 'server';

    protected $fillable = [
        'cpu_cores',
        'ram',
        'storage',
        'bandwidth',
        'os',
        'sqlcore',
        'ip',
        'rdp',
        'users_add_sql',
        'users_add_rdp'
    ];

    public function quoteServer() : HasMany
    {
        return $this->hasMany(QuoteServer::class, 'server_id');
    }
}
