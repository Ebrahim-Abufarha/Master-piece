<?php
namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Favorite;

class FavoriteSeeder extends Seeder
{
    public function run(): void
    {
        Favorite::create([
            'user_id' => 3,
            'car_id' => 1
        ]);
    }
}
