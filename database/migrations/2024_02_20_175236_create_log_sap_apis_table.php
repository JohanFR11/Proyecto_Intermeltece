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
        Schema::connection('logs')->create('log_sap_apis', function (Blueprint $table) {
            $table->id();
            $table->string('type_phase');
            $table->json('request');
            $table->json('response');
            $table->string('code');
            $table->string('uuid_sap');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('log_sap_apis');
    }
};
