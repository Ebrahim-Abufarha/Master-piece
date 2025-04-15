<?php
namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Review;
use App\Models\Booking;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\User;


class ReviewController extends Controller
{
    // 📥 إضافة تعليق جديد
    public function store(Request $request)
    {
        $request->validate([
            'car_id' => 'required|exists:cars,id',
            'rating' => 'required|integer|min:1|max:5',
            'comment' => 'nullable|string',
            'user_id' => 'required|exists:users,id' // التحقق من أن user_id موجود في قاعدة البيانات
        ]);

        // استخدام الـ user_id الذي تم إرساله من العميل
        $user = User::find($request->user_id);

        $hasBooked = Booking::where('user_id', $user->id)
            ->where('car_id', $request->car_id)
            ->where('status', 'confirmed')
            ->exists();

        if (!$hasBooked) {
            return response()->json(['message' => 'You must book this car before leaving a review.'], 403);
        }

        $review = Review::create([
            'user_id' => $user->id,
            'car_id' => $request->car_id,
            'rating' => $request->rating,
            'comment' => $request->comment
        ]);

        return response()->json($review, 201);
    }

    // 📤 عرض تعليقات سيارة معينة
    public function index($car_id)
    {
        $reviews = Review::with('user')
            ->where('car_id', $car_id)
            ->latest()
            ->get();

        return response()->json($reviews);
    }
}
