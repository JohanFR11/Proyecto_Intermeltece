<?php

namespace App\Jobs;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Notification;
use App\Notifications\UserCreate;

class SendUserNotification implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    protected $admins;
    protected $newUserByGoogleAuth;

    /**
     * Crea una nueva instancia del Job.
     *
     * @param \Illuminate\Support\Collection $admins
     * @param \App\Models\User $newUserByGoogleAuth
     */
    public function __construct($admins, $newUserByGoogleAuth)
    {
        $this->admins = $admins;
        $this->newUserByGoogleAuth = $newUserByGoogleAuth;
    }
    
    /**
     * Maneja el Job para enviar la notificación.
     */
    public function handle()
    {
        Notification::send($this->admins, new UserCreate($this->newUserByGoogleAuth));
    }
}
