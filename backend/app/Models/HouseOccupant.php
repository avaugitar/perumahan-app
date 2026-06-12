<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class HouseOccupant extends Model
{
    protected $fillable = [
        'resident_id',
        'house_id',
        'start_date',
        'end_date',
        'is_active',
    ];

    public function resident()
    {
        return $this->belongsTo(Resident::class);
    }

    public function house()
    {
        return $this->belongsTo(House::class);
    }
}