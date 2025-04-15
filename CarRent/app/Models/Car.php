<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;

class Car extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'user_id', 'name', 'color', 'description', 'location',
        'price_per_day', 'price_per_month', 'status', 'car_type',
        'seats', 'transmission', 'fuel_type', 'add'
    ];

    public function Lessor() {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function images() {
        return $this->hasMany(CarImage::class);
    }

    public function bookings() {
        return $this->hasMany(Booking::class);
    }

    public function reviews() {
        return $this->hasMany(Review::class);
    }

    public function favorites() {
        return $this->hasMany(Favorite::class);
    }
}
