import { useEffect, useState, useMemo } from 'react';
import VenueHeader from '../components/layout/VenueHeader';
import VenueToolbar from '../components/layout/VenueToolbar';
import VenueTable from '../components/layout/VenueTable';
import Pagination from '../components/layout/Pagination';
import VenueFormModal from '../components/ui/VenueFormModal';
import { ownerVenuesApi } from '../services/owner-venues.api';
import { useAsyncFetch } from '@/shared/hooks/useAsyncFetch';
import { useDebounce } from '@/shared/hooks/useDebounce';
import type { Venue, VenueListResponse, ApiResponse, PaginationInfo } from '../types/venues.types';
import { Loading } from '@/shared/components/ui';
import { toast } from 'sonner';
import { Building2, Clock, CheckCircle2, XCircle } from 'lucide-react';

const OwnerVenuesList = () => {
  // Query state
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>(
    'all'
  );
  const [sortBy, setSortBy] = useState<'asc' | 'desc'>('desc');

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [editingVenue, setEditingVenue] = useState<Venue | null>(null);

  // Fetch hooks
  const {
    data: listResponse,
    loading,
    execute: fetchVenues,
  } = useAsyncFetch<ApiResponse<VenueListResponse>>();

  // Extract data
  const venues = listResponse?.data?.venues || [];
  const pagination: PaginationInfo = listResponse?.data?.pagination || {
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 1,
  };

  // Debounce search
  const debouncedSearch = useDebounce(search, 400);

  // Fetch venues
  const loadVenues = () => {
    fetchVenues(() =>
      ownerVenuesApi.getAll({
        page,
        limit: 10,
        search: debouncedSearch,
        status: statusFilter,
        sort: sortBy,
      })
    );
  };

  useEffect(() => {
    loadVenues();
  }, [page, debouncedSearch, statusFilter, sortBy]);

  // Reset page when filters change
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, statusFilter, sortBy]);

  // Handlers
  const handleEditClick = (venue: Venue) => {
    setEditingVenue(venue);
    setModalOpen(true);
  };

  const handleAddClick = () => {
    setEditingVenue(null);
    setModalOpen(true);
  };

  // Stats
  const stats = useMemo(() => {
    return {
      total: pagination.total,
      pending: venues.filter((v) => v.verificationStatus === 'pending').length,
      approved: venues.filter((v) => v.verificationStatus === 'approved').length,
      rejected: venues.filter((v) => v.verificationStatus === 'rejected').length,
    };
  }, [venues, pagination.total]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <VenueHeader onAddClick={handleAddClick} />

      {/* Statistics Cards */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {/* Total */}
        <div className="flex items-center gap-4 rounded-2xl border border-border bg-card p-5 shadow-sm">
          <div className="rounded-xl bg-primary/10 p-3 text-primary">
            <Building2 size={22} className="stroke-[1.5]" />
          </div>
          <div>
            <p className="text-xs font-semibold text-muted uppercase tracking-wider">
              Total Venues
            </p>
            <p className="text-2xl font-bold text-foreground mt-0.5">
              {loading ? '...' : stats.total}
            </p>
          </div>
        </div>

        {/* Pending */}
        <div className="flex items-center gap-4 rounded-2xl border border-border bg-card p-5 shadow-sm">
          <div className="rounded-xl bg-warning/10 p-3 text-warning">
            <Clock size={22} className="stroke-[1.5]" />
          </div>
          <div>
            <p className="text-xs font-semibold text-muted uppercase tracking-wider">Pending</p>
            <p className="text-2xl font-bold text-foreground mt-0.5">
              {loading ? '...' : stats.pending}
            </p>
          </div>
        </div>

        {/* Approved */}
        <div className="flex items-center gap-4 rounded-2xl border border-border bg-card p-5 shadow-sm">
          <div className="rounded-xl bg-success/10 p-3 text-success">
            <CheckCircle2 size={22} className="stroke-[1.5]" />
          </div>
          <div>
            <p className="text-xs font-semibold text-muted uppercase tracking-wider">Approved</p>
            <p className="text-2xl font-bold text-foreground mt-0.5">
              {loading ? '...' : stats.approved}
            </p>
          </div>
        </div>

        {/* Rejected */}
        <div className="flex items-center gap-4 rounded-2xl border border-border bg-card p-5 shadow-sm">
          <div className="rounded-xl bg-error/10 p-3 text-error">
            <XCircle size={22} className="stroke-[1.5]" />
          </div>
          <div>
            <p className="text-xs font-semibold text-muted uppercase tracking-wider">Rejected</p>
            <p className="text-2xl font-bold text-foreground mt-0.5">
              {loading ? '...' : stats.rejected}
            </p>
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <VenueToolbar
        search={search}
        onSearchChange={setSearch}
        sortBy={sortBy}
        onSortChange={setSortBy}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
      />

      {/* Content */}
      {loading ? (
        <Loading />
      ) : (
        <>
          <VenueTable venues={venues} onEdit={handleEditClick} />
          <Pagination pagination={pagination} onPageChange={setPage} />
        </>
      )}

      {/* Modal */}
      {modalOpen && (
        <VenueFormModal
          venue={editingVenue}
          onClose={() => {
            setModalOpen(false);
            setEditingVenue(null);
          }}
          onSuccess={loadVenues}
        />
      )}
    </div>
  );
};

export default OwnerVenuesList;
