<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Resident;

class ResidentController extends Controller
{
    public function index()
    {
        return response()->json(Resident::all());
    }

    public function store(Request $request)
{
    $validated = $request->validate([
        'full_name' => 'required|string|max:255',
        'ktp_photo' => 'nullable|image|mimes:jpg,jpeg,png|max:2048',
        'resident_status' => 'required|in:tetap,kontrak',
        'phone_number' => 'required|string|max:50',
        'is_married' => 'required|boolean',
    ]);

    if ($request->hasFile('ktp_photo')) {
        $file = $request->file('ktp_photo');

        $fileName = $file->getClientOriginalName();

        $validated['ktp_photo'] = $file->storeAs('ktp_photos', $fileName, 'public');
    }

    $resident = Resident::create($validated);

    return response()->json($resident, 201);
}

    public function show($id)
    {
        $resident = Resident::findOrFail($id);
        return response()->json($resident);
    }

    public function update(Request $request, $id)
    {
        $resident = Resident::findOrFail($id);

        $validated = $request->validate([
            'full_name' => 'sometimes|string|max:255',
            'ktp_photo' => 'nullable|image|mimes:jpg,jpeg,png|max:2048',
            'resident_status' => 'sometimes|in:tetap,kontrak',
            'phone_number' => [
                'sometimes',
                'string',
                'max:50',
                'regex:/^62[0-9\-\s]+$/'
            ],
            'is_married' => 'sometimes|boolean',
        ]);

        if ($request->hasFile('ktp_photo')) {
            $file = $request->file('ktp_photo');

            $fileName = $file->getClientOriginalName();

            $validated['ktp_photo'] = $file->storeAs('ktp_photos', $fileName, 'public');
        }

        $resident->update($validated);

        return response()->json($resident);
    }

    public function destroy($id)
    {
        $resident = Resident::findOrFail($id);
        $resident->delete();

        return response()->json([
            'message' => 'Deleted successfully'
        ]);
    }
}