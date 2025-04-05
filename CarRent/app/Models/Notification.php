<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Notification extends Model
{
    use HasFactory;

    protected $fillable = ['title', 'message', 'is_read', 'read_at'];

    public function notifiable() {
        return $this->morphTo();
    }
}
