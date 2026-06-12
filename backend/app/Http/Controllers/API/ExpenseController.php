<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Expense;
use Illuminate\Http\Request;

class ExpenseController extends Controller
{
    public function index()
    {
        $expenses = Expense::orderBy('expense_date', 'desc')
            ->orderBy('id', 'desc')
            ->get();

        return response()->json($expenses);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'category' => [
                'required',
                'in:Perbaikan Jalan,Perbaikan Selokan,Gaji Satpam,Token Listrik Pos Satpam,Lainnya',
            ],
            'description' => [
                'nullable',
                'required_if:category,Lainnya',
                'string',
                'max:255',
            ],
            'amount' => [
                'required',
                'numeric',
                'min:0',
            ],
            'expense_date' => [
                'required',
                'date',
            ],
            'notes' => [
                'nullable',
                'string',
                'max:1000',
            ],
        ]);

        // Deskripsi hanya disimpan jika kategori Lainnya.
        $validated['description'] =
            $validated['category'] === 'Lainnya'
                ? $validated['description']
                : null;

        $expense = Expense::create($validated);

        return response()->json($expense, 201);
    }

    public function show($id)
    {
        $expense = Expense::findOrFail($id);

        return response()->json($expense);
    }

    public function update(Request $request, $id)
    {
        $expense = Expense::findOrFail($id);

        $validated = $request->validate([
            'category' => [
                'required',
                'in:Perbaikan Jalan,Perbaikan Selokan,Gaji Satpam,Token Listrik Pos Satpam,Lainnya',
            ],
            'description' => [
                'nullable',
                'required_if:category,Lainnya',
                'string',
                'max:255',
            ],
            'amount' => [
                'required',
                'numeric',
                'min:0',
            ],
            'expense_date' => [
                'required',
                'date',
            ],
            'notes' => [
                'nullable',
                'string',
                'max:1000',
            ],
        ]);

        // Kosongkan deskripsi jika kategorinya bukan Lainnya.
        $validated['description'] =
            $validated['category'] === 'Lainnya'
                ? $validated['description']
                : null;

        $expense->update($validated);

        return response()->json($expense);
    }

    public function destroy($id)
    {
        $expense = Expense::findOrFail($id);
        $expense->delete();

        return response()->json([
            'message' => 'Data pengeluaran berhasil dihapus.',
        ]);
    }
}