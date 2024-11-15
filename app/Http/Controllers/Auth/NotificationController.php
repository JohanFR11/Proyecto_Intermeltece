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
        $notifications = auth()->user()->unreadNotifications()->latest()->get()->map(function ($notification) {
            return [
                'id' => $notification->id,
                'type' => $notification->type,
                'data' => $notification->data, // Verifica que aquí esté la información correcta
                'created_at' => $notification->created_at->format('Y-m-d H:i:s'),
            ];
        });

        return Inertia::render('Notifications', [
            'notification' => $notifications,
        ]);
    }
}
