<?php
namespace App\Services;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;
use Illuminate\Http\Request;


class BBDDKpis
{

    public function BBDD(){

        $dataUsers = DB::select('SELECT * FROM kpi_firma');

        return $dataUsers;

    }

}