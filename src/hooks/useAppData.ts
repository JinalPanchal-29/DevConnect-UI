import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axiosInstance from '../api/axiosInstance';
import { fetchReceivedRequests, sendConnectionRequest } from '../api/requestApi';
import { setUser } from '../store/authSlice';
import { setFeed, removeUserFromFeed } from '../store/feedSlice';
import { setRequests } from '../store/requestSlice';
import type { RootState } from '../store/store';
import type { UserAuthData } from '../components/Login';

export type Tab = 'discover' | 'connections' | 'requests' | 'profile';

const mapBackendUser = (user: any): UserAuthData => ({
  _id: user._id,
  id: user._id,
  firstName: user.firstName,
  lastName: user.lastName,
  userName: user.userName,
  email: user.email || '',
  phoneNumber: user.phoneNumber,
  gender: user.gender,
  age: user.age,
  about: user.about,
  skills: user.skills,
  imageUrl: user.imageUrl,
});

export const useAppData = () => {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);
  const feedUsers = useSelector((state: RootState) => state.feed.users);

  const [activeTab, setActiveTab] = useState<Tab>('discover');
  const [bootstrapLoading, setBootstrapLoading] = useState(true);
  const [feedLoading, setFeedLoading] = useState(false);
  const [feedError, setFeedError] = useState('');
  const [swipeLoading, setSwipeLoading] = useState<string | null>(null);

  const bootstrapSession = async () => {
    try {
      const res = await axiosInstance.get('/getUserInfo');
      dispatch(setUser(res.data));
      const reqRes = await fetchReceivedRequests();
      dispatch(setRequests(reqRes.data.data || []));
    } catch (error) {
      console.log('[DevTinder] No active session found.');
    } finally {
      setBootstrapLoading(false);
    }
  };

  useEffect(() => {
    bootstrapSession();
  }, []);

  const fetchFeed = async () => {
    if (!user) return;
    setFeedLoading(true);
    setFeedError('');

    try {
      const res = await axiosInstance.get('/feed', {
        headers: {
          'Cache-Control': 'no-cache',
          Pragma: 'no-cache',
          Expires: '0',
        },
      });

      if (res.status === 304) {
        dispatch(setFeed([]));
        setFeedError('');
      } else {
        const mappedFeed = Array.isArray(res.data) ? res.data.map(mapBackendUser) : [];
        dispatch(setFeed(mappedFeed));
      }
    } catch (err: any) {
      if (err.response?.status === 304) {
        dispatch(setFeed([]));
        setFeedError('');
      } else {
        setFeedError(err.response?.data?.message || 'Failed to fetch developers feed.');
      }
    } finally {
      setFeedLoading(false);
    }
  };

  useEffect(() => {
    if (user && feedUsers === null) {
      fetchFeed();
    }
  }, [user, feedUsers]);

  const handleLoginSuccess = async (userData: UserAuthData) => {
    dispatch(setUser(userData));
    setActiveTab('discover');
    try {
      const reqRes = await fetchReceivedRequests();
      dispatch(setRequests(reqRes.data.data || []));
    } catch (error) {
      console.error(error);
    }
  };

  const handleProfileUpdate = (updatedUser: UserAuthData) => {
    dispatch(setUser(updatedUser));
  };

  const handleSwipe = async (targetUserId: string, action: 'interested' | 'ignored') => {
    setSwipeLoading(targetUserId);
    try {
      await sendConnectionRequest(action, targetUserId);
      dispatch(removeUserFromFeed(targetUserId));
    } catch (err: any) {
      alert(err.response?.data?.message || 'Action failed. Please try again.');
    } finally {
      setSwipeLoading(null);
    }
  };

  return {
    activeTab,
    bootstrapLoading,
    feedError,
    feedLoading,
    feedUsers,
    setActiveTab,
    handleLoginSuccess,
    handleProfileUpdate,
    handleSwipe,
    fetchFeed,
    swipeLoading,
    user,
  };
};
