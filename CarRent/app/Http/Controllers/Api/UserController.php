<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Booking;
use Illuminate\Http\Request;

class UserController extends Controller
{
    public function show($id)
{
    try {
        $user = User::findOrFail($id);
        $bookings = $user->bookings()->with(['car.images'])->get();

        return response()->json([
            'success' => true,
            'data' => [
                'user' => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'role' => $user->role,
                    'image' => $user->image,
                    'address' => $user->address,
                    'phone' => $user->phone,
                    'created_at' => $user->created_at,
                    'updated_at' => $user->updated_at
                ],
                'bookings' => $bookings->map(function($booking) {
                    return [
                        'id' => $booking->id,
                        'start_date' => $booking->start_date,
                        'end_date' => $booking->end_date,
                        'status' => $booking->status,
                        'total' => $booking->total,
                        'created_at' => $booking->created_at,
                        'car' => $booking->car ? [
                            'id' => $booking->car->id,
                            'name' => $booking->car->name,
                            'images' => $booking->car->images
                        ] : null
                    ];
                })
            ]
        ]);

    } catch (\Exception $e) {
        return response()->json([
            'success' => false,
            'message' => 'User not found'
        ], 404);
    }
}

    public function bookings($id)
    {
        try {
            $bookings = Booking::with(['car.images', 'user'])
                            ->where('user_id', $id)
                            ->get();

            return response()->json([
                'success' => true,
                'data' => $bookings
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error fetching bookings'
            ], 500);
        }
    }
    public function update(Request $request, $id)
    {
        try {
            $user = User::findOrFail($id);

            $data = $request->only(['name', 'email', 'phone', 'address']);

            if ($request->filled('password')) {
                $data['password'] = bcrypt($request->password);
            }

            if ($request->hasFile('image') && $request->file('image')->isValid()) {
                $file = $request->file('image');
                $path = $file->store('profile_images', 'public'); 
                $data['image'] = $path;
            }

            $user->update($data);

            return response()->json([
                'success' => true,
                'message' => 'User updated successfully.',
                'image_url' => $user->image ? asset('storage/' . $user->image) : null
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error updating user: ' . $e->getMessage(),
            ], 500);
        }
    }


}
