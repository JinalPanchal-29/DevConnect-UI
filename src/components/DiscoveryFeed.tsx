import React from 'react';
import ProfileCard from './ProfileCard';
import type { UserAuthData } from './Login';

interface DiscoveryFeedProps {
  feedUsers: UserAuthData[] | null;
  feedLoading: boolean;
  feedError: string;
  swipeLoading: string | null;
  fetchFeed: () => Promise<void>;
  handleSwipe: (targetUserId: string, action: 'interested' | 'ignored') => Promise<void>;
}

const DiscoveryFeed: React.FC<DiscoveryFeedProps> = ({
  feedUsers,
  feedLoading,
  feedError,
  swipeLoading,
  fetchFeed,
  handleSwipe,
}) => {
  return (
    <div className="w-full max-w-md mx-auto flex flex-col items-center gap-6">
      <div className="text-center">
        <p className="text-xs font-bold uppercase tracking-widest text-primary mb-1">Discovery Feed</p>
        {feedUsers && feedUsers.length > 0 && (
          <h2 className="text-xl font-extrabold text-base-content/85">Find your perfect co-founder</h2>
        )}
      </div>

      {feedLoading ? (
        <div className="flex flex-col items-center py-12">
          <span className="loading loading-spinner loading-lg text-primary"></span>
          <p className="text-xs text-base-content/50 mt-4">Searching for developers...</p>
        </div>
      ) : feedError ? (
        <div className="alert alert-error rounded-xl shadow-md">
          <span>{feedError}</span>
          <button onClick={fetchFeed} className="btn btn-xs btn-outline border-white/20 text-white rounded-lg">Retry</button>
        </div>
      ) : feedUsers && feedUsers.length > 0 ? (
        <div className="relative w-full flex justify-center">
          <ProfileCard
            user={feedUsers[0]}
            onLike={() => handleSwipe(feedUsers[0]._id || feedUsers[0].id || '', 'interested')}
            onPass={() => handleSwipe(feedUsers[0]._id || feedUsers[0].id || '', 'ignored')}
          />
          {swipeLoading === (feedUsers[0]._id || feedUsers[0].id) && (
            <div className="absolute inset-0 bg-base-100/50 backdrop-blur-xs flex items-center justify-center rounded-2xl z-10">
              <span className="loading loading-spinner loading-lg text-primary"></span>
            </div>
          )}
        </div>
      ) : (
        <div className="card w-full bg-base-100 shadow-xl border border-base-content/5 text-center p-8 rounded-2xl">
          <div className="flex justify-center mb-4">
            <div className="p-4 rounded-full bg-pink-100 text-pink-500 animate-bounce">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
            </div>
          </div>
          <h3 className="text-2xl font-black mb-2">You've Swiped Everyone!</h3>
          <p className="text-sm text-base-content/65 mb-6">No more developers left to swipe. Check back later or review your connections!</p>
          <div className="flex justify-center gap-2">
            <button onClick={fetchFeed} className="btn btn-primary rounded-xl text-white font-bold bg-linear-to-r from-pink-500 to-red-500 border-none px-6">
              Refresh Feed
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DiscoveryFeed;
