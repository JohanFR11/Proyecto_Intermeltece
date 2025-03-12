<?php

namespace App\Http\Controllers\Pdf;

use App\Http\Controllers\Controller;
use App\Models\QuoteServer;
use Illuminate\Http\Request;
use Barryvdh\DomPDF\Facade\Pdf;

// Formater Datetime
use Carbon\Carbon;

class QuoteServerReportController extends Controller
{
    /**
     * Download a quote by id
     * @param string $id 
     */
    public function __invoke(String $id)
    {
        $quotesserver = QuoteServer::with('clientServer', 'server')->where('id', $id)->first();
        // Date Formated
        $dateQuote = Carbon::parse($quotesserver->created_at)->format('d/m/Y');

        $data = ['HOLA MUNDO DESDE DATA'];
        $pdf = Pdf::loadView('reports.quotesserver', compact('data', 'quotesserver', 'dateQuote'));
        Pdf::setOptions(['dpi' => 150, 'defaultFont' => 'sans-serif']);
        return $pdf->stream('Cotizacion de Servidor # '. $id .'.pdf');
    }
}
