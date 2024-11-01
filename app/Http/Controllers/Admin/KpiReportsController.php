<?php

namespace App\Http\Controllers\Admin;

use Exception;
use Spatie\Permission\Models\Role;
use App\Models\KpiReport;
use App\Models\RoleHasKpi;
use App\Http\Controllers\Controller;
use App\Models\KpiCategory;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class KpiReportsController extends Controller
{
    public function index()
    {
        $reports = KpiReport::paginate(10);
        $reportsData = [];

        foreach ($reports as $report) {
            $reportsData[] = [
                'id' => $report->id,
                'name' => $report->reportName,
                'roles' => $report->roles,
                'category' => $report->category
            ];
        }

        $roles = Role::all()->except(1);
        $categories = KpiCategory::all();
        return Inertia::render('Admin/Kpis/Index', [
            'reports' => $reports,
            'roles' => $roles,
            'reportsData2' => $reportsData,
            'categories' => $categories
        ]);
    }

    public function store(Request $request)
    {
        try {
            $validator = $request->validate([
                'reportName' => 'required|string',
                'urlData.data' => 'required|string',
                'roles' => 'required|array',
                'category' => 'required',
            ]);


            if (!$validator) {
                throw new Exception('Error en los campos ingresados');
            }

            $data = json_encode($request->input('urlData'));
            $kpi = new KpiReport([
                'reportName' => $request->input('reportName'),
                'data' => $data,
                'category_id' => $request->input('category'),
            ]);

            $saveKpi = $kpi->save();

            foreach ($request->roles as $role) {
                $kpiId = $kpi->id;

                $rolesKpi = new RoleHasKpi([
                    'UUID_kpi' => $kpiId,
                    'role_id' => $role,
                ]);

                $rolesKpi->save();
            }

            if (!$saveKpi) throw new Exception('Error en almacenar el KPI');

            return response()->json(['message' => 'Kpi almacenado Correctamente'], 201);
        } catch (Exception $e) {
            return response()->json(['error' => $e->getMessage()], 400);
        }
        dd($request->all());
    }

    public function show(String $uuid)
    {
        $userRol = Auth::user()->roles->first();
        $data = KpiReport::where('id', $uuid)->first();
        $rolesReport = $data->roles;

        if (!$rolesReport->contains($userRol)) abort(403, 'Usuario no autorizado para este Informe');

        return Inertia::render('Admin/Kpis/Show', [
            'data' => $data,
            'roles' => $data->roles
        ]);
    }

    public function destroy(KpiReport $uuid)
    {
    try {
        $uuid->delete();

        return response()->json(['message' => 'Informe de KPI eliminado correctamente'], 200);
        } catch (Exception $e) {
        return response()->json(['error' => $e->getMessage()], 400);
        }
    }

}
