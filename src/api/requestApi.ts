import axiosInstance from './axiosInstance';

export type SendStatus = 'interested' | 'ignored';
export type ReviewStatus = 'accepted' | 'rejected';

export const sendConnectionRequest = async (status: SendStatus, userId: string) => {
  return axiosInstance.post(`/send/${status}/${userId}`);
};

export const reviewConnectionRequest = async (status: ReviewStatus, requestId: string) => {
  return axiosInstance.post(`/review/${status}/${requestId}`);
};

export const fetchReceivedRequests = async () => {
  return axiosInstance.get('/user/requests/recieved');
};
