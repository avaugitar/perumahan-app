<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class FeeType extends Model
{
    protected $fillable = [
        'name',
        'amount',
        'description',
        'is_active',
    ];

    public function billings()
    {
        return $this->hasMany(Billing::class, 'fee_type_id');
    }
}