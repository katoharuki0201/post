<?php

namespace App\Http\Controllers;

use App\Models\Post;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class PostController extends Controller
{
    // 取得(一覧)
    public function index()
    {
        $posts = Post::with('user')->latest()->get();

        $results = $posts->map(function ($post) {
            return [
                'id' => $post->id,
                'title' => $post->title,
                'content' => $post->content,
                'image_url'  => $post->image_path
                    ? asset('storage/' . $post->image_path)
                    : null,
                'created_at' => $post->created_at,
                'user' => [
                    'id' => $post->user->id,
                    'name' => $post->user->name,
                    'email' => $post->user->email,
                ],
            ];
        });

        return response()->json($results, 200);
    }

    // 作成
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        $imagePath = null;

        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('posts', 'public');
        }

        $post = Post::create([
            'user_id' => $request->user()->id,
            'title' => $validated['title'],
            'content' => $validated['content'],
            'image_path' => $imagePath,
        ]);

        return response()->json([
            'id' => $post->id,
            'title' => $post->title,
            'content' => $post->content,
            'image_url' => $post->image_path
                ? asset('storage/' . $post->image_path)
                : null,
            'created_at' => $post->created_at,
        ], 201);
    }

    // 編集
    public function update(Request $request, Post $post)
    {
        if ($request->user()->id !== $post->user_id) {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'remove_image' => 'sometimes|boolean',
        ]);

        $oldImagePath = $post->image_path;
        $newImagePath = $oldImagePath;

        if ($request->hasFile('image')) {
            $newImagePath = $request->file('image')->store('posts', 'public');
        } elseif ($request->boolean('remove_image')) {
            $newImagePath = null;
        }

        $post->update([
            'title'      => $validated['title'],
            'content'    => $validated['content'],
            'image_path' => $newImagePath,
        ]);

        if ($oldImagePath && $oldImagePath !== $newImagePath) {
            Storage::disk('public')->delete($oldImagePath);
        }

        return response()->json([
            'id' => $post->id,
            'title' => $post->title,
            'content' => $post->content,
            'image_url' => $post->image_path
                ? asset('storage/' . $post->image_path)
                : null,
            'created_at' => $post->created_at,
        ]);
    }

    // 削除
    public function destroy(Request $request, Post $post)
    {
        if ($request->user()->id !== $post->user_id) {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        if ($post->image_path) {
            Storage::disk('public')->delete($post->image_path);
        }

        $post->delete();

        return response()->json(null, 204);
    }
}
