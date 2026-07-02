import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { clearConnections } from '../store/connectionSlice';
import { removeRequest, setRequests } from '../store/requestSlice';
import type { RootState } from '../store/store';
import { fetchReceivedRequests, reviewConnectionRequest } from '../api/requestApi';

export const Requests: React.FC = () => {
  const dispatch = useDispatch();
  const requests = useSelector((state: RootState) => state.requests.requests);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const fetchRequests = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetchReceivedRequests();
      dispatch(setRequests(res.data.data || []));
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch requests.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!requests) {
      fetchRequests();
    }
  }, [requests]);

  const handleReview = async (requestId: string, status: 'accepted' | 'rejected') => {
    setActionLoading(requestId);
    try {
      await reviewConnectionRequest(status, requestId);
      dispatch(removeRequest(requestId));
      if (status === 'accepted') {
        dispatch(clearConnections());
      }
    } catch (err: any) {
      alert(err.response?.data?.message || `Failed to ${status} connection request.`);
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <span className="loading loading-spinner loading-lg text-primary"></span>
        <p className="text-sm text-base-content/60 mt-4">Loading connection requests...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-error max-w-md mx-auto my-6 rounded-xl shadow-md">
        <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span>{error}</span>
      </div>
    );
  }

  return (
    <div className="w-full max-w-xl mx-auto flex flex-col items-center gap-4">
      <div className="text-center mb-4">
        <p className="text-xs font-bold uppercase tracking-widest text-primary mb-1">Inbox</p>
        <h2 className="text-3xl font-extrabold bg-gradient-to-r from-pink-500 via-red-500 to-orange-500 bg-clip-text text-transparent">
          Connection Requests
        </h2>
        <p className="text-xs text-base-content/50 mt-1">Developers who want to connect with you</p>
      </div>

      {!requests || requests.length === 0 ? (
        <div className="card w-full bg-base-100 shadow-xl border border-base-content/5 text-center p-8 rounded-2xl">
          <div className="flex justify-center mb-4">
            <div className="p-4 rounded-full bg-base-200 text-base-content/50">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0a2 2 0 01-2 2H6a2 2 0 01-2-2m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
            </div>
          </div>
          <h3 className="text-xl font-bold mb-2">Inbox is empty</h3>
          <p className="text-sm text-base-content/65">
            You don't have any pending requests at the moment.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-3 w-full">
          {requests.map((req) => {
            const user = req.fromUserId;
            if (!user) return null;
            
            const displayName = `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.userName || 'DevConnect User';
            const img = user.imageUrl || `https://avatar.iran.liara.run/public/username?username=${encodeURIComponent(displayName)}`;
            const isButtonDisabled = actionLoading === req._id;

            return (
              <div key={req._id} className="card w-full bg-base-100 border border-base-content/5 shadow-sm hover:shadow-md transition-all rounded-xl overflow-hidden">
                <div className="card-body p-4 sm:p-5 flex-row flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-4 flex-1 min-w-[200px]">
                    <div className="avatar">
                      <div className="w-14 h-14 rounded-full ring ring-primary/10">
                        <img src={img} alt={displayName} />
                      </div>
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold text-base-content hover:text-primary transition-colors text-base truncate">
                        {displayName}
                      </p>
                      <p className="text-xs text-base-content/60 truncate">
                        {user.gender || 'Developer'}{user.age ? `, ${user.age}` : ''}
                      </p>
                      {user.skills && user.skills.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-1.5">
                          {user.skills.slice(0, 3).map((skill, idx) => (
                            <span key={idx} className="badge badge-neutral badge-xs font-semibold py-1">
                              {skill}
                            </span>
                          ))}
                          {user.skills.length > 3 && (
                            <span className="badge badge-outline badge-xs py-1">
                              +{user.skills.length - 3}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleReview(req._id, 'rejected')}
                      disabled={isButtonDisabled}
                      className="btn btn-outline btn-error btn-sm rounded-lg font-bold"
                    >
                      {isButtonDisabled && actionLoading === req._id ? (
                        <span className="loading loading-spinner loading-xs"></span>
                      ) : (
                        'Reject'
                      )}
                    </button>
                    <button
                      onClick={() => handleReview(req._id, 'accepted')}
                      disabled={isButtonDisabled}
                      className="btn btn-primary btn-sm rounded-lg font-bold text-white bg-gradient-to-r from-pink-500 to-red-500 border-none hover:brightness-105"
                    >
                      {isButtonDisabled && actionLoading === req._id ? (
                        <span className="loading loading-spinner loading-xs"></span>
                      ) : (
                        'Accept'
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Requests;
