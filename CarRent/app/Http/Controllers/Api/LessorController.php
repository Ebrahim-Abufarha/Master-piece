<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Car;
use Illuminate\Http\Request;

class LessorController extends Controller
{
    public function show($id)
    {
        try {
            $lessor = User::where('id', $id)
                        ->where('role', 'lessor')
                        ->firstOrFail();

            return response()->json([
                'success' => true,
                'data' => $lessor
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Lessor not found'
            ], 404);
        }
    }

    public function cars($id)
    {
        try {
            $cars = Car::with('images')
                     ->where('user_id', $id)
                    //  ->whereHas('user', function($query) {
                    //      $query->where('role', 'lessor');
                    //  })
                     ->get();

            return response()->json([
                'success' => true,
                'data' => $cars
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error fetching cars'
            ], 500);
        }
    }
}
