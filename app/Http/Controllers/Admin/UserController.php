<?php

namespace App\Http\Controllers\Admin;

use Exception;
use App\Models\User;
use Inertia\Inertia;
use Illuminate\Http\Request;
use App\Notifications\UserEdit;
use Illuminate\Support\Facades\DB;
use Spatie\Permission\Models\Role;
use App\Http\Controllers\Controller;
use Spatie\Permission\Models\Permission;

class UserController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth');
    }
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $this->authorize('viewAny', User::class);
        $users = User::with('roles')->paginate(10);
        
        $notifications = auth()->user()->unreadNotifications;
        $roles = Role::all();
        $permissions = Permission::all();
        return Inertia::render('Admin/Users/Index', [
            'users' => $users,
            'roles' => $roles,
            'permissions' => $permissions,
            'notifications' => $notifications
        ]);
    }

    /**
     * Revoke a Permission.
     */
    public function revokePermission(Request $request)
    {
        try {
            $user = User::find($request->input('user'));
            $permission = Permission::findById($request->input('permission'), 'web');
            $user->revokePermissionTo($permission);
            return response()->json(['message' => 'Cambios Guardados'], 200);
        } catch (Exception $e) {
            return response()->json([
                'message' => $e->getMessage(),
            ], 400);
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function storePermission(Request $request)
    {
        try {
            $user = User::find($request->input('user'));
            $permission = Permission::findById($request->input('permission'), 'web');

            $user->givePermissionTo($permission->name);

            return response()->json(['message' => 'Cambios Guardados'], 200);
        } catch (Exception $e) {
            return response()->json([
                'message' => $e->getMessage(),
            ], 400);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(User $user)
    {
        $user = User::find($user);
        return Inertia::render('Admin/Users/Edit', [
            'user' => $user
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        try {
            $validateData = $this->validate($request, [
                'role' => 'required'
            ]);

            $user = User::find($id);
            if (!$user) {
                throw new Exception('No se encotro el usuario');
            }

            $updateRole = DB::table('model_has_roles')->where('model_id', $id)->update(['role_id' => $validateData['role']]);

            if (!$updateRole) {
                throw new Exception('Error al actualizar el rol del Usuario');
            }

            $user->notify(new UserEdit($updateRole));
            return to_route('admin.users.index');
        } catch (Exception $e) {
            return redirect()->back()->withErrors([
                'message' => $e->getMessage()
            ]);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
