<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ClientServer extends Model
{
    use HasFactory;
    
    protected $table = 'client_server';

    protected $fillable = [
        'client',
        'email_client',
        'phone',
        'identification',
    ];

    public function quoteServer() : HasMany 
    {
        return $this->hasMany(QuoteServer::class, 'client_server_id');
    }
}
