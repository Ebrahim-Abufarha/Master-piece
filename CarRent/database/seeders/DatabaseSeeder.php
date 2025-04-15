<?php

namespace Database\Seeders;

use App\Models\CarImage;
use App\Models\Notification;
use Database\Seeders\BookingSeeder;
use Database\Seeders\CarImageSeeder;
use Database\Seeders\CarSeeder;
use Database\Seeders\FavoriteSeeder as SeedersFavoriteSeeder;
use FavoriteSeeder;
use Illuminate\Database\Seeder;
use Database\Seeders\NotificationSeeder;
use Database\Seeders\PaymentSeeder;
use Database\Seeders\ReviewSeeder;
use Database\Seeders\UserSeeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->call([
            UserSeeder::class,
            CarSeeder::class,
            CarImageSeeder::class,
            BookingSeeder::class,
            PaymentSeeder::class,
            ReviewSeeder::class,
            SeedersFavoriteSeeder::class,
            NotificationSeeder::class,

        ]);
    }

}
