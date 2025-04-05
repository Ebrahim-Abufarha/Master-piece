<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;

class Car extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'user_id', 'title', 'description', 'location', 'price_per_day',
        'status', 'type', 'guest_limit'
    ];

    public function lessor() {
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
