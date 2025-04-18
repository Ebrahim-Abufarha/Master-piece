<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Booking;
use Carbon\Carbon;

class BookingController extends Controller
{
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
            'end_date' => 'required|date',
            'total' => 'required|numeric',
            'status' => 'required|string',
        ]);

        $booking = Booking::create([
            'user_id' => $validated['user_id'],
            'car_id' => $validated['car_id'],
            'start_date' => $validated['start_date'],
            'end_date' => $validated['end_date'],
            'total' => $validated['total'],
            'status' => $validated['status'],
        ]);

        return response()->json(['message' => 'Booking created successfully', 'data' => $booking], 201);
    }
}
