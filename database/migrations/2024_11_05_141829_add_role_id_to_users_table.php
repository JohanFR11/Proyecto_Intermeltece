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
            // Agregar la columna role_id con valor por defecto 4
            $table->unsignedBigInteger('role_id')->default(4)->nullable();

            // Agregar la clave foránea que referencia a la tabla roles
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
            // Eliminar la clave foránea y la columna role_id
            $table->dropForeign(['role_id']);
            $table->dropColumn('role_id');
        });
    }
};
