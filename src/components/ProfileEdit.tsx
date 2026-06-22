import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import axiosInstance from '../api/axiosInstance';
import { updateUser } from '../store/authSlice';
import type { UserAuthData } from './Login';
import ProfileCard from './ProfileCard';

interface ProfileEditProps {
  user: UserAuthData;
  onProfileUpdate: (updatedUser: UserAuthData) => void;
}

export const ProfileEdit: React.FC<ProfileEditProps> = ({ user, onProfileUpdate }) => {
  const dispatch = useDispatch();
  // Form states
  const [firstName, setFirstName] = useState(user.firstName || '');
  const [lastName, setLastName] = useState(user.lastName || '');
  const [age, setAge] = useState(user.age || '');
  const [gender, setGender] = useState(user.gender || 'Male');
  const [phoneNumber, setPhoneNumber] = useState(user.phoneNumber || '');
  const [about, setAbout] = useState(user.about || '');
  const [skills, setSkills] = useState(user.skills ? user.skills.join(', ') : '');
  const [imageUrl, setImageUrl] = useState(user.imageUrl || '');

  // Password change states
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');

  // UI States
  const [profileMessage, setProfileMessage] = useState('');
  const [profileError, setProfileError] = useState('');
  const [passwordMessage, setPasswordMessage] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [loading, setLoading] = useState(false);
  const [passLoading, setPassLoading] = useState(false);

  // Live preview builder
  const previewSkills = skills.split(',').map((s) => s.trim()).filter(Boolean);
  const previewImageUrl = imageUrl || `https://avatar.iran.liara.run/public/username?username=${encodeURIComponent(user.userName || `${user.firstName} ${user.lastName}`)}`;

  const previewProfile: UserAuthData = {
    ...user,
    firstName: firstName || user.firstName,
    lastName: lastName || user.lastName,
    age: age ? String(age) : user.age,
    gender,
    phoneNumber,
    about: about || user.about || '',
    skills: previewSkills.length > 0 ? previewSkills : user.skills || [],
    imageUrl: previewImageUrl,
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileMessage('');
    setProfileError('');
    setLoading(true);

    try {
      const skillsArray = skills.split(',').map((s) => s.trim()).filter(Boolean);
      const res = await axiosInstance.patch('/updateProfile', {
        firstName,
        lastName,
        age: String(age),
        gender,
        phoneNumber,
        about,
        skills: skillsArray,
        imageUrl,
      });

      setProfileMessage(res.data.message || 'Profile updated successfully!');
      
      const updatedData = res.data.user || {
        ...user,
        firstName,
        lastName,
        age: String(age),
        gender,
        phoneNumber,
        about,
        skills: skillsArray,
        imageUrl,
      };

      // Dispatch to Redux store
      dispatch(updateUser(updatedData));
      
      // Call parent update callback to sync App state
      onProfileUpdate(updatedData);
    } catch (err: any) {
      setProfileError(err.response?.data?.message || 'Failed to update profile.');
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordMessage('');
    setPasswordError('');

    if (newPassword !== confirmNewPassword) {
      setPasswordError('New passwords do not match.');
      return;
    }

    setPassLoading(true);
    try {
      const res = await axiosInstance.patch('/changePassword', {
        currentPassword,
        newPassword,
      });

      setPasswordMessage(res.data.message || 'Password changed successfully!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
    } catch (err: any) {
      setPasswordError(err.response?.data?.message || 'Failed to change password.');
    } finally {
      setPassLoading(false);
    }
  };

  return (
    <div className="w-full max-w-5xl px-4 py-2">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* EDIT PROFILE FORM & PASSWORD CHANGE */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* PROFILE DATA CARD */}
          <div className="card bg-base-100 shadow-xl border border-base-content/5 rounded-2xl">
            <div className="card-body p-6 sm:p-8">
              <h2 className="card-title text-2xl font-bold bg-linear-to-r from-pink-500 to-red-500 bg-clip-text text-transparent mb-4">
                Edit Profile Info
              </h2>

              {profileMessage && (
                <div className="alert alert-success text-sm py-2 px-3 rounded-lg mb-4 flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-5 w-5" fill="none" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{profileMessage}</span>
                </div>
              )}

              {profileError && (
                <div className="alert alert-error text-sm py-2 px-3 rounded-lg mb-4 flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-5 w-5" fill="none" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{profileError}</span>
                </div>
              )}

              <form onSubmit={handleUpdateProfile} className="space-y-4">
                {/* First Name + Last Name */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="form-control">
                    <label className="label text-xs font-bold text-base-content/70">First Name</label>
                    <input
                      type="text"
                      className="input input-bordered w-full rounded-xl text-sm focus:input-primary"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="form-control">
                    <label className="label text-xs font-bold text-base-content/70">Last Name</label>
                    <input
                      type="text"
                      className="input input-bordered w-full rounded-xl text-sm focus:input-primary"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      required
                    />
                  </div>
                </div>

                {/* Age + Gender */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="form-control">
                    <label className="label text-xs font-bold text-base-content/70">Age</label>
                    <input
                      type="number"
                      className="input input-bordered w-full rounded-xl text-sm focus:input-primary"
                      value={age}
                      onChange={(e) => setAge(e.target.value)}
                      min="18"
                      max="100"
                      required
                    />
                  </div>
                  <div className="form-control">
                    <label className="label text-xs font-bold text-base-content/70">Gender</label>
                    <select
                      className="select select-bordered w-full rounded-xl text-sm focus:select-primary"
                      value={gender}
                      onChange={(e) => setGender(e.target.value)}
                      required
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Others">Others</option>
                    </select>
                  </div>
                </div>

                {/* Phone Number */}
                <div className="form-control">
                  <label className="label text-xs font-bold text-base-content/70">Phone Number</label>
                  <input
                    type="tel"
                    className="input input-bordered w-full rounded-xl text-sm focus:input-primary"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    required
                  />
                </div>

                {/* Image URL */}
                <div className="form-control">
                  <label className="label text-xs font-bold text-base-content/70">Image URL</label>
                  <input
                    type="url"
                    placeholder="https://example.com/your-image.jpg"
                    className="input input-bordered w-full rounded-xl text-sm focus:input-primary"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                  />
                </div>

                {/* Skills */}
                <div className="form-control">
                  <label className="label text-xs font-bold text-base-content/70">Skills (comma-separated)</label>
                  <input
                    type="text"
                    placeholder="e.g. React, Node, Python, MongoDB"
                    className="input input-bordered w-full rounded-xl text-sm focus:input-primary"
                    value={skills}
                    onChange={(e) => setSkills(e.target.value)}
                  />
                </div>

                {/* About Bio */}
                <div className="form-control">
                  <label className="label text-xs font-bold text-base-content/70">About / Bio</label>
                  <textarea
                    placeholder="Write a brief bio about yourself..."
                    className="textarea textarea-bordered w-full rounded-xl text-sm focus:textarea-primary h-24"
                    value={about}
                    onChange={(e) => setAbout(e.target.value)}
                  />
                </div>

                <div className="form-control pt-2">
                  <button
                    type="submit"
                    className="btn btn-primary w-full rounded-xl text-white font-bold"
                    disabled={loading}
                  >
                    {loading ? <span className="loading loading-spinner loading-sm"></span> : 'Save Changes'}
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* PASSWORD CHANGE CARD */}
          <div className="card bg-base-100 shadow-xl border border-base-content/5 rounded-2xl">
            <div className="card-body p-6 sm:p-8">
              <h2 className="card-title text-2xl font-bold bg-linear-to-r from-pink-500 to-red-500 bg-clip-text text-transparent mb-4">
                Change Password
              </h2>

              {passwordMessage && (
                <div className="alert alert-success text-sm py-2 px-3 rounded-lg mb-4 flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-5 w-5" fill="none" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{passwordMessage}</span>
                </div>
              )}

              {passwordError && (
                <div className="alert alert-error text-sm py-2 px-3 rounded-lg mb-4 flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-5 w-5" fill="none" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{passwordError}</span>
                </div>
              )}

              <form onSubmit={handleChangePassword} className="space-y-4">
                <div className="form-control">
                  <label className="label text-xs font-bold text-base-content/70">Current Password</label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    className="input input-bordered w-full rounded-xl text-sm focus:input-primary"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="form-control">
                    <label className="label text-xs font-bold text-base-content/70">New Password</label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      className="input input-bordered w-full rounded-xl text-sm focus:input-primary"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                    />
                  </div>
                  <div className="form-control">
                    <label className="label text-xs font-bold text-base-content/70">Confirm New Password</label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      className="input input-bordered w-full rounded-xl text-sm focus:input-primary"
                      value={confirmNewPassword}
                      onChange={(e) => setConfirmNewPassword(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="form-control pt-2">
                  <button
                    type="submit"
                    className="btn btn-neutral w-full rounded-xl text-white font-bold"
                    disabled={passLoading}
                  >
                    {passLoading ? <span className="loading loading-spinner loading-sm"></span> : 'Update Password'}
                  </button>
                </div>
              </form>
            </div>
          </div>

        </div>

        {/* LIVE CARD PREVIEW COLUMN */}
        <div className="lg:col-span-5 flex flex-col items-center lg:sticky lg:top-24 w-full">
          <div className="w-full max-w-md">
            <p className="text-xs font-bold uppercase tracking-widest text-secondary mb-3">How others see you</p>
            <ProfileCard user={previewProfile} />
          </div>
        </div>

      </div>
    </div>
  );
};

export default ProfileEdit;
