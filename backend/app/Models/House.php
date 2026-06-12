<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class House extends Model
{
    protected $fillable = [
        'house_number',
        'block',
        'address',
        'occupancy_status',
    ];

    public function houseOccupants()
    {
        return $this->hasMany(HouseOccupant::class);
    }

    public function billings()
    {
        return $this->hasMany(Billing::class);
    }
}