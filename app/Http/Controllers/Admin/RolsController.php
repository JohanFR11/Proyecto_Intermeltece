<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class RolsController extends Controller
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
        $this->authorize('viewAny', Role::class);
        $permission = Permission::get();
        $roles = Role::all();
        
        return Inertia::render('Admin/Rols/Index', [
            'roles' => $roles,
            'permission' => $permission,
        ]);
    }
    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        try {
            // dd($request->all());
            $this->validate($request, ['nameRol' => 'required', 'permissions' => 'required']);
            $role = Role::create(['name' => $request->input('nameRol'), 'guard_name' => 'web']);

            if(!$role) {
                throw new Exception('Error al crear el Rol solicitado', 500);
            }

            $role->syncPermissions($request->input('permissions'));

            return to_route('admin.rols.index');
        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
                'code' => $e->getCode()
            ], $e->getCode());
        }
    }

    /**
     * Get the permissions by Role Id
     */

    public function getPermissionsByRoleId(String $roleId) 
    {
        try {
            $permissions = DB::table('role_has_permissions')->select(['permission_id', 'name' , 'supername'])->rightJoin('permissions', 'id', '=', 'permission_id')->where('role_id', $roleId)->get();
            return response()->json($permissions, 200);
        } catch (Exception $e) {
            return response()->json([
                'message' => $e->getMessage(),
            ], 500);
        }
    }
}
