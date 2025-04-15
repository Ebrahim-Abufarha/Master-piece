<?php

namespace App\Http\Controllers\Api;

use App\Models\User;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        // التحقق من المدخلات
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:8',
            'phone' => 'required|string|max:15',
            'address' => 'required|string',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'role' => 'nullable|string|in:admin,lessor,renter', // Add role validation
        ]);

        // إنشاء المستخدم
        $user = new User();
        $user->name = $validated['name'];
        $user->email = $validated['email'];
        $user->password = Hash::make($validated['password']);
        $user->phone = $validated['phone'];
        $user->address = $validated['address'];
        $user->role = $validated['role'] ?? 'renter'; // Default to 'renter' if not provided

        // التعامل مع الصورة
        if ($request->hasFile('image') && $request->file('image')->isValid()) {
            $file = $request->file('image');
            $path = $file->store('profile_images', 'public');
            $user->image = $path;
        }

        // حفظ المستخدم
        $user->save();

        // استجابة بنجاح
        return response()->json(['message' => 'User registered successfully!', 'user' => $user], 201);
    }


    public function login(Request $request)
{
    // التحقق من المدخلات
    $credentials = $request->validate([
        'email' => 'required|email',
        'password' => 'required|string',
    ]);

    // البحث عن المستخدم عن طريق الإيميل
    $user = User::where('email', $credentials['email'])->first();

    // التحقق من وجود المستخدم ومطابقة كلمة المرور
    if (!$user || !Hash::check($credentials['password'], $user->password)) {
        return response()->json(['message' => 'Invalid email or password'], 401);
    }

    // تسجيل الدخول ناجح
    return response()->json([
        'message' => 'Login successful',
        'user' => $user
    ]);
}


}
