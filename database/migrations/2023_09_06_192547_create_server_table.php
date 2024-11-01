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
        Schema::create('server', function (Blueprint $table) {
            $table->id();
            $table->string('cpu_cores');
            $table->string('ram');
            $table->string('storage');
            $table->string('bandwidth');
            $table->string('os');
            $table->string('sqlcore')->nullable();
            $table->string('ip')->nullable();
            $table->string('rdp')->nullable();
            $table->string('users_add_sql')->nullable();
            $table->string('users_add_rdp')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('server');
    }
};
