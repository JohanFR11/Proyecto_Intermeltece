<?php

namespace App\Jobs;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldBeUnique;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Carbon\Carbon;

class UpdateRankingJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /**
     * Ejecutar el Job.
     */
    public function handle()
    {
        try {
            // Establecer la zona horaria de Colombia
            date_default_timezone_set('America/Bogota');

            // Obtener la fecha actual en formato YYYY-MM-DD
            $hoy = date('Y-m-d\T00:00:00'); 

            DB::table('ranking')->whereDate('fecha', $hoy)->delete();
            Log::info("Datos eliminados de la tabla ranking para la fecha: {$hoy}");

            $CREDENTIALS = [
                'url' => 'https://my345513.sapbydesign.com/',
                'auth' => [
                    'username' => 'SEIDORFUNCIONAL',
                    'password' => 'S31d0r*2o24_',
                ]
            ]; 

            $fecha = date('Y-m-d\T00:00:00'); 

            $url = $CREDENTIALS['url'] . 'sap/byd/odata/ana_businessanalytics_analytics.svc/RPCRMCIVIB_MQ0001QueryResults?$select=TIP_SAL_EMP,CDOC_INV_DATE,KCNT_REVENUE&$top=99999&$format=json&$filter=(CDOC_INV_DATE%20ge%20datetime%27' . $fecha . '%27)';          

            $ch = curl_init($url);
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
            curl_setopt($ch, CURLOPT_HTTPAUTH, CURLAUTH_BASIC);
            curl_setopt($ch, CURLOPT_USERPWD, $CREDENTIALS['auth']['username'] . ':' . $CREDENTIALS['auth']['password']);
            curl_setopt($ch, CURLOPT_HTTPHEADER, [
                'Accept: application/json',
                'Content-Type: application/json'
            ]);

            $response = curl_exec($ch);
            if (curl_errno($ch)) {
                Log::error('Error en la API SAP: ' . curl_error($ch));
                curl_close($ch);
                return;
            }
            curl_close($ch);

            $odataRanking = json_decode($response, true);
            if (!isset($odataRanking['d']['results'])) {
                Log::error('Formato incorrecto de respuesta SAP.');
                return;
            }

            Log::info($odataRanking);

            if (!$odataRanking) {
                Log::info('No se encuentran datos.');
            } else {
                foreach ($odataRanking['d']['results'] as $item) {
                    if (isset($item['TIP_SAL_EMP'], $item['KCNT_REVENUE'], $item['CDOC_INV_DATE'])) {
                        preg_match('/\/Date\((\d+)\)\//', $item['CDOC_INV_DATE'], $matches);
                
                        $timestamp = isset($matches[1]) ? (int) $matches[1] / 1000 : null;
                
                        Log::info('Marches', ['maches' => $matches]);
                        Log::info('timesap', ['time' => $timestamp]);
                
                        if ($timestamp) {
                            // Crear la fecha directamente en UTC sin cambiar la zona horaria
                            $fechaFormateada = Carbon::createFromTimestamp($timestamp, 'UTC')->format('Y-m-d');
                
                            Log::info('Fecha formateada', ['fecha' => $fechaFormateada]);
                
                            // Insertar en la base de datos
                            DB::insert('INSERT INTO ranking (responsable, valor_net, fecha) VALUES (?, ?, ?)', [
                                $item['TIP_SAL_EMP'],
                                $item['KCNT_REVENUE'],
                                $fechaFormateada
                            ]);
                        } else {
                            Log::error('No se pudo extraer un timestamp válido');
                        }
                    }
                }
                Log::info('Datos insertados correctamente en ranking.');
            }

        } catch (\Exception $e) {
            Log::error('Error en UpdateRankingJob: ' . $e->getMessage());
        }
    }
}
