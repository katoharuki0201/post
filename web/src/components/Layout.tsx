import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';

export function Layout() {
  return (
    <div className="min-h-screen bg-bg text-text flex justify-center">
      <div className="w-full max-w-[1265px] flex">
        {/* Left Sidebar */}
        <div className="w-[88px] xl:w-[275px] flex-shrink-0">
          <Sidebar />
        </div>

        {/* Main Content */}
        <main className="flex-1 min-w-0 border-x border-border">
          <Outlet />
        </main>

        {/* Right Sidebar */}
        <div className="hidden lg:block w-[350px] flex-shrink-0 pl-8 py-4">
          <div className="sticky top-4">
            <div className="bg-surface rounded-2xl p-4 mb-4">
              <h2 className="font-bold text-xl mb-4">おすすめ</h2>
              <div className="text-text-secondary text-sm">
                トレンド機能は準備中です
              </div>
            </div>
            <div className="text-text-muted text-xs">
              © 2026 Post App
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
