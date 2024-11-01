<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Exception;
use Illuminate\Http\Request;
use Spatie\Permission\Models\Permission;

class PermissionsStoreController extends Controller
{
    public function __invoke(Request $request)
    {
        try {
            $this->validate($request, ['permission' => 'required', 'name' => 'required']);
            $permission = Permission::create(['name' => $request->input('permission'), 'supername' => $request->input('name') ,'guard_name' => 'web']);

            if (!$permission) {
                throw new Exception('Error al crear el permiso, intentelo mas tarde', 500);
            }

            return to_route('admin.rols.index');
        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
                'code' => $e->getCode()
            ], 500);
        }
    }
}
