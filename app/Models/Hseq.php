<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Hseq extends Model
{
    use HasFactory;

    protected $fillable = ['hseqFilename', 'filename', 'category'];

    public function folder()
    {
        return $this->belongsTo(Folder::class, 'category', 'folder_id');
    }
}
