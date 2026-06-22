import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axiosInstance from '../api/axiosInstance';
import { setConnections } from '../store/connectionSlice';
import type { RootState } from '../store/store';

export const Connections: React.FC = () => {
  const dispatch = useDispatch();
  const connections = useSelector((state: RootState) => state.connections.connections);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchConnections = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await axiosInstance.get('/user/connections');
      dispatch(setConnections(res.data.data || []));
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch connections.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!connections) {
      fetchConnections();
    }
  }, [connections]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <span className="loading loading-spinner loading-lg text-primary"></span>
        <p className="text-sm text-base-content/60 mt-4">Loading your connections...</p>
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
    <div className="w-full max-w-2xl mx-auto flex flex-col items-center gap-4">
      <div className="text-center mb-4">
        <p className="text-xs font-bold uppercase tracking-widest text-secondary mb-1">Your Network</p>
        <h2 className="text-3xl font-extrabold bg-gradient-to-r from-pink-500 to-red-500 bg-clip-text text-transparent">
          Connections
        </h2>
        <p className="text-xs text-base-content/50 mt-1">Developers you matched and connected with</p>
      </div>

      {!connections || connections.length === 0 ? (
        <div className="card w-full bg-base-100 shadow-xl border border-base-content/5 text-center p-8 rounded-2xl">
          <div className="flex justify-center mb-4">
            <div className="p-4 rounded-full bg-base-200 text-base-content/50">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
          </div>
          <h3 className="text-xl font-bold mb-2">No connections yet</h3>
          <p className="text-sm text-base-content/65 mb-4">
            Start swiping on the Discovery feed to find developers matching your stack!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 w-full">
          {connections.map((match: any) => {
            const displayName = `${match.firstName || ''} ${match.lastName || ''}`.trim() || match.userName || 'DevTinder User';
            const img = match.imageUrl || `https://avatar.iran.liara.run/public/username?username=${encodeURIComponent(displayName)}`;
            
            return (
              <div key={match._id || match.id} className="card bg-base-100 border border-base-content/5 shadow-sm hover:shadow-md transition-all rounded-xl group overflow-hidden">
                <div className="card-body p-5">
                  <div className="flex items-center gap-4">
                    <div className="avatar">
                      <div className="w-14 h-14 rounded-full ring ring-primary/10">
                        <img src={img} alt={displayName} />
                      </div>
                    </div>
                    <div className="flex-grow min-w-0">
                      <p className="font-bold text-base-content group-hover:text-primary transition-colors truncate">
                        {displayName}
                      </p>
                      <p className="text-xs text-base-content/60 truncate">
                        {match.gender || 'Developer'}{match.age ? `, ${match.age}` : ''}
                      </p>
                      {match.phoneNumber && (
                        <p className="text-xs text-primary font-medium mt-1 truncate select-all">
                          📞 {match.phoneNumber}
                        </p>
                      )}
                    </div>
                  </div>
                  {match.about && (
                    <p className="text-xs text-base-content/75 mt-3 line-clamp-2 italic">
                      "{match.about}"
                    </p>
                  )}
                  {match.skills && match.skills.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-3">
                      {match.skills.map((skill: string, idx: number) => (
                        <span key={idx} className="badge badge-neutral badge-xs py-1.5 font-semibold">
                          {skill}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Connections;
