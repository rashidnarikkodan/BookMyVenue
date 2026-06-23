import React, { useEffect, useState, useRef } from 'react';
import { useAppStore } from '@/store/app.store';
import { profileApi, type ProfileResponse } from '../services/profile.api';
import { toast } from 'sonner';
import {
  User as UserIcon,
  Mail,
  Phone,
  Building,
  Upload,
  Clock,
  CheckCircle,
  XCircle,
  MapPin,
  CreditCard,
  Camera,
  FileText,
  Loader2,
} from 'lucide-react';

const UserProfile = () => {
  const currentUser = useAppStore((state) => state.user);
  const setAuth = useAppStore((state) => state.setAuth);
  const setOwner = useAppStore((state) => state.setOwner);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profileData, setProfileData] = useState<ProfileResponse['data'] | null>(null);

  // Form states
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');

  // Owner states
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [pincode, setPincode] = useState('');
  const [accountHolderName, setAccountHolderName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [ifscCode, setIfscCode] = useState('');

  // File states
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string>('');

  const [profileImageFile, setProfileImageFile] = useState<File | null>(null);
  const [profileImagePreview, setProfileImagePreview] = useState<string>('');

  const [idProofFile, setIdProofFile] = useState<File | null>(null);
  const [idProofName, setIdProofName] = useState<string>('');

  // Input refs
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const profileImageInputRef = useRef<HTMLInputElement>(null);
  const idProofInputRef = useRef<HTMLInputElement>(null);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const res = await profileApi.getProfile();
      if (res.success) {
        setProfileData(res.data);
        setOwner(res.data.owner || null);
        // Initialize form fields
        setFullName(res.data.user.fullName || '');
        setPhoneNumber(res.data.user.phoneNumber || '');
        setAvatarPreview(res.data.user.avatar || '');

        if (res.data.owner) {
          setStreet(res.data.owner.address?.street || '');
          setCity(res.data.owner.address?.city || '');
          setState(res.data.owner.address?.state || '');
          setPincode(res.data.owner.address?.pincode || '');

          setAccountHolderName(res.data.owner.bankDetails?.accountHolderName || '');
          setAccountNumber(res.data.owner.bankDetails?.accountNumber || '');
          setIfscCode(res.data.owner.bankDetails?.ifscCode || '');
          setProfileImagePreview(res.data.owner.profileImage || '');

          if (res.data.owner.idProof) {
            const parts = res.data.owner.idProof.split('/');
            setIdProofName(parts[parts.length - 1] || 'Current ID Proof');
          }
        }
      }
    } catch (err: any) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Failed to load profile details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleProfileImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfileImageFile(file);
      setProfileImagePreview(URL.createObjectURL(file));
    }
  };

  const handleIdProofChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIdProofFile(file);
      setIdProofName(file.name);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const formData = new FormData();
      formData.append('fullName', fullName);
      formData.append('phoneNumber', phoneNumber);

      if (avatarFile) {
        formData.append('avatar', avatarFile);
      }

      if (currentUser?.role === 'owner') {
        formData.append('street', street);
        formData.append('city', city);
        formData.append('state', state);
        formData.append('pincode', pincode);
        formData.append('accountHolderName', accountHolderName);
        formData.append('accountNumber', accountNumber);
        formData.append('ifscCode', ifscCode);

        if (profileImageFile) {
          formData.append('profileImage', profileImageFile);
        }
        if (idProofFile) {
          formData.append('idProof', idProofFile);
        }
      }

      const res = await profileApi.updateProfile(formData);
      if (res.success) {
        toast.success('Profile updated successfully!');
        setProfileData(res.data);
        setOwner(res.data.owner || null);

        // Update globally stored user details
        setAuth({
          ...currentUser,
          _id: res.data.user._id,
          fullName: res.data.user.fullName,
          email: res.data.user.email,
          role: res.data.user.role,
          avatar: res.data.user.avatar,
        });

        // Clear local file states
        setAvatarFile(null);
        setProfileImageFile(null);
        setIdProofFile(null);

        // Update ID proof name from updated file if present
        if (res.data.owner?.idProof) {
          const parts = res.data.owner.idProof.split('/');
          setIdProofName(parts[parts.length - 1] || 'Current ID Proof');
        }
      }
    } catch (err: any) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
        <p className="text-foreground/70 font-medium">Loading profile details...</p>
      </div>
    );
  }

  const user = profileData?.user;
  const owner = profileData?.owner;

  return (
    <div className="w-full max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
      {/* Page Title */}
      <div className="mb-10">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight">Account Settings</h1>
        <p className="mt-2 text-sm sm:text-base text-foreground/60">
          Manage your personal details, credentials, and venue owner onboarding details.
        </p>
      </div>

      {/* Verification Banner for Owners */}
      {user?.role === 'owner' && (
        <div className="mb-8">
          {!owner ? (
            <div className="flex gap-4 p-6 rounded-2xl border border-warning/30 bg-warning/5 text-warning-foreground">
              <Clock className="w-6 h-6 flex-shrink-0 text-warning" />
              <div>
                <h4 className="font-semibold text-base">Onboarding Required</h4>
                <p className="mt-1.5 text-sm sm:text-base text-foreground/75 leading-relaxed">
                  You are registered as a Venue Owner. Please complete the **Venue Owner Info** section below to submit your details for verification. Once approved, you can start listing venues.
                </p>
              </div>
            </div>
          ) : owner.verificationStatus === 'pending' ? (
            <div className="flex gap-4 p-6 rounded-2xl border border-warning/30 bg-warning/5 text-warning-foreground">
              <Clock className="w-6 h-6 flex-shrink-0 text-warning" />
              <div>
                <h4 className="font-semibold text-base">Verification Pending</h4>
                <p className="mt-1.5 text-sm sm:text-base text-foreground/75 leading-relaxed">
                  Your owner profile is currently pending administrator verification. We will verify your ID proof and bank details shortly.
                </p>
              </div>
            </div>
          ) : owner.verificationStatus === 'approved' ? (
            <div className="flex gap-4 p-6 rounded-2xl border border-success/30 bg-success/5 text-success-foreground">
              <CheckCircle className="w-6 h-6 flex-shrink-0 text-success" />
              <div>
                <h4 className="font-semibold text-base">Verification Approved</h4>
                <p className="mt-1.5 text-sm sm:text-base text-foreground/75 leading-relaxed">
                  Congratulations! Your owner profile has been fully verified and approved. You have full access to listing and managing venues.
                </p>
              </div>
            </div>
          ) : (
            <div className="flex gap-4 p-6 rounded-2xl border border-error/30 bg-error/5 text-error-foreground">
              <XCircle className="w-6 h-6 flex-shrink-0 text-error" />
              <div>
                <h4 className="font-semibold text-base">Verification Rejected</h4>
                <p className="mt-1.5 text-sm sm:text-base text-foreground/75 leading-relaxed">
                  Your verification details were rejected. Please review the reason below, update your details, and resubmit for approval.
                </p>
                {owner.rejectionReason && (
                  <div className="mt-4 p-4 rounded-xl bg-error/10 border border-error/20 text-xs sm:text-sm font-semibold text-error">
                    Reason: {owner.rejectionReason}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Outer Layout Box */}
      <div className="bg-surface rounded-3xl border border-border shadow-md overflow-hidden min-h-[600px] w-full">
        {/* Form Container */}
        <form onSubmit={handleSubmit} className="p-8 sm:p-12 md:p-14 flex flex-col justify-between">
          <div className="space-y-12">
            {/* 1. PERSONAL INFO SECTION */}
            <div className="space-y-8">
              <div>
                <h3 className="text-xl sm:text-2xl font-bold text-foreground">Personal Information</h3>
                <p className="text-sm text-foreground/50 mt-1.5">Configure your primary contact and identification data.</p>
              </div>

              {/* Avatar upload */}
              <div className="flex items-center gap-6">
                <div className="relative group">
                  <div className="w-28 h-28 rounded-full overflow-hidden border-2 border-border bg-muted/20 flex items-center justify-center">
                    {avatarPreview ? (
                      <img src={avatarPreview} alt="Avatar" className="w-full h-full object-cover" />
                    ) : (
                      <UserIcon className="w-12 h-12 text-foreground/30" />
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => avatarInputRef.current?.click()}
                    className="absolute bottom-0 right-0 p-2.5 rounded-full bg-primary text-white border-2 border-surface shadow-md hover:bg-accent transition-all duration-200 cursor-pointer"
                    aria-label="Upload Avatar"
                  >
                    <Camera size={16} />
                  </button>
                  <input
                    type="file"
                    ref={avatarInputRef}
                    onChange={handleAvatarChange}
                    accept="image/*"
                    className="hidden"
                  />
                </div>
                <div>
                  <h4 className="text-base sm:text-lg font-semibold text-foreground">Profile Picture</h4>
                  <p className="text-sm text-foreground/50 mt-1">JPG, PNG or GIF. Max 5MB.</p>
                </div>
              </div>

              <div className="grid gap-6 grid-cols-1 sm:grid-cols-2">
                {/* Full Name */}
                <div className="space-y-2">
                  <label htmlFor="fullName" className="text-sm font-semibold text-foreground/80">Full Name</label>
                  <div className="relative">
                    <UserIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-foreground/40" />
                    <input
                      id="fullName"
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="John Doe"
                      className="w-full pl-11 pr-4 py-3 rounded-xl border border-border bg-surface text-sm sm:text-base text-foreground focus:outline-none focus:border-primary transition-all duration-200 shadow-xs"
                    />
                  </div>
                </div>

                {/* Phone Number */}
                <div className="space-y-2">
                  <label htmlFor="phoneNumber" className="text-sm font-semibold text-foreground/80">Phone Number</label>
                  <div className="relative">
                    <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-foreground/40" />
                    <input
                      id="phoneNumber"
                      type="tel"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      placeholder="+1234567890"
                      className="w-full pl-11 pr-4 py-3 rounded-xl border border-border bg-surface text-sm sm:text-base text-foreground focus:outline-none focus:border-primary transition-all duration-200 shadow-xs"
                    />
                  </div>
                </div>

                {/* Email (Read Only) */}
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-semibold text-foreground/80">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-foreground/40" />
                    <input
                      id="email"
                      type="email"
                      disabled
                      value={user?.email || ''}
                      className="w-full pl-11 pr-4 py-3 rounded-xl border border-border bg-muted/20 text-sm sm:text-base text-foreground/60 cursor-not-allowed"
                    />
                  </div>
                  <span className="text-xs text-foreground/40">Registered email cannot be modified.</span>
                </div>

                {/* Role (Read Only) */}
                <div className="space-y-2">
                  <label htmlFor="role" className="text-sm font-semibold text-foreground/80">User Role</label>
                  <div className="relative">
                    <Building className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-foreground/40" />
                    <input
                      id="role"
                      type="text"
                      disabled
                      value={user?.role?.toUpperCase() || 'USER'}
                      className="w-full pl-11 pr-4 py-3 rounded-xl border border-border bg-muted/20 text-sm sm:text-base text-foreground/60 cursor-not-allowed"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* 2. OWNER INFO SECTION */}
            {user?.role === 'owner' && (
              <div className="space-y-8 border-t border-border pt-10">
                <div>
                  <h3 className="text-xl sm:text-2xl font-bold text-foreground">Venue Owner Information</h3>
                  <p className="text-sm text-foreground/50 mt-1.5">Submit documents, business address and bank details for revenue payouts.</p>
                </div>

                {/* Owner profileImage and ID Proof */}
                <div className="grid gap-6 grid-cols-1 sm:grid-cols-2">
                  {/* Profile Image (Business Logo or Photo) */}
                  <div className="space-y-2.5">
                    <label className="text-sm font-semibold text-foreground/80">Owner Profile Image / Logo</label>
                    <div className="flex items-center gap-5">
                      <div className="w-20 h-20 rounded-xl border border-border overflow-hidden bg-muted/20 flex items-center justify-center flex-shrink-0">
                        {profileImagePreview ? (
                          <img src={profileImagePreview} alt="Owner Profile" className="w-full h-full object-cover" />
                        ) : (
                          <Building className="w-8 h-8 text-foreground/30" />
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => profileImageInputRef.current?.click()}
                        className="px-4 py-2 border border-border hover:bg-muted/30 text-xs sm:text-sm font-semibold rounded-xl text-foreground cursor-pointer flex items-center gap-2"
                      >
                        <Camera size={14} />
                        Choose Photo
                      </button>
                      <input
                        type="file"
                        ref={profileImageInputRef}
                        onChange={handleProfileImageChange}
                        accept="image/*"
                        className="hidden"
                      />
                    </div>
                  </div>

                  {/* ID Proof upload */}
                  <div className="space-y-2.5">
                    <label className="text-sm font-semibold text-foreground/80">ID Proof (PDF, JPG, PNG)</label>
                    <div className="flex items-center gap-4">
                      <button
                        type="button"
                        onClick={() => idProofInputRef.current?.click()}
                        className="px-4 py-2 bg-primary/10 text-primary hover:bg-primary/20 text-xs sm:text-sm font-semibold rounded-xl cursor-pointer flex items-center gap-2"
                      >
                        <Upload size={14} />
                        Upload Document
                      </button>
                      <input
                        type="file"
                        ref={idProofInputRef}
                        onChange={handleIdProofChange}
                        accept="image/*,application/pdf"
                        className="hidden"
                      />
                      {idProofName ? (
                        <div className="flex items-center gap-1.5 text-xs sm:text-sm font-medium text-foreground/70 truncate max-w-[200px]">
                          <FileText size={14} className="text-primary flex-shrink-0" />
                          <span className="truncate">{idProofName}</span>
                        </div>
                      ) : (
                        <span className="text-xs text-foreground/40">No document uploaded.</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Address Section */}
                <div className="space-y-4 border-t border-border pt-6">
                  <h4 className="text-sm sm:text-base font-bold text-foreground/80 uppercase tracking-wider flex items-center gap-2">
                    <MapPin size={14} className="text-primary" />
                    Business / Contact Address
                  </h4>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label htmlFor="street" className="text-xs font-semibold text-foreground/60">Street Address</label>
                      <input
                        id="street"
                        type="text"
                        value={street}
                        onChange={(e) => setStreet(e.target.value)}
                        placeholder="123 Main St, Suite 400"
                        className="w-full px-4 py-3 rounded-xl border border-border bg-surface text-sm sm:text-base text-foreground focus:outline-none focus:border-primary transition-all duration-200"
                      />
                    </div>

                    <div className="grid gap-5 grid-cols-1 sm:grid-cols-3">
                      <div className="space-y-2">
                        <label htmlFor="city" className="text-xs font-semibold text-foreground/60">City</label>
                        <input
                          id="city"
                          type="text"
                          value={city}
                          onChange={(e) => setCity(e.target.value)}
                          placeholder="New York"
                          className="w-full px-4 py-3 rounded-xl border border-border bg-surface text-sm sm:text-base text-foreground focus:outline-none focus:border-primary transition-all duration-200"
                        />
                      </div>

                      <div className="space-y-2">
                        <label htmlFor="state" className="text-xs font-semibold text-foreground/60">State / Region</label>
                        <input
                          id="state"
                          type="text"
                          value={state}
                          onChange={(e) => setState(e.target.value)}
                          placeholder="NY"
                          className="w-full px-4 py-3 rounded-xl border border-border bg-surface text-sm sm:text-base text-foreground focus:outline-none focus:border-primary transition-all duration-200"
                        />
                      </div>

                      <div className="space-y-2">
                        <label htmlFor="pincode" className="text-xs font-semibold text-foreground/60">Pincode</label>
                        <input
                          id="pincode"
                          type="text"
                          value={pincode}
                          onChange={(e) => setPincode(e.target.value)}
                          placeholder="10001"
                          className="w-full px-4 py-3 rounded-xl border border-border bg-surface text-sm sm:text-base text-foreground focus:outline-none focus:border-primary transition-all duration-200"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bank details Section */}
                <div className="space-y-4 border-t border-border pt-6">
                  <h4 className="text-sm sm:text-base font-bold text-foreground/80 uppercase tracking-wider flex items-center gap-2">
                    <CreditCard size={14} className="text-primary" />
                    Payout Bank Account Details
                  </h4>

                  <div className="grid gap-5 grid-cols-1 sm:grid-cols-3">
                    <div className="space-y-2">
                      <label htmlFor="accountHolderName" className="text-xs font-semibold text-foreground/60">Account Holder Name</label>
                      <input
                        id="accountHolderName"
                        type="text"
                        value={accountHolderName}
                        onChange={(e) => setAccountHolderName(e.target.value)}
                        placeholder="John Doe"
                        className="w-full px-4 py-3 rounded-xl border border-border bg-surface text-sm sm:text-base text-foreground focus:outline-none focus:border-primary transition-all duration-200"
                      />
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="accountNumber" className="text-xs font-semibold text-foreground/60">Account Number</label>
                      <input
                        id="accountNumber"
                        type="text"
                        value={accountNumber}
                        onChange={(e) => setAccountNumber(e.target.value)}
                        placeholder="000123456789"
                        className="w-full px-4 py-3 rounded-xl border border-border bg-surface text-sm sm:text-base text-foreground focus:outline-none focus:border-primary transition-all duration-200"
                      />
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="ifscCode" className="text-xs font-semibold text-foreground/60">IFSC / Routing Code</label>
                      <input
                        id="ifscCode"
                        type="text"
                        value={ifscCode}
                        onChange={(e) => setIfscCode(e.target.value)}
                        placeholder="ABCD0123456"
                        className="w-full px-4 py-3 rounded-xl border border-border bg-surface text-sm sm:text-base text-foreground focus:outline-none focus:border-primary transition-all duration-200"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Form Actions */}
          <div className="mt-12 pt-6 border-t border-border flex items-center justify-end gap-4 font-sans">
            <button
              type="button"
              onClick={fetchProfile}
              disabled={saving}
              className="px-5 py-2.5 border border-border text-xs sm:text-sm font-semibold rounded-xl text-foreground hover:bg-muted/30 disabled:opacity-50 cursor-pointer"
            >
              Reset Changes
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-3 bg-primary hover:bg-accent text-xs sm:text-sm font-semibold text-white rounded-xl shadow-md transition-all duration-200 disabled:opacity-50 cursor-pointer flex items-center gap-2"
            >
              {saving ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Saving...
                </>
              ) : (
                'Save Profile'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserProfile;
