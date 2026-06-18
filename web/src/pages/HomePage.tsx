import { useState, useCallback, useEffect, useRef } from 'react';
import { api } from '../api/client';
import type { Post } from '../api/client';
import { useAuth } from '../contexts/AuthContext';
import { PostCard } from '../components/PostCard';
import { Image, X } from 'lucide-react';

export function HomePage() {
  const { isAuthenticated, user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isPostFormOpen, setIsPostFormOpen] = useState(false);

  const loadPosts = useCallback(async () => {
    if (isLoading) return;
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.getPosts();
      setPosts(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : '投稿の読み込みに失敗しました');
    } finally {
      setIsLoading(false);
    }
  }, [isLoading]);

  useEffect(() => {
    loadPosts();
  }, []);

  const handleSubmit = useCallback(async () => {
    if (!title.trim() || !content.trim() || isSubmitting || !user) return;
    setIsSubmitting(true);
    setError(null);
    try {
      const newPost = await api.createPost(title, content, image || undefined);
      const postWithUser: Post = {
        ...newPost,
        user,
      };
      setPosts((prev) => [postWithUser, ...prev]);
      setTitle('');
      setContent('');
      setImage(null);
      setImagePreview(null);
      setIsPostFormOpen(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : '投稿の作成に失敗しました');
    } finally {
      setIsSubmitting(false);
    }
  }, [title, content, image, isSubmitting, user]);

  const handleImageChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const handleDelete = useCallback((id: number) => {
    setPosts((prev) => prev.filter((p) => p.id !== id));
  }, []);

  const handleUpdate = useCallback((updatedPost: Post) => {
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === updatedPost.id) {
          return {
            ...updatedPost,
            user: p.user,
          };
        }
        return p;
      })
    );
  }, []);

  return (
    <div>
      {/* Header */}
      <div className="sticky top-0 z-10 bg-bg/80 backdrop-blur-md border-b border-border">
        <h1 className="px-4 py-3 text-xl font-bold">ホーム</h1>
      </div>

      {/* Post Form */}
      {isAuthenticated && (
        <div className="border-b border-border p-4">
          {!isPostFormOpen ? (
            <div
              onClick={() => setIsPostFormOpen(true)}
              className="flex items-center gap-3 cursor-pointer"
            >
              <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                {user?.name.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 bg-surface rounded-full px-4 py-3 text-text-secondary">
                何か投稿してみましょう
              </div>
            </div>
          ) : (
            <div>
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                  {user?.name.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1">
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="タイトル"
                    className="w-full bg-transparent text-lg font-bold text-text placeholder-text-secondary focus:outline-none mb-2"
                    autoFocus
                  />
                  <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="内容を入力..."
                    rows={3}
                    className="w-full bg-transparent text-text placeholder-text-secondary focus:outline-none resize-none text-lg"
                  />
                </div>
              </div>

              {imagePreview && (
                <div className="relative mt-2 rounded-2xl overflow-hidden border border-border">
                  <img src={imagePreview} alt="Preview" className="w-full max-h-[300px] object-cover" />
                  <button
                    onClick={() => {
                      setImage(null);
                      setImagePreview(null);
                    }}
                    className="absolute top-2 left-2 p-1 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
                  >
                    <X size={16} />
                  </button>
                </div>
              )}

              <div className="flex items-center justify-between mt-3 border-t border-border pt-3">
                <div className="flex gap-2">
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="p-2 rounded-full text-primary hover:bg-primary/10 transition-colors"
                  >
                    <Image size={20} />
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setIsPostFormOpen(false)}
                    className="px-4 py-2 rounded-full text-text-secondary hover:bg-surface-hover transition-colors"
                  >
                    キャンセル
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={!title.trim() || !content.trim() || isSubmitting}
                    className="px-4 py-2 rounded-full bg-primary text-white font-bold hover:bg-primary-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? '投稿中...' : '投稿'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {error && (
        <div className="p-4 bg-red-500/10 border-b border-border text-danger text-center">
          {error}
        </div>
      )}

      {/* Posts List */}
      <div>
        {posts.map((post) => (
          <PostCard
            key={post.id}
            post={post}
            onDelete={handleDelete}
            onUpdate={handleUpdate}
          />
        ))}
      </div>

      {!isLoading && posts.length === 0 && (
        <div className="p-8 text-center text-text-secondary">
          投稿がありません
        </div>
      )}
    </div>
  );
}
