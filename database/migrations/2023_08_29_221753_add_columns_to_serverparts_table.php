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
        Schema::table('serverparts', function (Blueprint $table) {
            $table->unsignedBigInteger('type_id');

            if(Schema::hasTable('type_part_server')) {
                $table->foreign('type_id')->references('id')->on('type_part_server');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('serverparts', function (Blueprint $table) {
            //
        });
    }
};
