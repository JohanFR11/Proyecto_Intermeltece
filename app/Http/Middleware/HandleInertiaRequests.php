<?php

namespace App\Http\Middleware;

use Inertia\Middleware;
use App\Models\KpiReport;
use Tightenco\Ziggy\Ziggy;
use App\Models\KpiCategory;
use Illuminate\Http\Request;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): string|null
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        $notifications = 0;
        if ($request->user()) {
            $notifications = $request->user()->unreadNotifications()->count();
        }





        return array_merge(parent::share($request), [
            'auth' => [
                'user' => $request->user(),
                'userRole' => $request->user() ? $request->user()->roles->pluck('name') : [],
                'userPermissions' => $request->user() ? $request->user()->getPermissionsViaRoles()->pluck('name') : [],
                'permissions' => $request->user() ? $request->user()->getPermissionNames() : [],
            ],
            'ziggy' => function () use ($request) {
                if(!$request->user()) {
                    return redirect('/login');
                }
                $user_id = $request->user()->roles[0]->id;

                $reports = KpiCategory::with(['kpi' => function ($query) use ($user_id) {
                    $query->whereHas('roles', function ($subQuery) use ($user_id) {
                        $subQuery->where('role_id', $user_id);
                    });
                }])->get();

                return array_merge((new Ziggy)->toArray(), [
                    'location' => $request->url(),
                    'kpis' => $reports,
                ]);
            },
            'unreadNotifications' => $notifications,
            'csrfToken' => csrf_token()
        ]);
    }
}
