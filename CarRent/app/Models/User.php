<?php
namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasFactory, Notifiable,HasApiTokens;

    protected $fillable = ['name', 'email', 'password', 'role', 'image', 'address', 'phone'];

    public function cars() {
        return $this->hasMany(Car::class);
    }

    public function bookings() {
        return $this->hasMany(Booking::class);
    }

    public function payments() {
        return $this->hasMany(Payment::class);
    }

    public function reviews() {
        return $this->hasMany(Review::class);
    }

    public function favorites() {
        return $this->hasMany(Favorite::class);
    }

    public function notifications() {
        return $this->morphMany(Notification::class, 'notifiable');
    }
}
