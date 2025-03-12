<?php

namespace App\Http\Controllers;

use App\Models\QuoteServer;
use App\Models\Serverpart;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ServerpartController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $serverQuotes = QuoteServer::with('clientServer', 'server')->paginate(10);
        
        return Inertia::render('Parts/Index', [
            'servers' => $serverQuotes
        ]);
    }

    /**
     * Display the new Server
     */

    public function create()
    {
        $serverparts = Serverpart::all();
        $modifiableparts = Serverpart::where('type_id', '2')->get();
        $soParts = Serverpart::where('type_id', 4)->get();
        $aditionals = Serverpart::where('type_id', 3)->get();

        return Inertia::render('Parts/CreateServer', [
            'parts' => $serverparts,
            'modifiableparts' => $modifiableparts,
            'soParts' => $soParts,
            'aditionals' => $aditionals,
        ]);
    }
    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate(([
            'product' => 'require|max:50',
            'description' => 'require',
            'usdPrice' => 'require|max:10'
        ]));

        $part = new Serverpart($request->input());
        $part->save();
        return redirect('parts');
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $part = Serverpart::find($id);
        $part->fill($request->input())->saveOrFail();
        return redirect('parts');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $part = Serverpart::find($id);
        $part->delete();
        return redirect('parts');
    }
}
