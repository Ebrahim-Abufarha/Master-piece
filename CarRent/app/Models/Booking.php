<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;

class Booking extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = ['user_id', 'car_id', 'start_date', 'end_date', 'status', 'total','lessonImage'];

    public function user() {
        return $this->belongsTo(User::class); // renter
    }

    public function car() {
        return $this->belongsTo(Car::class);
    }

    public function payment() {
        return $this->hasOne(Payment::class);
    }
}
