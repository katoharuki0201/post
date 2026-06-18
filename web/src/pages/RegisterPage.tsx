import { useState, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;
    setIsLoading(true);
    setError(null);
    try {
      await register(name, email, password);
      navigate('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : '登録に失敗しました');
    } finally {
      setIsLoading(false);
    }
  }, [name, email, password, isLoading, register, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <svg viewBox="0 0 24 24" width="40" height="40" fill="currentColor" className="text-text mx-auto mb-4">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
          </svg>
          <h1 className="text-3xl font-bold text-text">アカウント登録</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 bg-red-500/10 rounded-lg text-danger text-sm text-center">
              {error}
            </div>
          )}

          <div>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="名前"
              required
              className="w-full bg-surface border border-border rounded-lg px-4 py-3 text-text placeholder-text-secondary focus:outline-none focus:border-primary"
            />
          </div>

          <div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="メールアドレス"
              required
              className="w-full bg-surface border border-border rounded-lg px-4 py-3 text-text placeholder-text-secondary focus:outline-none focus:border-primary"
            />
          </div>

          <div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="パスワード"
              required
              minLength={8}
              className="w-full bg-surface border border-border rounded-lg px-4 py-3 text-text placeholder-text-secondary focus:outline-none focus:border-primary"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 rounded-full bg-primary text-white font-bold hover:bg-primary-hover transition-colors disabled:opacity-50"
          >
            {isLoading ? '登録中...' : '登録'}
          </button>
        </form>

        <div className="mt-6 text-center text-text-secondary">
          既にアカウントをお持ちですか？{' '}
          <Link to="/login" className="text-primary hover:underline">
            ログイン
          </Link>
        </div>
      </div>
    </div>
  );
}
