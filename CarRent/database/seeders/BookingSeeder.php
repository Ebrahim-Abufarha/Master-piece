<?php
namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Booking;

class BookingSeeder extends Seeder
{
    public function run(): void
    {
        Booking::create([
            'user_id' => 3, // Renter
            'car_id' => 1,
            'start_date' => now()->addDays(1),
            'end_date' => now()->addDays(3),
            'status' => 'confirmed',
            'total' => 76.50
        ]);
    }
}
