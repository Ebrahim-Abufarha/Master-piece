<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\ContactController;
use App\Http\Controllers\BookingController;
use App\Http\Controllers\Api\LessorController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\FavoriteController;
use App\Http\Controllers\API\ReviewController;
use App\Http\Controllers\Api\AdminUsersController;
use App\Http\Controllers\Api\AdminCarController;
use App\Http\Controllers\Api\AdminContactController;
use App\Http\Controllers\Api\AdminReviewController;
use App\Http\Controllers\Api\AdminBookingController;
use App\Http\Controllers\Api\LessorCarController;
use App\Http\Controllers\Api\LessorBookingController;
use App\Http\Controllers\Api\LessorReviewController;



/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

Route::post('register', [AuthController::class, 'register']);
Route::post('login', [AuthController::class, 'login']);


use App\Http\Controllers\CarController;

Route::get('cars', [CarController::class, 'index']);
Route::get('cars/{id}', [CarController::class, 'show']);


Route::post('/contact', [ContactController::class, 'store']);

// Route::post('/booking', [BookingController::class, 'store'])->name('bookings.store');
Route::post('/bookings', [BookingController::class, 'store']);
Route::get('/bookings/car-single/{carId}', [BookingController::class, 'getBookedDates']);
Route::get('/add', [CarController::class, 'carsWithAds']);


Route::group(['prefix' => 'lessors'], function() {
    Route::get('/{id}', [LessorController::class, 'show']);
    Route::get('/{id}/cars', [LessorController::class, 'cars']);
});
Route::group(['prefix' => 'users'], function() {
    Route::get('/{id}', [UserController::class, 'show']);
    Route::get('/{id}/bookings', [UserController::class, 'bookings']);
    Route::put('/{id}', [UserController::class, 'update']);
Route::post('/{id}', [UserController::class, 'update']);

});

    Route::get('/favorites/{id}', [FavoriteController::class, 'index']);
    Route::post('/favorites', [FavoriteController::class, 'store']);
    Route::delete('/favorites/{carId}/{id}', [FavoriteController::class, 'destroy']);


    Route::post('/reviews', [ReviewController::class, 'store']);
    Route::get('/reviews/{car_id}', [ReviewController::class, 'index']);




    Route::get('/admin/users', [AdminUsersController::class, 'index']);       // Get all
    Route::post('/admin/users', [AdminUsersController::class, 'store']);      // Create
    Route::get('/admin/users/{id}', [AdminUsersController::class, 'show']);    // Get one
    Route::put('/admin/users/{id}', [AdminUsersController::class, 'update']);  // Update
    Route::delete('/admin/users/{id}', [AdminUsersController::class, 'destroy']); // Delete



        // Cars routes
        Route::get('admin/cars', [AdminCarController::class, 'index']);
        Route::get('admin/cars/{car}', [AdminCarController::class, 'show']);
        Route::delete('admin/cars/{car}', [AdminCarController::class, 'destroy']);

        // Car images routes
        Route::get('admin/cars/{car}/images', [AdminCarController::class, 'getImages']);
        Route::delete('admin/cars/images/{image}', [AdminCarController::class, 'deleteImage']);



        Route::get('admin/contacts', [AdminContactController::class, 'index']);

        Route::delete('admin/contacts/{id}', [AdminContactController::class, 'destroy']);


        Route::get('admin/reviews', [AdminReviewController::class, 'index']);

        Route::delete('admin/reviews/{id}', [AdminReviewController::class, 'destroy']);

        Route::get('admin/bookings', [AdminBookingController::class, 'index']);
        Route::delete('admin/bookings/{id}', [AdminBookingController::class, 'destroy']);
        Route::put('admin/bookings/{id}', [AdminBookingController::class, 'update']);


        Route::get('admin/contactsSingle/{contact}', [AdminContactController::class, 'show']);







        Route::get('lessor/cars/{lessorId}', [LessorCarController::class, 'index']);
        Route::get('lessor/cars/{car}/{lessorId}', [LessorCarController::class, 'show']);
                Route::delete('lessor/cars/{car}/{lessor/id}', [LessorCarController::class, 'destroy']);
        Route::put('lessor/cars/{id}/{lessorId}', [LessorCarController::class, 'update']);
        Route::post('lessor/cars', [LessorCarController::class, 'store']);



        Route::get('lessor/bookings/{lessorId}', [LessorBookingController::class, 'getLessorBookings']);
        Route::put('lessor/bookings/{id}/{lessorId}', [LessorBookingController::class, 'update']);
        Route::delete('lessor/bookings/{id}/{lessorId}', [LessorBookingController::class, 'destroy']);




        Route::delete('/lessor/reviews/{review}', [LessorReviewController::class, 'destroy']);
        Route::get('/lessor/{lessorId}/reviews', [LessorReviewController::class, 'index']);
