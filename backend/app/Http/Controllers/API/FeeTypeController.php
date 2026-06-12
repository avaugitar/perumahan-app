<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\FeeType;

class FeeTypeController extends Controller
{
    public function index()
    {
        return response()->json(FeeType::all());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'amount' => 'required|numeric|min:0',
            'description' => 'nullable|string',
            'is_active' => 'required|boolean',
        ]);

        $feeType = FeeType::create($validated);

        return response()->json($feeType, 201);
    }

    public function show($id)
    {
        $feeType = FeeType::findOrFail($id);

        return response()->json($feeType);
    }

    public function update(Request $request, $id)
    {
        $feeType = FeeType::findOrFail($id);

        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'amount' => 'sometimes|numeric|min:0',
            'description' => 'nullable|string',
            'is_active' => 'sometimes|boolean',
        ]);

        $feeType->update($validated);

        return response()->json($feeType);
    }

    public function destroy($id)
    {
        $feeType = FeeType::findOrFail($id);
        $feeType->delete();

        return response()->json([
            'message' => 'Fee type deleted successfully'
        ]);
    }
}