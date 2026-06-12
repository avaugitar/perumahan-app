<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\House;

class HouseController extends Controller
{
    public function index()
    {
        $houses = House::with([
            'houseOccupants' => function ($query) {
                $query->where('is_active', true)->with('resident');
            }
        ])->get();

        $houses->each(function ($house) {
            $house->occupancy_status = $house->houseOccupants->count() > 0
                ? 'dihuni'
                : 'tidak_dihuni';
        });

        return response()->json($houses);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'house_number' => 'required|string|max:50',
            'block' => 'required|string|max:50',
            'address' => 'required|string|max:255',
        ]);

        $totalHouses = House::count();

        if ($totalHouses >= 20) {
            return response()->json([
                'message' => 'Jumlah rumah sudah mencapai batas maksimal 20.'
            ], 422);
        }

        $duplicateHouse = House::where('house_number', $validated['house_number'])
            ->where('block', $validated['block'])
            ->first();

        if ($duplicateHouse) {
            return response()->json([
                'message' => 'Rumah dengan blok dan nomor tersebut sudah terdaftar.'
            ], 422);
        }

        $house = House::create([
            'house_number' => $validated['house_number'],
            'block' => $validated['block'],
            'address' => $validated['address'],
            'occupancy_status' => 'tidak_dihuni',
        ]);

        return response()->json($house, 201);
    }

    public function show($id)
    {
        $house = House::with(['houseOccupants.resident'])->findOrFail($id);

        return response()->json($house);
    }

    public function update(Request $request, $id)
    {
        $house = House::findOrFail($id);

        $validated = $request->validate([
            'house_number' => 'required|string|max:50',
            'block' => 'required|string|max:50',
            'address' => 'required|string|max:255',
        ]);

        $duplicateHouse = House::where('house_number', $validated['house_number'])
            ->where('block', $validated['block'])
            ->where('id', '!=', $house->id)
            ->first();

        if ($duplicateHouse) {
            return response()->json([
                'message' => 'Rumah dengan blok dan nomor tersebut sudah terdaftar.'
            ], 422);
        }

        $house->update([
            'house_number' => $validated['house_number'],
            'block' => $validated['block'],
            'address' => $validated['address'],
        ]);

        return response()->json($house);
    }

    public function destroy($id)
    {
        $house = House::findOrFail($id);
        $house->delete();

        return response()->json([
            'message' => 'House deleted successfully'
        ]);
    }
}