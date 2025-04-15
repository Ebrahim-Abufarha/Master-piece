<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Car;

class CarSeeder extends Seeder
{
    public function run(): void
    {
        Car::create([
            'user_id' => 2, // Lessor
            'name' => 'Toyota Corolla 2022',
            'color' => 'black',
            'description' => 'مريحة واقتصادية، مناسبة للرحلات الطويلة.',
            'location' => 'Amman, Jordan',
            'price_per_day' => 25.50,
            'price_per_month' => 300.00,

            'status' => 'available',
            'car_type' => 'Sedan',
            'seats' => 5,
            'transmission' => 'Automatic',
            'fuel_type' => 'Petrol'
        ]);

        Car::create([
            'user_id' => 2, // Lessor
            'name' => 'Honda Civic 2021',
            'color' => 'black',
            'description' => 'سيارة مدمجة وعملية، توفر أداء ممتاز.',
            'location' => 'Amman, Jordan',
            'price_per_day' => 30.00,
            'price_per_month' => 300.00,
            'status' => 'available',
            'car_type' => 'Sedan',
            'seats' => 5,
            'transmission' => 'Manual',
            'fuel_type' => 'Petrol'
        ]);

        Car::create([
            'user_id' => 2, // Lessor
            'name' => 'BMW X5 2020',
            'color' => 'black',
            'description' => 'سيارة فاخرة، مريحة مع تقنيات حديثة.',
            'location' => 'Amman, Jordan',
            'price_per_day' => 100.00,
            'price_per_month' => 300.00,
            'status' => 'rented',
            'car_type' => 'SUV',
            'seats' => 7,
            'transmission' => 'Automatic',
            'fuel_type' => 'Diesel'
        ]);

        Car::create([
            'user_id' => 2, // Lessor
            'name' => 'Mercedes Benz S-Class 2022',
            'color' => 'black',
            'description' => 'أداء فائق وفخامة في كل زاوية.',
            'location' => 'Amman, Jordan',
            'price_per_day' => 150.00,
            'price_per_month' => 300.00,
            'status' => 'available',
            'car_type' => 'Coupe',
            'seats' => 4,
            'transmission' => 'Automatic',
            'fuel_type' => 'Petrol'
        ]);

        Car::create([
            'user_id' => 2, // Lessor
            'name' => 'Ford Mustang 2022',
            'color' => 'black',
            'description' => 'سيارة رياضية بتصميم مذهل وأداء قوي.',
            'location' => 'Amman, Jordan',
            'price_per_day' => 80.00,
            'price_per_month' => 300.00,
            'status' => 'available',
            'car_type' => 'Convertible',
            'seats' => 4,
            'transmission' => 'Automatic',
            'fuel_type' => 'Petrol'
        ]);

        Car::create([
            'user_id' => 2,
            'name' => 'Nissan Altima 2020',
            'color' => 'black',
            'description' => 'سيارة متوسطة الحجم، اقتصادية ومريحة.',
            'location' => 'Amman, Jordan',
            'price_per_day' => 35.00,
            'price_per_month' => 300.00,
            'status' => 'available',
            'car_type' => 'Sedan',
            'seats' => 5,
            'transmission' => 'Automatic',
            'fuel_type' => 'Petrol'
        ]);

        Car::create([
            'user_id' => 2,
            'name' => 'Chevrolet Tahoe 2021',
            'color' => 'black',
            'description' => 'سيارة دفع رباعي كبيرة وقوية.',
            'location' => 'Amman, Jordan',
            'price_per_day' => 95.00,
            'price_per_month' => 300.00,
            'status' => 'rented',
            'car_type' => 'SUV',
            'seats' => 7,
            'transmission' => 'Automatic',
            'fuel_type' => 'Petrol'
        ]);

        Car::create([
            'user_id' => 2,
            'name' => 'Audi Q7 2021',
            'color' => 'black',
            'description' => 'سيارة فاخرة وديناميكية مع مساحة كبيرة.',
            'location' => 'Amman, Jordan',
            'price_per_day' => 120.00,
            'price_per_month' => 300.00,
            'status' => 'available',
            'car_type' => 'SUV',
            'seats' => 7,
            'transmission' => 'Automatic',
            'fuel_type' => 'Diesel'
        ]);

        Car::create([
            'user_id' => 2,
            'name' => 'Kia Sorento 2020',
            'color' => 'black',
            'description' => 'سيارة عائلية فسيحة ومريحة.',
            'location' => 'Amman, Jordan',
            'price_per_day' => 50.00,
            'price_per_month' => 300.00,
            'status' => 'available',
            'car_type' => 'SUV',
            'seats' => 7,
            'transmission' => 'Automatic',
            'fuel_type' => 'Petrol'
        ]);

        Car::create([
            'user_id' => 2,
            'name' => 'Hyundai Tucson 2022',
            'color' => 'black',
            'description' => 'سيارة عائلية اقتصادية مع تصميم عصري.',
            'location' => 'Amman, Jordan',
            'price_per_day' => 55.00,
            'price_per_month' => 300.00,
            'status' => 'available',
            'car_type' => 'SUV',
            'seats' => 5,
            'transmission' => 'Automatic',
            'fuel_type' => 'Petrol'
        ]);

        Car::create([
            'user_id' => 2,
            'name' => 'Tesla Model X 2022',
            'color' => 'black',
            'description' => 'سيارة كهربائية فاخرة مع تقنيات حديثة.',
            'location' => 'Amman, Jordan',
            'price_per_day' => 200.00,
            'price_per_month' => 300.00,
            'status' => 'rented',
            'car_type' => 'SUV',
            'seats' => 7,
            'transmission' => 'Automatic',
            'fuel_type' => 'Electric'
        ]);

        Car::create([
            'user_id' => 2,
            'name' => 'Toyota RAV4 2020',
            'color' => 'black',
            'description' => 'سيارة دفع رباعي موثوقة ومريحة.',
            'location' => 'Amman, Jordan',
            'price_per_day' => 70.00,
            'price_per_month' => 300.00,
            'status' => 'available',
            'car_type' => 'SUV',
            'seats' => 5,
            'transmission' => 'Automatic',
            'fuel_type' => 'Petrol'
        ]);

        Car::create([
            'user_id' => 2,
            'name' => 'Mazda CX-5 2021',
            'color' => 'black',
            'description' => 'سيارة دفع رباعي مدمجة مع أداء رائع.',
            'location' => 'Amman, Jordan',
            'price_per_day' => 65.00,
            'price_per_month' => 300.00,
            'status' => 'available',
            'car_type' => 'SUV',
            'seats' => 5,
            'transmission' => 'Automatic',
            'fuel_type' => 'Petrol'
        ]);

        Car::create([
            'user_id' => 2,
            'name' => 'Ford F-150 2020',
            'color' => 'black',
            'description' => 'شاحنة بيك أب قوية ومثالية للمهام الثقيلة.',
            'location' => 'Amman, Jordan',
            'price_per_day' => 110.00,
            'price_per_month' => 300.00,
            'status' => 'rented',
            'car_type' => 'Truck',
            'seats' => 5,
            'transmission' => 'Automatic',
            'fuel_type' => 'Diesel'
        ]);

        Car::create([
            'user_id' => 2,
            'name' => 'Ram 1500 2021',
            'color' => 'red',
            'description' => 'شاحنة بيك أب قوية مع أداء استثنائي.',
            'location' => 'Amman, Jordan',
            'price_per_day' => 120.00,
            'price_per_month' => 300.00,
            'status' => 'available',
            'car_type' => 'Truck',
            'seats' => 5,
            'transmission' => 'Automatic',
            'fuel_type' => 'Diesel'
        ]);

        Car::create([
            'user_id' => 2,
            'name' => 'GMC Sierra 2020',
            'color' => 'black',
            'description' => 'شاحنة بيك أب متينة مع تصميم عصري.',
            'location' => 'Amman, Jordan',
            'price_per_day' => 130.00,
            'price_per_month' => 300.00,
            'status' => 'available',
            'car_type' => 'Truck',
            'seats' => 5,
            'transmission' => 'Automatic',
            'fuel_type' => 'Diesel'
        ]);

        Car::create([
            'user_id' => 2,
            'name' => 'Toyota Land Cruiser 2021',
            'color' => 'black',
            'description' => 'سيارة دفع رباعي فاخرة وقوية.',
            'location' => 'Amman, Jordan',
            'price_per_day' => 150.00,
            'price_per_month' => 300.00,
            'status' => 'available',
            'car_type' => 'SUV',
            'seats' => 7,
            'transmission' => 'Automatic',
            'fuel_type' => 'Petrol'
        ]);

        Car::create([
            'user_id' => 2,
            'name' => 'Land Rover Defender 2022',
            'color' => 'black',
            'description' => 'سيارة فاخرة وعملية مع قدرة على الطرق الوعرة.',
            'location' => 'Amman, Jordan',
            'price_per_day' => 180.00,
            'price_per_month' => 300.00,
            'status' => 'available',
            'car_type' => 'SUV',
            'seats' => 7,
            'transmission' => 'Automatic',
            'fuel_type' => 'Diesel'
        ]);
    }
}
