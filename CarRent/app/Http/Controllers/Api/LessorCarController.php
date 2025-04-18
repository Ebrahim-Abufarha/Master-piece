<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Car;
use App\Models\CarImage;
use Illuminate\Support\Facades\Storage;

use Illuminate\Http\Request;

class LessorCarController extends Controller
{
    /**
     * Display a listing of the cars.
     */
    public function index($lessorId)
    {
        $cars = Car::with('images')->where('user_id', $lessorId)->get();
        return response()->json(['data' => $cars]);
    }

   public function show(Car $car, $id)
{
    if ($car->user_id != $id) {
        return response()->json(['message' => 'Unauthorized'], 403);
    }

    $car->load('images');

    return response()->json([
        'message' => 'Car retrieved successfully',
        'data' => $car
    ]);
}


public function store(Request $request)
{
    $validated = $request->validate([
        'user_id' => 'required|exists:users,id',
        'name' => 'required|string|max:255',
        'color' => 'required|string|max:50',
        'description' => 'required|string',
        'price_per_day' => 'required|numeric|min:0',
        'location' => 'required|string|max:255',
        'add' => 'nullable|numeric',
        'car_type' => 'required|string|max:50',
        'seats' => 'required|integer|min:1',
        'transmission' => 'required|string|max:50',
        'fuel_type' => 'required|string|max:50',
        'images' => 'required|array',
        'images.*' => 'image|mimes:jpeg,png,jpg,gif|max:2048'
    ]);

    try {
        $car = Car::create($validated);

        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $image) {
                $path = $image->store('cars', 'public');
                $car->images()->create(['image_path' => $path]);
            }
        }

        return response()->json([
            'message' => 'Car added successfully',
            'data' => $car->load('images')
        ], 201);

    } catch (\Exception $e) {
        return response()->json([
            'message' => 'Failed to add car',
            'error' => $e->getMessage()
        ], 500);
    }
}


  public function update(Request $request, $id, $lessorId)
  {
      try {
          $car = Car::with('images')
                    ->where('id', $id)
                    ->where('user_id', $lessorId)
                    ->firstOrFail();

          $car->update($request->only([
              'name', 'color', 'description', 'price_per_day'
          ]));

          if ($request->has('images_to_delete')) {
              $imagesToDelete = json_decode($request->images_to_delete);
              foreach ($imagesToDelete as $imageId) {
                  $image = CarImage::find($imageId);
                  if ($image && $image->car_id == $car->id) {
                      Storage::disk('public')->delete($image->image_path);
                      $image->delete();
                  }
              }
          }

          if ($request->hasFile('images')) {
              foreach ($request->file('images') as $imageFile) {
                  $path = $imageFile->store('cars', 'public');
                  $car->images()->create([
                      'image_path' => $path
                  ]);
              }
          }

          return response()->json([
              'message' => 'Car updated successfully',
              'data' => $car->fresh()
          ]);
      } catch (\Exception $e) {
          return response()->json([
              'message' => 'Failed to update car',
              'error' => $e->getMessage()
          ], 500);
      }
  }


    public function destroy($carId, $lessorId)
    {
        $car = Car::where('id', $carId)->where('user_id', $lessorId)->firstOrFail();
        $car->delete();

        return response()->json(['message' => 'Car deleted.']);
    }
}
