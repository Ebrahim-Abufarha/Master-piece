<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Hash;

class AdminUsersController extends Controller
{
    // Get all users
    public function index()
    {
        return response()->json(User::all());
    }

    // Store a new user
    public function store(Request $request)
    {
        $request->validate([
            'name'     => 'required|string|max:255',
            'email'    => 'required|email|unique:users',
            'password' => 'required|string|min:6',
            'role'     => 'in:admin,lessor,renter',
            'image'    => 'nullable|image',
        ]);

        $path = $request->file('image') ? $request->file('image')->store('images/user', 'public') : 'images/user/user.bmp';

        $user = User::create([
            'name'     => $request->name,
            'email'    => $request->email,
            'password' => Hash::make($request->password),
            'role'     => $request->role ?? 'renter',
            'image'    => $path,
            'address'  => $request->address,
            'phone'    => $request->phone,
        ]);

        return response()->json($user, 201);
    }

    // Show single user
    public function show($id)
    {
        $user = User::findOrFail($id);
        return response()->json($user);
    }

    // Update user
    public function update(Request $request, $id)
    {
        $user = User::findOrFail($id);

        $request->validate([
            'name'     => 'required|string|max:255',
            'email'    => 'required|email|unique:users,email,' . $id,
            'role'     => 'in:admin,lessor,renter',
            'image'    => 'nullable|image',
        ]);

        if ($request->hasFile('image')) {
            // Delete old image if not default
            if ($user->image !== 'images/user/user.bmp') {
                Storage::disk('public')->delete($user->image);
            }
            $user->image = $request->file('image')->store('images/user', 'public');
        }

        $user->update([
            'name'    => $request->name,
            'email'   => $request->email,
            'role'    => $request->role,
            'address' => $request->address,
            'phone'   => $request->phone,
        ]);

        return response()->json($user);
    }

    // Delete user
    public function destroy($id)
    {
        $user = User::findOrFail($id);

        if ($user->image !== 'images/user/user.bmp') {
            Storage::disk('public')->delete($user->image);
        }

        $user->delete();
        return response()->json(['message' => 'User deleted successfully']);
    }
}
