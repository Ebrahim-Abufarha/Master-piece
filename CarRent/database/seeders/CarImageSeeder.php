<?php
namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\CarImage;

class CarImageSeeder extends Seeder
{
    public function run(): void
    {
        CarImage::create([
            'car_id' => 1,
            'image_path' => 'images/car-1.jpg'
        ]);

        CarImage::create([
            'car_id' => 1,
            'image_path' => 'images/car-2.jpg'
        ]);
        CarImage::create([
            'car_id' => 1,
            'image_path' => 'images/car-1.jpg'
        ]);

        CarImage::create([
            'car_id' => 1,
            'image_path' => 'images/car-2.jpg'
        ]);
        CarImage::create([
            'car_id' => 1,
            'image_path' => 'images/car-1.jpg'
        ]);

        CarImage::create([
            'car_id' => 2,
            'image_path' => 'images/car-2.jpg'
        ]);
        CarImage::create([
            'car_id' => 3,
            'image_path' => 'images/car-1.jpg'
        ]);

        CarImage::create([
            'car_id' => 4,
            'image_path' => 'images/car-2.jpg'
        ]);
        CarImage::create([
            'car_id' => 5,
            'image_path' => 'images/car-1.jpg'
        ]);

        CarImage::create([
            'car_id' => 6,
            'image_path' => 'images/car-2.jpg'
        ]);
    }
}
