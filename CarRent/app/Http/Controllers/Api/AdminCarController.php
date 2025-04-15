<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Car;
use App\Models\CarImage;
use Illuminate\Support\Facades\Storage;

use Illuminate\Http\Request;

class AdminCarController extends Controller
{
    /**
     * Display a listing of the cars.
     */
    public function index()
    {
        $cars = Car::with(['Lessor', 'images'])
        ->orderBy('created_at', 'desc')
        ->get();

        return response()->json([
            'data' => $cars,
            'status' => 'success'
        ]);}
    /**
     * Display the specified car.
     */
    public function show(Car $car)
    {
        $car->load(['Lessor', 'images']);
        return response()->json($car);
    }

    /**
     * Remove the specified car from storage.
     */
    public function destroy(Car $car)
    {
        try {
            $car->delete();
            return response()->json(['message' => 'Car deleted successfully']);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Error deleting car'], 500);
        }
    }

    /**
     * Get images for a specific car
     */
    public function getImages(Car $car)
    {
        $images = $car->images;
        return response()->json($images);
    }

    /**
     * Delete a specific car image
     */
    public function deleteImage(CarImage $image)
    {
        try {
            // Delete file from storage
            Storage::delete($image->image_path);

            // Delete record from database
            $image->delete();

            return response()->json(['message' => 'Image deleted successfully']);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Error deleting image'], 500);
        }
    }
}
