<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\HouseOccupant;
use App\Models\House;
use Carbon\Carbon;

class HouseOccupantController extends Controller
{
    public function index()
    {
        $data = HouseOccupant::with(['resident', 'house'])
            ->orderBy('id', 'desc')
            ->get();

        return response()->json($data);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'resident_id' => 'required|exists:residents,id',
            'house_id' => 'required|exists:houses,id',
            'start_date' => 'required|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
        ]);

        $today = Carbon::today();

        $isActive = true;

        if (!empty($validated['end_date'])) {
            $endDate = Carbon::parse($validated['end_date']);

            if ($endDate->lt($today)) {
                $isActive = false;
            }
        }

        if ($isActive) {
            HouseOccupant::where('house_id', $validated['house_id'])
                ->where('is_active', true)
                ->update([
                    'is_active' => false,
                    'end_date' => $validated['start_date'],
                ]);
        }

        $houseOccupant = HouseOccupant::create([
            'resident_id' => $validated['resident_id'],
            'house_id' => $validated['house_id'],
            'start_date' => $validated['start_date'],
            'end_date' => $validated['end_date'] ?? null,
            'is_active' => $isActive,
        ]);

        $activeOccupant = HouseOccupant::where('house_id', $validated['house_id'])
            ->where('is_active', true)
            ->first();

        House::where('id', $validated['house_id'])
            ->update([
                'occupancy_status' => $activeOccupant ? 'dihuni' : 'tidak_dihuni',
            ]);

        return response()->json($houseOccupant, 201);
    }

    public function show($id)
    {
        $houseOccupant = HouseOccupant::with(['resident', 'house'])->findOrFail($id);

        return response()->json($houseOccupant);
    }

    public function update(Request $request, $id)
    {
        $houseOccupant = HouseOccupant::findOrFail($id);

        $validated = $request->validate([
            'resident_id' => 'required|exists:residents,id',
            'house_id' => 'required|exists:houses,id',
            'start_date' => 'required|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
        ]);

        $today = Carbon::today();

        $isActive = true;

        if (!empty($validated['end_date'])) {
            $endDate = Carbon::parse($validated['end_date']);

            if ($endDate->lt($today)) {
                $isActive = false;
            }
        }

        if ($isActive) {
            HouseOccupant::where('house_id', $validated['house_id'])
                ->where('is_active', true)
                ->where('id', '!=', $houseOccupant->id)
                ->update([
                    'is_active' => false,
                    'end_date' => $validated['start_date'],
                ]);
        }

        $houseOccupant->update([
            'resident_id' => $validated['resident_id'],
            'house_id' => $validated['house_id'],
            'start_date' => $validated['start_date'],
            'end_date' => $validated['end_date'] ?? null,
            'is_active' => $isActive,
        ]);

        $activeOccupant = HouseOccupant::where('house_id', $validated['house_id'])
            ->where('is_active', true)
            ->first();

        House::where('id', $validated['house_id'])
            ->update([
                'occupancy_status' => $activeOccupant ? 'dihuni' : 'tidak_dihuni',
            ]);

        return response()->json($houseOccupant);
    }

    public function destroy($id)
    {
        $houseOccupant = HouseOccupant::findOrFail($id);
        $houseId = $houseOccupant->house_id;

        $houseOccupant->delete();

        $activeOccupant = HouseOccupant::where('house_id', $houseId)
            ->where('is_active', true)
            ->first();

        House::where('id', $houseId)
            ->update([
                'occupancy_status' => $activeOccupant ? 'dihuni' : 'tidak_dihuni',
            ]);

        return response()->json([
            'message' => 'House occupant deleted successfully'
        ]);
    }
}