<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (!Schema::hasColumn('expenses', 'notes')) {
            Schema::table('expenses', function (Blueprint $table) {
                $table->text('notes')->nullable()->after('expense_date');
            });
        }

        if (Schema::hasColumn('expenses', 'proof_photo')) {
            DB::statement(
                'UPDATE expenses
                 SET notes = proof_photo
                 WHERE notes IS NULL'
            );

            Schema::table('expenses', function (Blueprint $table) {
                $table->dropColumn('proof_photo');
            });
        }
    }

    public function down(): void
    {
        if (!Schema::hasColumn('expenses', 'proof_photo')) {
            Schema::table('expenses', function (Blueprint $table) {
                $table->text('proof_photo')->nullable()->after('expense_date');
            });
        }

        if (Schema::hasColumn('expenses', 'notes')) {
            DB::statement(
                'UPDATE expenses
                 SET proof_photo = notes
                 WHERE proof_photo IS NULL'
            );

            Schema::table('expenses', function (Blueprint $table) {
                $table->dropColumn('notes');
            });
        }
    }
};