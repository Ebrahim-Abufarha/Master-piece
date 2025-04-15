<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;

class UserSeeder extends Seeder
{
    public function run()
    {
        User::create([
            'name' => 'Admin',
            'email' => 'admin@example.com',
            'password' => bcrypt('password'), // تأكد من تشفير كلمة المرور
            'role' => 'admin',
            'image' => 'images/user/user.bmp',
            'address' => 'Some Address',
            'phone' => '1234567890',
        ]);

        User::create([
            'name' => 'Lessor',
            'email' => 'lessor@example.com',
            'password' => bcrypt('password'),
            'role' => 'lessor',
            'image' => 'images/user/user.bmp',
            'address' => 'Some Address',
            'phone' => '0987654321',
        ]);

        User::create([
            'name' => 'Renter',
            'email' => 'renter@example.com',
            'password' => bcrypt('password'),
            'role' => 'renter',
            'image' => 'images/user/user.bmp',
            'address' => 'Some Address',
            'phone' => '1122334455',
        ]);
    }
}
