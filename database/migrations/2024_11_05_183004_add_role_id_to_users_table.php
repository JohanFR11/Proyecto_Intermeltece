<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Ejecuta las migraciones.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('users', function (Blueprint $table) {
            // Crear la columna 'role_id' en la tabla 'users', como llave foránea que puede ser null
            $table->unsignedBigInteger('role_id')->nullable();

            // Definir la clave foránea que referencia a la tabla 'roles' y a la columna 'id'
            $table->foreign('role_id')->references('id')->on('roles')->onDelete('set null');
        });
    }

    /**
     * Revierte las migraciones.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('users', function (Blueprint $table) {
            // Eliminar la clave foránea
            $table->dropForeign(['role_id']);

            // Eliminar la columna 'role_id'
            $table->dropColumn('role_id');
        });
    }
};
