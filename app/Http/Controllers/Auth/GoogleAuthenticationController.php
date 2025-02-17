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

class GoogleAuthenticationController extends Controller
{
    public function AuthCallback()
    {
        $admins = User::whereHas('roles', function ($query) {
            $query->where('name', 'Administrador')->orWhere('name', 'Super Administrador');
        })->get();
        
        $user = Socialite::driver('google')->user();
        
        $validDomain = '@meltec.com.co';
        if (!str_ends_with($user->email, $validDomain)) {
            // Si el correo no pertenece al dominio de la empresa, rechazar el inicio de sesi贸n
            return redirect()->route('login')->withErrors(['email' => 'Este correo electr贸nico no est谩 autorizado para acceder a esta aplicaci贸n.']);
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

            $newUserByGoogleAuth->assignRole('Usuario corriente');
            $newUserByGoogleAuth->save();
            Auth::login($newUserByGoogleAuth);

            foreach ($admins as $admin) {
            $admin->notify(new UserCreate($newUserByGoogleAuth));
            }

            return redirect()->intended(RouteServiceProvider::HOME);
        }

        Auth::login($userExists);

        return redirect()->intended(RouteServiceProvider::HomeDes);
    }

    public function RegisterGoogleCallback ()
    {
        
    }
}
