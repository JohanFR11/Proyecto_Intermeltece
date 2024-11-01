<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;

class NotificationController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke()
    {
        return Inertia::render('Notifications', [
            'notification' => auth()->user()->unreadNotifications()->latest()->paginate() 
        ]);
    }
}
