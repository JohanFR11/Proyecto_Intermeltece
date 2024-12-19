<?php

namespace App\Http\Controllers\Auth;

use App\Models\User;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Providers\RouteServiceProvider;
use Illuminate\Support\Facades\Auth;
use Laravel\Socialite\Facades\Socialite;
use App\Jobs\SendUserNotification;
use App\Notifications\UserCreate;
use Illuminate\Support\Facades\Notification;
use Google_Client;

class GoogleAuthenticationController extends Controller
{
    public function AuthCallback()
    {
        $admins = User::whereHas('roles', function ($query) {
            $query->where('id', 'Administrador')->orWhere('name', 'Super Administrador');
        })->get();
        
        $user = Socialite::driver('google')->user();

        $validDomain = '@meltec.com.co';
        if (!str_ends_with($user->email, $validDomain)) {
            // Si el correo no pertenece al dominio de la empresa, rechazar el inicio de sesión
            return redirect()->route('login')->withErrors(['email' => 'Este correo electrónico no está autorizado para acceder a esta aplicación.']);
        }
 
        $userExists = User::where('external_id', $user->id)->where('external_auth', 'google')->first();

        if (!$userExists) {
            $newUserByGoogleAuth = User::create([
                'name' => $user->name,
                'email' => $user->email,
                'avatar' => $user->avatar,
                'external_id' => $user->id,
                'external_auth' => 'google',
                'google_access_token' => $user->token,
                'google_refresh_token' => $user->refreshToken,
            ]);
            
            $newUserByGoogleAuth->assignRole('Administrador');
            $newUserByGoogleAuth->save();
            Auth::login($newUserByGoogleAuth);

            foreach ($admins as $admin) {
                $admin->notify(new UserCreate($newUserByGoogleAuth));
            }
            
            return redirect()->intended(RouteServiceProvider::HOME);
            
        }

        Auth::login($userExists);

        return redirect()->intended(RouteServiceProvider::HOME);
    }

    public function refreshAccessToken($refreshToken)
    {
        // Crear una instancia de Google_Client
        $client = new Google_Client();
        $client->setClientId(env('GOOGLE_ID_CLIENT'));
        $client->setClientSecret(env('GOOGLE_CLIENT_SECRET'));
        $client->setAccessType('offline'); // Para que podamos obtener el refresh_token

        // Usar el refresh_token para obtener un nuevo access_token
        $client->fetchAccessTokenWithRefreshToken($refreshToken);

        // Obtener el nuevo access_token
        return $client->getAccessToken();
    }

    // Este método se puede usar cuando el token ha expirado para obtener uno nuevo
    public function getGoogleDriveClient()
    {
        $user = Socialite::driver('google')->user();
        // Verificar si el access_token está expirado
        $client = new Google_Client();
        $client->setClientId(env('GOOGLE_ID_CLIENT'));
        $client->setClientSecret(env('GOOGLE_CLIENT_SECRET'));
        $client->setAccessType('offline'); // Asegurarse de tener el refresh_token

        // Si el access_token ha expirado, usar el refresh_token
        if ($client->isAccessTokenExpired()) {
            $newAccessToken = $this->refreshAccessToken($user->google_refresh_token);
            $user->google_access_token = $newAccessToken['access_token']; // Actualizar el access_token
            $user->save();

            // Establecer el nuevo token en el cliente
            $client->setAccessToken($newAccessToken['access_token']);
        } else {
            $client->setAccessToken($user->google_access_token); // Usar el token si no ha expirado
        }
        return $client;
    }
}
