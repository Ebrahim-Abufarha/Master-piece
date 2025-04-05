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
            $table->foreignId('user_id')->constrained()->onDelete('cascade'); // مالك السيارة (lessor)
            $table->string('name'); // اسم السيارة أو موديلها
            $table->text('description');
            $table->string('location'); // مكان تواجد السيارة
            $table->decimal('price_per_day', 10, 2);
            $table->enum('status', ['available', 'rented'])->default('available');
            $table->enum('car_type', ['Sedan', 'SUV', 'Truck', 'Van', 'Coupe', 'Convertible', 'Other'])->default('Sedan');
            $table->integer('seats')->default(4); // عدد الركاب
            $table->string('transmission')->default('Automatic'); // نوع ناقل الحركة
            $table->string('fuel_type')->default('Petrol'); // نوع الوقود
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
