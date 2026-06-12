<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Billing;

class BillingController extends Controller
{
    public function index()
    {
        $billings = Billing::with(['house', 'resident', 'feeType', 'payments'])
            ->orderBy('id', 'desc')
            ->get();

        return response()->json($billings);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'house_id' => 'required|exists:houses,id',
            'resident_id' => 'required|exists:residents,id',
            'fee_type_id' => 'required|exists:fee_types,id',
            'billing_month' => 'required|integer|min:1|max:12',
            'billing_year' => 'required|integer|min:2000',
            'amount' => 'required|numeric|min:0',
            'status' => 'required|in:belum_lunas,lunas',
            'due_date' => 'nullable|date',
        ]);

        $billing = Billing::create($validated);

        return response()->json($billing, 201);
    }

    public function show($id)
    {
        $billing = Billing::with(['house', 'resident', 'feeType', 'payments'])
            ->findOrFail($id);

        return response()->json($billing);
    }

    public function update(Request $request, $id)
    {
        $billing = Billing::findOrFail($id);

        $validated = $request->validate([
            'house_id' => 'sometimes|exists:houses,id',
            'resident_id' => 'sometimes|exists:residents,id',
            'fee_type_id' => 'sometimes|exists:fee_types,id',
            'billing_month' => 'sometimes|integer|min:1|max:12',
            'billing_year' => 'sometimes|integer|min:2000',
            'amount' => 'sometimes|numeric|min:0',
            'status' => 'sometimes|in:belum_lunas,lunas',
            'due_date' => 'nullable|date',
        ]);

        $billing->update($validated);

        return response()->json($billing);
    }

    public function destroy($id)
    {
        $billing = Billing::findOrFail($id);
        $billing->delete();

        return response()->json([
            'message' => 'Billing deleted successfully'
        ]);
    }
}