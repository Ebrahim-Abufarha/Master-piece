<?php

namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;

use Illuminate\Http\Request;
use App\Models\Booking;
use App\Models\Car;
use App\Models\User;
use Carbon\Carbon;

class LessorBookingController extends Controller
{
    public function getLessorBookings($lessorId)
    {
        $lessor = User::find($lessorId);

        if (!$lessor) {
            return response()->json(['message' => 'Lessor not found'], 404);
        }

        // Get all car IDs owned by this lessor
        $carIds = $lessor->cars()->pluck('id');

        // Get bookings related to these cars with user and car relationships
        $bookings = Booking::with(['user', 'car'])
                    ->whereIn('car_id', $carIds)
                    ->get();

        return response()->json($bookings);
    }


    public function getBookedDates($carId)
    {
        $bookedDates = Booking::where('car_id', $carId)
            ->select('start_date', 'end_date')
            ->get()
            ->map(function ($booking) {
                return [
                    'start_date' => Carbon::parse($booking->start_date)->toDateString(),
                    'end_date' => Carbon::parse($booking->end_date)->toDateString(),
                ];
            });

        return response()->json(['bookedDates' => $bookedDates]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'user_id' => 'required|exists:users,id',
            'car_id' => 'required|exists:cars,id',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
            'total' => 'required|numeric',
            'status' => 'required|string',
        ]);

        $booking = Booking::create($validated);

        return response()->json(['message' => 'Booking created successfully', 'data' => $booking], 201);
    }

    public function update(Request $request, $id, $lessorId)
    {
        $booking = Booking::findOrFail($id);

        if ($booking->car->user_id != $lessorId) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'start_date' => 'sometimes|date',
            'end_date' => 'sometimes|date|after_or_equal:start_date',
            'status' => 'sometimes|string',
            'total' => 'sometimes|numeric',
        ]);

        $booking->update($validated);

        return response()->json(['message' => 'Booking updated successfully', 'data' => $booking]);
    }

    public function destroy($id, $lessorId)
    {
        $booking = Booking::findOrFail($id);

        if ($booking->car->user_id != $lessorId) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $booking->delete();

        return response()->json(['message' => 'Booking deleted successfully']);
    }
}
