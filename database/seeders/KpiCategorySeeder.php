<?php

namespace Database\Seeders;

use App\Models\KpiCategory;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class KpiCategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        KpiCategory::create([
            'category' => 'Ventas'
        ]);
        KpiCategory::create([
            'category' => 'Directores'
        ]);
        KpiCategory::create([
            'category' => 'Presidencia'
        ]);
    }
}
