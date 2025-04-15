<?php
namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Payment;

class PaymentSeeder extends Seeder
{
    public function run(): void
    {
        Payment::create([
            'user_id' => 3,
            'booking_id' => 1,
            'amount' => 76.50,
            'payment_method' => 'Credit Card',
            'status' => 'completed'
        ]);
    }
}
