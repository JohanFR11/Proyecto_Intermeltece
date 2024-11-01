<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class MarkReadNotificationController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(String $id)
    {
        if($id) {
            auth()->user()->notifications->where('id', $id)->markAsRead();
        }
        return back();
    }
}
