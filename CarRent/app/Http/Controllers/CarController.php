<?php

namespace App\Http\Controllers;

use App\Models\Car;
use Illuminate\Http\Request;

class CarController extends Controller
{
    public function index()
    {
        $cars = Car::with('images','Lessor')->get();

        return response()->json($cars);
    }


    public function show($id)
    {
        $car = Car::with('images','Lessor')->find($id);

        if ($car) {
            return response()->json($car);
        } else {
            return response()->json(['message' => 'Car not found'], 404);
        }
    }

    public function carsWithAds()
{
    $cars = Car::whereNotNull('add')->with('images')->get();

    return response()->json($cars);
}
}
