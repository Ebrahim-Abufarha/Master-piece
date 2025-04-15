<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Review;
use App\Models\Car;
use Illuminate\Http\Request;

class LessorReviewController extends Controller
{
    // لعرض المراجعات الخاصة بسيارات اليسور
    public function index($lessorId)
    {
        // جلب جميع السيارات التي يملكها اليسور
        $cars = Car::where('user_id', $lessorId)->pluck('id');

        // جلب المراجعات لجميع السيارات التي يمتلكها اليسور
        $reviews = Review::with(['user', 'car'])
                        ->whereIn('car_id', $cars) // تصفية المراجعات حسب السيارات الخاصة باليسور
                        ->orderBy('created_at', 'desc')
                        ->get();

        return response()->json(['data' => $reviews]);
    }



    // عرض تفاصيل مراجعة معينة
    public function show(Review $review)
    {
        $review->load(['user', 'car']);
        return response()->json(['data' => $review]);
    }

    // حذف مراجعة معينة
    public function destroy(Review $review)
    {
        $review->delete();
        return response()->json(['message' => 'Review deleted successfully']);
    }
}
