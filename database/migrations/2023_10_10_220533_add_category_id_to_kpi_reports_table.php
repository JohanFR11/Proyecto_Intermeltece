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
        Schema::table('kpi_reports', function (Blueprint $table) {
            $column = $table->unsignedBigInteger('category_id');

            if($column) {
                $table->foreign('category_id')->references('id')->on('kpi_categories');
            }

        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('kpi_reports', function (Blueprint $table) {
            //
        });
    }
};
