<?php

namespace App\Notifications;

use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\BroadcastMessage;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class UserCreate extends Notification implements ShouldBroadcast
{
    public $user;

    /**
     * Create a new notification instance.
     */
    public function __construct(User $user)
    {
        $this->user = $user;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['database', 'broadcast'];
    }

    public function toBroadcast(object $notifiable): BroadcastMessage
    {
        return new BroadcastMessage([
            'message' => $this->user->name.' Se Acaba de Registrar en la plataforma',
            'datetime' => $this->user->created_at,
        ]);
    }
    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
             'created_at' => $this->user->created_at,
             'id' => $this->user->id,
             'title' => 'Nuevo Usuario',
             'name' => $this->user->name,
             'role' => $this->user->external_auth,
             'avatar' => $this->user->avatar
        ];
    }
}
