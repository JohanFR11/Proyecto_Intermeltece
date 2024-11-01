<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PersonalAccessTokensController extends Controller
{
    public function store(Request $request)
    {
        $user = $request->user();
        $tokenName = $request->input('token');

        if (!$user) abort(403, 'Usuario no Autenticado');

        $token = $user->createToken($tokenName);

        return response()->json(['token' => $token]);
    }

    public function index(Request $request)
    {
        $user = $request->user();
        if (!$user->hasPermissionTo('admin.token.create')) {
            abort(401, 'No Autorizado');
        }
        $tokensUser = $user->tokens;

        return Inertia::render('Profile/Tokens', [
            'tokens' => $tokensUser,
        ]);
    }

    public function destroy(String $id, Request $request)
    {
        $user = $request->user();
        $token = $id;
        $deleteToken = $user->tokens()->where('id', $token)->delete();

        if($deleteToken !== 1) {
            return response()->json(['message' => 'Error al Eliminar el Token']);
        }
        return response()->json(['message' => 'Token eliminado']);
    }
}
