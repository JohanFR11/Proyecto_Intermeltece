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
        Schema::create('quote_servers', function (Blueprint $table) {
            $table->id();
            $table->foreignId('client_server_id')->nullable()->constrained(table: 'client_server', indexName: 'quote_server_client_server_id')->nullOnDelete();
            $table->foreignId('server_id')->nullable()->constrained(table: 'server', indexName: 'quote_server_server_id')->nullOnDelete();
            $table->string('discount');
            $table->string('total_mounth');
            $table->string('total_amount');
            $table->string('total_year');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('quote_servers');
    }
};
