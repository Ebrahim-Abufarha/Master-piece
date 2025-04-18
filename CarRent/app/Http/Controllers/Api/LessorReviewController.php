<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Review;
use App\Models\Car;
use Illuminate\Http\Request;

class LessorReviewController extends Controller
{
    public function index($lessorId)
    {
        $cars = Car::where('user_id', $lessorId)->pluck('id');

        $reviews = Review::with(['user', 'car'])
                        ->whereIn('car_id', $cars)
                        ->orderBy('created_at', 'desc')
                        ->get();

        return response()->json(['data' => $reviews]);
    }



    public function show(Review $review)
    {
        $review->load(['user', 'car']);
        return response()->json(['data' => $review]);
    }

    public function destroy(Review $review)
    {
        $review->delete();
        return response()->json(['message' => 'Review deleted successfully']);
    }
}
