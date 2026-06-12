<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Resident extends Model
{
    protected $fillable = [
        'full_name',
        'ktp_photo',
        'resident_status',
        'phone_number',
        'is_married',
    ];

    protected $casts = [
        'is_married' => 'boolean',
    ];

    protected $appends = [
        'married_status',
        'ktp_photo_url',
    ];

    public function houseOccupants()
    {
        return $this->hasMany(HouseOccupant::class);
    }

    public function billings()
    {
        return $this->hasMany(Billing::class);
    }

    public function getMarriedStatusAttribute()
    {
        return $this->is_married ? 'Menikah' : 'Belum menikah';
    }

    public function getKtpPhotoUrlAttribute()
    {
        return $this->ktp_photo
            ? asset('storage/' . $this->ktp_photo)
            : null;
    }
}