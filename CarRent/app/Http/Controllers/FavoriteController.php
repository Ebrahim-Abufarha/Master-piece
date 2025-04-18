<?php

namespace App\Http\Controllers;

use App\Models\Favorite;
use App\Models\Car;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class FavoriteController extends Controller
{
    public function index(Request $request)
    {
        $favorites = Favorite::with(['car.images'])
            ->where('user_id', $request->id)
            ->get();

        return response()->json([
            'data' => $favorites,
            'message' => 'Favorite cars retrieved successfully'
        ]);
    }
    public function store(Request $request)
{
    // التحقق من أن car_id و user_id موجودين في الـ request
    $request->validate([
        'car_id' => 'required|exists:cars,id',  // التحقق من أن car_id موجود في جدول السيارات
        'user_id' => 'required|exists:users,id', // التحقق من أن user_id موجود في جدول المستخدمين
    ]);

    // إضافة السيارة إلى المفضلة
    $favorite = Favorite::firstOrCreate([
        'user_id' => $request->user_id,
        'car_id' => $request->car_id,
    ]);

    return response()->json(['message' => 'successfully'], 201);
}


    public function destroy($carId,Request $request)
    {

        $favorite = Favorite::where('user_id', $request->id)
            ->where('car_id', $carId)
            ->first();

        if (!$favorite) {
            return response()->json([
                'message' => 'Favorite not found'
            ], 404);
        }

        $favorite->delete();

        return response()->json([
            'message' => 'Car removed from favorites successfully'
        ]);
    }
}
