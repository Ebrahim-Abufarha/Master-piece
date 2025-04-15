<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Notification;

class NotificationSeeder extends Seeder
{
    public function run()
    {
        Notification::create([
            'notifiable_type' => 'App\Models\User', // المستخدم المستفيد من الإشعار
            'notifiable_id' => 3,
            'title' => 'Booking Confirmed',
            'message' => 'Your booking has been confirmed. Enjoy your ride!',
            'is_read' => false,
        ]);
    }
}
