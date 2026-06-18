import { useState, useCallback } from 'react';
import { Trash2, Edit2, Image, X } from 'lucide-react';
import { api } from '../api/client';
import type { Post } from '../api/client';
import { useAuth } from '../contexts/AuthContext';

interface PostCardProps {
  post: Post;
  onDelete?: (id: number) => void;
  onUpdate?: (post: Post) => void;
}

export function PostCard({ post, onDelete, onUpdate }: PostCardProps) {
  const { user } = useAuth();
  const [showEditForm, setShowEditForm] = useState(false);
  const [editTitle, setEditTitle] = useState(post.title);
  const [editContent, setEditContent] = useState(post.content);
  const [editImage, setEditImage] = useState<File | null>(null);
  const [editImagePreview, setEditImagePreview] = useState<string | null>(null);
  const [removeImage, setRemoveImage] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const isOwner = user?.id === post.user?.id;

  const handleDelete = useCallback(async () => {
    if (!isOwner || isDeleting) return;
    if (!confirm('この投稿を削除しますか？')) return;
    setIsDeleting(true);
    try {
      await api.deletePost(post.id);
      onDelete?.(post.id);
    } catch (error) {
      console.error('Delete error:', error);
      alert('削除に失敗しました');
    } finally {
      setIsDeleting(false);
    }
  }, [isOwner, isDeleting, post.id, onDelete]);

  const handleEditImageChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setEditImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const handleUpdate = useCallback(async () => {
    if (!isOwner) return;
    try {
      const updated = await api.updatePost(post.id, editTitle, editContent, editImage || undefined, removeImage);
      const postWithUser: Post = {
        ...updated,
        user: post.user,
      };
      setShowEditForm(false);
      setEditImage(null);
      setEditImagePreview(null);
      setRemoveImage(false);
      onUpdate?.(postWithUser);
    } catch (error) {
      console.error('Update error:', error);
      alert('更新に失敗しました');
    }
  }, [isOwner, post.id, editTitle, editContent, editImage, removeImage, onUpdate, post.user]);

  const dateStr = new Date(post.created_at).toLocaleString('ja-JP', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <article className="border-b border-border hover:bg-surface-hover transition-colors duration-200">
      {showEditForm ? (
        <div className="p-4">
          <div className="mb-3">
            <input
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              className="w-full bg-surface border border-border rounded-lg px-4 py-2 text-text placeholder-text-secondary focus:outline-none focus:border-primary"
              placeholder="タイトル"
            />
          </div>
          <div className="mb-3">
            <textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              rows={3}
              className="w-full bg-surface border border-border rounded-lg px-4 py-2 text-text placeholder-text-secondary focus:outline-none focus:border-primary resize-none"
              placeholder="内容"
            />
          </div>

          {(editImagePreview || (post.image_url && !removeImage)) && (
            <div className="relative mb-3 rounded-2xl overflow-hidden border border-border">
              <img
                src={editImagePreview || post.image_url || ''}
                alt="Preview"
                className="w-full max-h-[300px] object-cover"
              />
              <button
                onClick={() => {
                  setEditImage(null);
                  setEditImagePreview(null);
                  setRemoveImage(true);
                }}
                className="absolute top-2 left-2 p-1 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
              >
                <X size={16} />
              </button>
            </div>
          )}

          <div className="flex items-center justify-between mb-3">
            <div className="flex gap-2">
              <label className="p-2 rounded-full text-primary hover:bg-primary/10 transition-colors cursor-pointer">
                <Image size={20} />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleEditImageChange}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          <div className="flex gap-2 justify-end">
            <button
              onClick={() => {
                setShowEditForm(false);
                setEditImage(null);
                setEditImagePreview(null);
                setRemoveImage(false);
              }}
              className="px-4 py-2 rounded-full text-text-secondary hover:bg-surface-hover transition-colors"
            >
              キャンセル
            </button>
            <button
              onClick={handleUpdate}
              className="px-4 py-2 rounded-full bg-primary text-white font-bold hover:bg-primary-hover transition-colors"
            >
              保存
            </button>
          </div>
        </div>
      ) : (
        <div className="p-4">
          <div className="flex gap-3">
            {/* Avatar */}
            <div className="flex-shrink-0">
              <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-bold text-sm">
                {post.user?.name?.charAt(0).toUpperCase() || '?'}
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-bold text-text hover:underline truncate">
                  {post.user?.name || '不明なユーザー'}
                </span>
                <span className="text-text-secondary text-sm">@{post.user?.email?.split('@')[0] || 'unknown'}</span>
                <span className="text-text-secondary text-sm">·</span>
                <span className="text-text-secondary text-sm">{dateStr}</span>
                {isOwner && (
                  <div className="ml-auto flex gap-1">
                    <button
                      onClick={() => setShowEditForm(true)}
                      className="p-2 rounded-full text-text-secondary hover:text-primary hover:bg-primary/10 transition-colors"
                      title="編集"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={handleDelete}
                      disabled={isDeleting}
                      className="p-2 rounded-full text-text-secondary hover:text-danger hover:bg-red-500/10 transition-colors"
                      title="削除"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                )}
              </div>

              <h3 className="text-text font-bold mb-2">{post.title}</h3>
              <p className="text-text whitespace-pre-wrap break-words mb-3">
                {post.content}
              </p>

              {post.image_url && (
                <div className="mb-3 rounded-2xl overflow-hidden border border-border">
                  <img
                    src={post.image_url}
                    alt={post.title}
                    className="w-full max-h-[500px] object-cover"
                    loading="lazy"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </article>
  );
}
