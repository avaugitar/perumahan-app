<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Payment extends Model
{
    protected $fillable = [
        'billing_id',
        'amount_paid',
        'payment_date',
        'payment_proof',
        'notes',
    ];

    public function billing()
    {
        return $this->belongsTo(Billing::class);
    }
}