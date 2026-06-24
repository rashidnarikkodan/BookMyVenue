import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { adminVenuesApi } from '../services/admin-venues.api';
import { useAsyncFetch } from '@/shared/hooks/useAsyncFetch';
import type { Venue, ApiResponse } from '@/features/venues/types/venues.types';
import { toast } from 'sonner';
import {
  ChevronLeft,
  MapPin,
  Users,
  IndianRupee,
  Calendar,
  Building2,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Loader2,
  User,
  Mail,
} from 'lucide-react';

const statusStyles: Record<string, string> = {
  pending: 'border-warning/20 bg-warning/10 text-warning',
  approved: 'border-success/20 bg-success/10 text-success',
  rejected: 'border-error/20 bg-error/10 text-error',
};

const AdminVenueDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [isApproving, setIsApproving] = useState(false);
  const [isRejecting, setIsRejecting] = useState(false);

  const { data: fetchResponse, loading, execute: fetchVenue } = useAsyncFetch<ApiResponse<Venue>>();

  const venue = fetchResponse?.data;

  const loadVenue = () => {
    if (id) {
      fetchVenue(() => adminVenuesApi.getById(id));
    }
  };

  useEffect(() => {
    loadVenue();
  }, [id]);

  const handleApprove = async () => {
    if (!venue) return;
    setIsApproving(true);
    try {
      await adminVenuesApi.approve(venue._id);
      toast.success('Venue approved successfully');
      loadVenue();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to approve venue');
    } finally {
      setIsApproving(false);
    }
  };

  const handleReject = async () => {
    if (!venue || rejectionReason.trim().length < 10) {
      toast.error('Please provide a rejection reason (minimum 10 characters)');
      return;
    }
    setIsRejecting(true);
    try {
      await adminVenuesApi.reject(venue._id, rejectionReason.trim());
      toast.success('Venue rejected successfully');
      setShowRejectModal(false);
      setRejectionReason('');
      loadVenue();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to reject venue');
    } finally {
      setIsRejecting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-sm font-medium text-muted">Loading venue details...</p>
        </div>
      </div>
    );
  }

  if (!venue) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center">
        <div className="rounded-full bg-error/10 border border-error/20 p-4 text-error mb-4">
          <Building2 size={32} />
        </div>
        <h2 className="text-xl font-bold text-foreground">Venue Not Found</h2>
        <p className="text-sm text-muted mt-2">The venue you are looking for does not exist.</p>
        <Link
          to="/admin/venues"
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-accent transition-all"
        >
          <ChevronLeft size={16} /> Back to Venues
        </Link>
      </div>
    );
  }

  const categoryName =
    typeof venue.categoryId === 'object' ? venue.categoryId.name : venue.categoryId;
  const statusClass = statusStyles[venue.verificationStatus] || statusStyles.pending;

  // Owner info from populated field
  const ownerInfo = venue.ownerId as any;
  const ownerName = ownerInfo && typeof ownerInfo === 'object' ? ownerInfo.fullName : 'Unknown';
  const ownerEmail = ownerInfo && typeof ownerInfo === 'object' ? ownerInfo.email : 'N/A';
  const ownerAvatar = ownerInfo && typeof ownerInfo === 'object' ? ownerInfo.avatar : null;

  const formattedCreated = venue.createdAt
    ? new Date(venue.createdAt).toLocaleString('en-IN', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : 'N/A';

  const formattedUpdated = venue.updatedAt
    ? new Date(venue.updatedAt).toLocaleString('en-IN', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : 'N/A';

  return (
    <div className="space-y-6">
      {/* Top Navigation & Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-border pb-5 mb-6">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/admin/venues')}
            className="rounded-xl border border-border bg-background p-2.5 text-muted hover:text-foreground transition-all hover:bg-surface active:scale-95 cursor-pointer"
            title="Back to Venues"
          >
            <ChevronLeft size={20} />
          </button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-extrabold tracking-tight text-foreground">
                {venue.name}
              </h1>
              <span
                className={`inline-flex items-center rounded-lg border px-2.5 py-0.5 text-xs font-semibold capitalize ${statusClass}`}
              >
                {venue.verificationStatus}
              </span>
            </div>
            <p className="mt-1 text-xs text-muted">{categoryName}</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          {venue.verificationStatus === 'pending' && (
            <>
              <button
                onClick={() => setShowRejectModal(true)}
                className="
                  inline-flex items-center justify-center gap-2
                  rounded-xl border border-error/20 bg-error/5
                  px-5 py-2.5 text-sm font-semibold text-error
                  hover:bg-error/10 transition-all active:scale-95
                "
              >
                <XCircle size={16} />
                Reject
              </button>
              <button
                onClick={handleApprove}
                disabled={isApproving}
                className="
                  inline-flex items-center justify-center gap-2
                  rounded-xl bg-success px-5 py-2.5 text-sm font-semibold text-white
                  hover:bg-success/90 transition-all active:scale-95 disabled:opacity-50
                "
              >
                {isApproving ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <CheckCircle2 size={16} />
                )}
                Approve
              </button>
            </>
          )}
          {venue.verificationStatus === 'approved' && (
            <button
              onClick={() => setShowRejectModal(true)}
              className="
                inline-flex items-center justify-center gap-2
                rounded-xl border border-error/20 bg-error/5
                px-5 py-2.5 text-sm font-semibold text-error
                hover:bg-error/10 transition-all active:scale-95
              "
            >
              <XCircle size={16} />
              Reject
            </button>
          )}
          {venue.verificationStatus === 'rejected' && (
            <button
              onClick={handleApprove}
              disabled={isApproving}
              className="
                inline-flex items-center justify-center gap-2
                rounded-xl bg-success px-5 py-2.5 text-sm font-semibold text-white
                hover:bg-success/90 transition-all active:scale-95 disabled:opacity-50
              "
            >
              {isApproving ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <CheckCircle2 size={16} />
              )}
              Approve
            </button>
          )}
        </div>
      </div>

      {/* Rejection Reason */}
      {venue.verificationStatus === 'rejected' && venue.rejectionReason && (
        <div className="flex items-start gap-3 rounded-2xl border border-error/20 bg-error/5 p-4">
          <AlertTriangle size={20} className="text-error mt-0.5 shrink-0" />
          <div>
            <p className="text-sm font-bold text-error">Venue Rejected</p>
            <p className="text-xs text-foreground mt-1">{venue.rejectionReason}</p>
          </div>
        </div>
      )}

      {/* Owner Info Card */}
      <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
        <h2 className="text-sm font-bold text-foreground uppercase tracking-wider mb-4">
          Owner Information
        </h2>
        <div className="flex items-center gap-4">
          {ownerAvatar ? (
            <img
              src={ownerAvatar}
              alt={ownerName}
              className="h-12 w-12 rounded-full object-cover border-2 border-border"
            />
          ) : (
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary border-2 border-border">
              <User size={20} />
            </div>
          )}
          <div>
            <p className="text-sm font-bold text-foreground">{ownerName}</p>
            <div className="flex items-center gap-1.5 mt-0.5">
              <Mail size={12} className="text-muted" />
              <p className="text-xs text-muted">{ownerEmail}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
        {/* Left Column */}
        <div className="space-y-6">
          {/* Image Gallery */}
          {venue.images.length > 0 && (
            <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
              <div className="relative h-[340px] bg-background">
                <img
                  src={venue.images[activeImageIndex]}
                  alt={`${venue.name} - Image ${activeImageIndex + 1}`}
                  className="h-full w-full object-cover"
                />
                <div className="absolute bottom-3 right-3 rounded-lg bg-black/60 px-2.5 py-1 text-[10px] font-bold text-white tracking-wider">
                  {activeImageIndex + 1} / {venue.images.length}
                </div>
              </div>
              {venue.images.length > 1 && (
                <div className="flex gap-2 p-3 overflow-x-auto">
                  {venue.images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImageIndex(idx)}
                      className={`shrink-0 h-16 w-20 rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${
                        idx === activeImageIndex
                          ? 'border-primary ring-2 ring-primary/30'
                          : 'border-border hover:border-muted'
                      }`}
                    >
                      <img
                        src={img}
                        alt={`Thumbnail ${idx + 1}`}
                        className="h-full w-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Description */}
          <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
            <h2 className="text-sm font-bold text-foreground uppercase tracking-wider mb-3">
              Description
            </h2>
            <p className="text-sm text-foreground leading-relaxed whitespace-pre-line">
              {venue.description}
            </p>
          </div>

          {/* Amenities */}
          {venue.amenities.length > 0 && (
            <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
              <h2 className="text-sm font-bold text-foreground uppercase tracking-wider mb-3">
                Amenities
              </h2>
              <div className="flex flex-wrap gap-2">
                {venue.amenities.map((amenity, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-medium text-foreground"
                  >
                    {amenity}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column */}
        <div className="space-y-5">
          {/* Key Info */}
          <div className="rounded-2xl border border-border bg-card p-5 shadow-sm space-y-4">
            <h2 className="text-sm font-bold text-foreground uppercase tracking-wider">
              Key Information
            </h2>

            <div className="space-y-3">
              <div className="flex items-center justify-between py-2 border-b border-border">
                <div className="flex items-center gap-2 text-xs text-muted">
                  <Users size={14} /> Capacity
                </div>
                <span className="text-sm font-bold text-foreground">{venue.capacity} guests</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-border">
                <div className="flex items-center gap-2 text-xs text-muted">
                  <IndianRupee size={14} /> Pricing
                </div>
                <span className="text-sm font-bold text-foreground">
                  ₹{venue.pricing.amount.toLocaleString()} / {venue.pricing.unit}
                </span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-border">
                <div className="flex items-center gap-2 text-xs text-muted">
                  <Building2 size={14} /> Category
                </div>
                <span className="text-sm font-bold text-foreground">{categoryName}</span>
              </div>
            </div>
          </div>

          {/* Location */}
          <div className="rounded-2xl border border-border bg-card p-5 shadow-sm space-y-3">
            <h2 className="text-sm font-bold text-foreground uppercase tracking-wider">Location</h2>
            <div className="flex items-start gap-2">
              <MapPin size={16} className="text-muted mt-0.5 shrink-0" />
              <p className="text-sm text-foreground leading-relaxed">
                {venue.address.street}, {venue.address.city}
                <br />
                {venue.address.district}, {venue.address.state} - {venue.address.pincode}
              </p>
            </div>
          </div>

          {/* Timestamps */}
          <div className="rounded-2xl border border-border bg-card p-5 shadow-sm space-y-3">
            <h2 className="text-sm font-bold text-foreground uppercase tracking-wider">Timeline</h2>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs">
                <Calendar size={13} className="text-muted" />
                <span className="text-muted">Created:</span>
                <span className="font-medium text-foreground">{formattedCreated}</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <Calendar size={13} className="text-muted" />
                <span className="text-muted">Updated:</span>
                <span className="font-medium text-foreground">{formattedUpdated}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Reject Confirmation Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-background rounded-2xl shadow-xl w-full max-w-md overflow-hidden border border-border p-6 space-y-4">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-error/10 mb-2">
              <XCircle className="h-6 w-6 text-error" />
            </div>
            <h3 className="text-lg font-bold text-foreground text-center">Reject Venue</h3>
            <p className="text-sm text-muted text-center">
              Please provide a reason for rejection so the owner can address the issues.
            </p>

            <textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="Enter rejection reason (minimum 10 characters)..."
              rows={4}
              className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all resize-none"
            />

            <div className="flex items-center justify-between text-xs text-muted">
              <span>{rejectionReason.length}/500 characters</span>
              {rejectionReason.length > 0 && rejectionReason.length < 10 && (
                <span className="text-error">Minimum 10 characters required</span>
              )}
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => {
                  setShowRejectModal(false);
                  setRejectionReason('');
                }}
                disabled={isRejecting}
                className="flex-1 rounded-xl border border-border bg-background px-4 py-2.5 text-sm font-semibold text-foreground hover:bg-surface transition-all disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleReject}
                disabled={isRejecting || rejectionReason.trim().length < 10}
                className="flex-1 inline-flex justify-center items-center gap-2 rounded-xl bg-error px-4 py-2.5 text-sm font-semibold text-white hover:bg-error/90 transition-all disabled:opacity-50"
              >
                {isRejecting ? <Loader2 size={16} className="animate-spin" /> : 'Reject Venue'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminVenueDetails;
