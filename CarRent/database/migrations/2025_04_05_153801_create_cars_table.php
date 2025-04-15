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
        Schema::create('cars', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('name');
            $table->string('color');
            $table->text('description');
            $table->string('location');
            $table->decimal('price_per_day', 10, 2);
            $table->decimal('price_per_month', 10, 2)->nullable();

            $table->enum('status', ['available', 'rented'])->default('available');
            $table->enum('car_type', ['Sedan', 'SUV', 'Truck', 'Van', 'Coupe', 'Convertible', 'Other'])->default('Sedan');
            $table->integer('seats')->default(4);
            $table->string('transmission')->default('Automatic');
            $table->string('fuel_type')->default('Petrol');
            $table->decimal('add', 10, 2)->nullable()->default(null);


            $table->softDeletes();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('cars');
    }
};
