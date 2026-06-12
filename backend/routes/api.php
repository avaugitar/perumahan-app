<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\ResidentController;
use App\Http\Controllers\API\HouseController;
use App\Http\Controllers\API\HouseOccupantController;
use App\Http\Controllers\API\FeeTypeController;
use App\Http\Controllers\API\BillingController;
use App\Http\Controllers\API\PaymentController;
use App\Http\Controllers\API\ExpenseController;

Route::apiResource('expenses', ExpenseController::class);
Route::apiResource('payments', PaymentController::class);
Route::apiResource('billings', BillingController::class);
Route::apiResource('fee-types', FeeTypeController::class);
Route::apiResource('house-occupants', HouseOccupantController::class);
Route::apiResource('houses', HouseController::class);
Route::apiResource('residents', ResidentController::class);