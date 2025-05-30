<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;

class Payment extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = ['user_id', 'booking_id', 'amount', 'payment_method', 'status'];

    public function user() {
        return $this->belongsTo(User::class);
    }

    public function booking() {
        return $this->belongsTo(Booking::class);
    }
}
