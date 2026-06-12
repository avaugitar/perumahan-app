<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Payment;
use App\Models\Billing;

class PaymentController extends Controller
{
    public function index()
    {
        $payments = Payment::with(['billing.house', 'billing.resident', 'billing.feeType'])
            ->orderBy('id', 'desc')
            ->get();

        return response()->json($payments);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'billing_id' => 'required|exists:billings,id',
            'amount_paid' => 'required|numeric|min:0',
            'payment_date' => 'required|date',
            'payment_proof' => 'nullable|string',
            'notes' => 'nullable|string',
        ]);

        $payment = Payment::create($validated);

        $billing = Billing::with('payments')->findOrFail($validated['billing_id']);

        $totalPaid = $billing->payments->sum('amount_paid');

        if ($totalPaid >= $billing->amount) {
            $billing->update([
                'status' => 'lunas',
            ]);
        } else {
            $billing->update([
                'status' => 'belum_lunas',
            ]);
        }

        return response()->json($payment, 201);
    }

    public function show($id)
    {
        $payment = Payment::with(['billing.house', 'billing.resident', 'billing.feeType'])
            ->findOrFail($id);

        return response()->json($payment);
    }

    public function update(Request $request, $id)
    {
        $payment = Payment::findOrFail($id);

        $validated = $request->validate([
            'billing_id' => 'sometimes|exists:billings,id',
            'amount_paid' => 'sometimes|numeric|min:0',
            'payment_date' => 'sometimes|date',
            'payment_proof' => 'nullable|string',
            'notes' => 'nullable|string',
        ]);

        $payment->update($validated);

        return response()->json($payment);
    }

    public function destroy($id)
    {
        $payment = Payment::findOrFail($id);
        $payment->delete();

        return response()->json([
            'message' => 'Payment deleted successfully'
        ]);
    }
}