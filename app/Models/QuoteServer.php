<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class QuoteServer extends Model
{
    use HasFactory;

    protected $table = 'quote_servers';

    protected $fillable = [
        'client_server_id',
        'server_id',
        'discount',
        'total_mounth',
        'total_amount',
        'total_year',
    ];

    public function clientServer() : BelongsTo
    {
        return $this->BelongsTo(ClientServer::class, 'client_server_id');
    }

    public function server() : BelongsTo
    {
        return $this->BelongsTo(Server::class,'server_id');
    }

}
