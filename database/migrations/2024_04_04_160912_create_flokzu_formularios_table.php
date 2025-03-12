<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('flokzu_formularios', function (Blueprint $table) {
            $table->id();
            $table->string('identificador');
            $table->string('nombre');
            $table->string('nombre_indicador');
            $table->string('periodicidad_indicador');
            $table->string('porcentaje_indicador');
            $table->string('mes_de_cumplimiento_del_KP1');
            $table->string('año');
            $table->string('cedula');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('flokzu_formularios');
    }
};
