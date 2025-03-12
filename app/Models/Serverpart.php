<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Serverpart extends Model
{
    use HasFactory;

    protected $fillable = ['product', 'description', 'usdPrice'];
}
