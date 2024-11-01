<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

use App\Models\TypePartServer;

class TypePartSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        TypePartServer::create([
            'type' => 'Obligatorios'
        ]);
        TypePartServer::create([
            'type' => 'Modificables'
        ]);
        TypePartServer::create([
            'type' => 'Adicionales'
        ]);
        TypePartServer::create([
            'type' => 'S.O'
        ]);
    }
}
