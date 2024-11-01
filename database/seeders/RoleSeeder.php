<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class RoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $roleSuperAdmin = Role::create(['name' => 'Super Administrador']);
        $roleAdmin = Role::create(['name' => 'Administrador']);
        $roleDirector = Role::create(['name' => 'Director']);
        $roleCommon = Role::create(['name' => 'Usuario corriente']);

        Permission::create(['name' => 'directors.index'])->syncRoles([$roleAdmin, $roleDirector]);

        Permission::create(['name' => 'admin.parts.index', 'supername' => 'Ver Partes'])->assignRole($roleAdmin);
        Permission::create(['name' => 'admin.parts.create', 'supername' => 'Crear Partes'])->assignRole($roleAdmin);
        Permission::create(['name' => 'admin.parts.edit', 'supername' => 'Editar Partes'])->assignRole($roleAdmin);
        Permission::create(['name' => 'admin.parts.destroy', 'supername' => 'Borrar Partes'])->assignRole($roleAdmin);

        Permission::create(['name' => 'admin.users.index', 'supername' => 'Ver Todos los Usuarios'])->assignRole($roleAdmin);
        Permission::create(['name' => 'admin.users.edit', 'supername' => 'Editar Usuarios'])->assignRole($roleAdmin);
        Permission::create(['name' => 'admin.users.destroy', 'supername' => 'Borrar Usuarios'])->assignRole($roleAdmin);

        Permission::create(['name' => 'admin.roles.index', 'supername' => 'Ver Roles'])->assignRole($roleAdmin);
        Permission::create(['name' => 'admin.roles.create', 'supername' => 'Crear Roles'])->assignRole($roleAdmin);
        Permission::create(['name' => 'admin.roles.edit', 'supername' => 'Editar Roles'])->assignRole($roleAdmin);

        Permission::create(['name' => 'admin.token.create', 'supername' => 'Crear Tokens de Acceso'])->assignRole($roleAdmin);
    }
}
