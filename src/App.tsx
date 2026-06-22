import Connections from './components/Connections';
import DiscoveryFeed from './components/DiscoveryFeed';
import Login from './components/Login';
import Navbar from './components/Navbar';
import ProfileEdit from './components/ProfileEdit';
import Requests from './components/Requests';
import { useAppData } from './hooks/useAppData';

function App() {
  const {
    activeTab,
    bootstrapLoading,
    feedError,
    feedLoading,
    feedUsers,
    handleLoginSuccess,
    handleProfileUpdate,
    handleSwipe,
    fetchFeed,
    setActiveTab,
    swipeLoading,
    user,
  } = useAppData();

  if (bootstrapLoading) {
    return (
      <div className="min-h-screen bg-base-200 flex flex-col items-center justify-center font-sans">
        <div className="inline-flex items-center gap-2 mb-6 animate-pulse">
          <svg className="w-12 h-12 text-pink-500 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span className="text-4xl font-black tracking-wider bg-linear-to-r from-pink-500 via-red-500 to-orange-500 bg-clip-text text-transparent">
            DevTinder
          </span>
        </div>
        <span className="loading loading-ring loading-lg text-primary"></span>
        <p className="text-xs text-base-content/50 mt-4 tracking-widest uppercase">Initializing Dev Environment...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-base-200 flex flex-col justify-center overflow-y-auto">
        <Login onLoginSuccess={handleLoginSuccess} />
        <footer className="footer footer-center p-6 bg-base-100/50 text-base-content/40 border-t border-base-content/5">
          <p className="text-xs">© 2026 DevTinder.</p>
        </footer>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-200 text-base-content flex flex-col font-sans selection:bg-primary/20">
      <Navbar activeTab={activeTab} onTabChange={setActiveTab} />

      <main className="grow flex flex-col items-center justify-start py-8 px-4 sm:px-6 lg:px-8 gap-8 w-full">
        <div className="w-full max-w-7xl mx-auto">
          {activeTab === 'discover' && (
            <DiscoveryFeed
              feedUsers={feedUsers}
              feedLoading={feedLoading}
              feedError={feedError}
              swipeLoading={swipeLoading}
              fetchFeed={fetchFeed}
              handleSwipe={handleSwipe}
            />
          )}

          {activeTab === 'connections' && <Connections />}
          {activeTab === 'requests' && <Requests />}
          {activeTab === 'profile' && (
            <div className="w-full flex flex-col items-center gap-6">
              <div className="text-center">
                <p className="text-xs font-bold uppercase tracking-widest text-secondary mb-1">Your Developer Profile</p>
              </div>
              <ProfileEdit user={user} onProfileUpdate={handleProfileUpdate} />
            </div>
          )}
        </div>
      </main>

      <footer className="footer footer-center p-6 bg-base-100 text-base-content/60 border-t border-base-content/5">
        <aside>
          <p className="text-xs">© 2026 DevTinder.</p>
        </aside>
      </footer>
    </div>
  );
}

export default App;
