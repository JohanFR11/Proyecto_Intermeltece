<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

use App\Models\Serverpart;

class ServerPartSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Serverpart::create([
            'product' => 'CPU',
            'description' => 'Cantidad de Nucleos de CPU a dedicar',
            'usdPrice' => '7.95',
            'type_id' => 2
        ]);
        Serverpart::create([
            'product' => 'Memoria RAM',
            'description' => 'Cantidad de Memoria RAM a dedicar',
            'usdPrice' => '0.75',
            'type_id' => 2,
        ]);
        Serverpart::create([
            'product' => 'Windows Server S.O',
            'description' => 'Sistema Operativo Windows Server',
            'usdPrice' => '7.7',
            'type_id' => 4,
        ]);
        Serverpart::create([
            'product' => 'Distro Linux',
            'description' => 'Sistema Operativo Linux',
            'usdPrice' => '0',
            'type_id' => 4,
        ]);
        Serverpart::create([
            'product' => 'Internet',
            'description' => 'Ancho de Banda a dedicar',
            'usdPrice' => '2.19',
            'type_id' => 2,
        ]);
        Serverpart::create([
            'product' => 'Almacenamiento',
            'description' => 'Cantidad de Almacenamiento a dedicar',
            'usdPrice' => '0.09',
            'type_id' => 2,
        ]);
        Serverpart::create([
            'product' => 'Respaldo - Backup',
            'description' => 'Gestion de Backup de la Información',
            'usdPrice' => '0.045',
            'type_id' => 1,
        ]);
        Serverpart::create([
            'product' => 'Seguridad - Antivirus',
            'description' => 'Gestion de Seguridad e Integridad del Servidor',
            'usdPrice' => '10',
            'type_id' => 1,
        ]);
        Serverpart::create([
            'product' => 'Asistencia Tecnica',
            'description' => 'Gestion de Asistencia Tecnica Servidor',
            'usdPrice' => '15',
            'type_id' => 1,
        ]);
        Serverpart::create([
            'product' => 'SQL 2 CORE',
            'description' => 'Software Adicional SQL Server',
            'usdPrice' => '150',
            'type_id' => 3,
        ]);
        Serverpart::create([
            'product' => 'Usuario Adicional SQL 2 CORE',
            'description' => 'Usuario Adicional SQL Server',
            'usdPrice' => '17',
            'type_id' => 3,
        ]);
        Serverpart::create([
            'product' => 'RDP SPLA',
            'description' => 'Software Adicional RDP SPLA',
            'usdPrice' => '9',
            'type_id' => 3,
        ]);
        Serverpart::create([
            'product' => 'IP Publica',
            'description' => 'Ip de accceso publico',
            'usdPrice' => '6',
            'type_id' => 3,
        ]);
        Serverpart::create([
            'product' => 'Snapchot',
            'description' => 'Gestion IT',
            'usdPrice' => '2',
            'type_id' => 1,
        ]);
    }
}
