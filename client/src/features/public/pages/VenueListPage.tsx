import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { publicVenuesApi, type PublicVenueQuery } from '../services/public-venues.api';
import { useAsyncFetch } from '@/shared/hooks/useAsyncFetch';
import { useDebounce } from '@/shared/hooks/useDebounce';
import Pagination, { type PaginationInfo } from '@/shared/components/ui/Pagination';
import type { VenueListResponse, ApiResponse } from '@/features/venues/types/venues.types';
import type { Category } from '@/features/categories/types';

import VenueHeader from '../components/Venue/VenueHeader';
import VenueSearchBar from '../components/Venue/VenueSearchBar';
import VenueFilters from '../components/Venue/VenueFilters';
import VenueGrid from '../components/Venue/VenueGrid';
import VenueEmptyState from '../components/Venue/VenueEmptyState';
import VenueLoading from '../components/Venue/VenueLoading';
import VenueGpsControl from '../components/Venue/VenueGpsControl';
import { venueFilterSchema } from '../components/Venue/schemas/venueFilter.schema';
import { toast } from 'sonner';

export default function VenueListPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialSearch = searchParams.get('search') || '';
  const initialCategory = searchParams.get('category') || '';
  const initialLat = searchParams.get('lat') ? parseFloat(searchParams.get('lat')!) : null;
  const initialLng = searchParams.get('lng') ? parseFloat(searchParams.get('lng')!) : null;
  const initialRadius = searchParams.get('radius') ? parseInt(searchParams.get('radius')!, 10) : 25;

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState(initialSearch);
  const [categoryFilter, setCategoryFilter] = useState(initialCategory);
  const [sortBy, setSortBy] = useState<PublicVenueQuery['sort']>('newest');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [capacity, setCapacity] = useState(searchParams.get('capacity') || searchParams.get('minCapacity') || '');
  const [showFilters, setShowFilters] = useState(false);

  // GPS discovery state (default radius 25 km)
  const [userCoords, setUserCoords] = useState<{ lat: number; lng: number } | null>(
    initialLat !== null && initialLng !== null && !isNaN(initialLat) && !isNaN(initialLng)
      ? { lat: initialLat, lng: initialLng }
      : null
  );
  const [radius, setRadius] = useState<number>(initialRadius || 25);
  const [isLocating, setIsLocating] = useState<boolean>(false);

  const handleEnableGps = () => {
    if (!navigator.geolocation) {
      toast.error('Geolocation is not supported by your browser');
      return;
    }
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setIsLocating(false);
        const coords = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        };
        setUserCoords(coords);
        const effectiveRadius = radius || 25;
        toast.success(`Location detected! Showing venues within ${effectiveRadius} km.`);

        const next = new URLSearchParams(searchParams);
        next.set('lat', String(coords.lat));
        next.set('lng', String(coords.lng));
        next.set('radius', String(effectiveRadius));
        setSearchParams(next, { replace: true });
      },
      (err) => {
        setIsLocating(false);
        console.warn('Geolocation error:', err);
        if (err.code === err.PERMISSION_DENIED) {
          toast.error('Location permission was denied. You can still search by city or venue name.');
        } else {
          toast.error('Unable to retrieve your location. Please try again.');
        }
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const handleDisableGps = () => {
    setUserCoords(null);
    const next = new URLSearchParams(searchParams);
    next.delete('lat');
    next.delete('lng');
    next.delete('radius');
    setSearchParams(next, { replace: true });
    toast.info('GPS filter cleared');
  };

  const handleRadiusChange = (newRadius: number) => {
    setRadius(newRadius);
    if (userCoords) {
      const next = new URLSearchParams(searchParams);
      next.set('radius', String(newRadius));
      setSearchParams(next, { replace: true });
    }
  };

  const [categories, setCategories] = useState<Category[]>([]);

  const {
    data: listResponse,
    loading,
    execute: fetchVenues,
  } = useAsyncFetch<ApiResponse<VenueListResponse>>();

  const venues = listResponse?.data?.venues || [];
  const pagination: PaginationInfo = listResponse?.data?.pagination || {
    total: 0,
    page: 1,
    limit: 12,
    totalPages: 1,
  };

  const debouncedSearch = useDebounce(search, 400);
  const debouncedMinPrice = useDebounce(minPrice, 400);
  const debouncedMaxPrice = useDebounce(maxPrice, 400);
  const debouncedCapacity = useDebounce(capacity, 400);

  const [errors, setErrors] = useState<{
    minPrice?: string;
    maxPrice?: string;
    capacity?: string;
  }>({});

  useEffect(() => {
    const result = venueFilterSchema.safeParse({
      minPrice,
      maxPrice,
      capacity,
    });

    if (result.success) {
      setErrors({});
      return;
    }

    const fieldErrors: Record<string, string> = {};
    result.error.issues.forEach((issue) => {
      const field = issue.path[0] as string;
      if (!fieldErrors[field]) {
        fieldErrors[field] = issue.message;
      }
    });
    setErrors(fieldErrors);
  }, [minPrice, maxPrice, capacity]);

  useEffect(() => {
    publicVenuesApi
      .getCategories({ status: 'active', limit: 100 })
      .then((res) => setCategories(res.data.categories))
      .catch(() => {});
  }, []);

  const loadVenues = () => {
    const validationResult = venueFilterSchema.safeParse({
      minPrice: debouncedMinPrice,
      maxPrice: debouncedMaxPrice,
      capacity: debouncedCapacity,
    });

    if (!validationResult.success) {
      return;
    }

    const query: PublicVenueQuery = {
      page,
      limit: 12,
      search: debouncedSearch || undefined,
      category: categoryFilter || undefined,
      sort: sortBy,
      minPrice: debouncedMinPrice ? Number(debouncedMinPrice) : undefined,
      maxPrice: debouncedMaxPrice ? Number(debouncedMaxPrice) : undefined,
      minCapacity: debouncedCapacity ? Number(debouncedCapacity) : undefined,
      lat: userCoords ? userCoords.lat : undefined,
      lng: userCoords ? userCoords.lng : undefined,
      radius: userCoords ? radius : undefined,
    };

    fetchVenues(() => publicVenuesApi.getAll(query));
  };

  useEffect(() => {
    loadVenues();
  }, [
    page,
    debouncedSearch,
    categoryFilter,
    sortBy,
    debouncedMinPrice,
    debouncedMaxPrice,
    debouncedCapacity,
    userCoords,
    radius,
  ]);

  useEffect(() => {
    setPage(1);
  }, [
    debouncedSearch,
    categoryFilter,
    sortBy,
    debouncedMinPrice,
    debouncedMaxPrice,
    debouncedCapacity,
    userCoords,
    radius,
  ]);

  // Sync state if URL query params change (e.g. from Header search)
  useEffect(() => {
    const urlSearch = searchParams.get('search') ?? '';
    if (urlSearch !== search) {
      setSearch(urlSearch);
    }
    const urlCategory = searchParams.get('category') ?? '';
    if (urlCategory !== categoryFilter) {
      setCategoryFilter(urlCategory);
    }
    const urlCapacity = searchParams.get('capacity') ?? searchParams.get('minCapacity') ?? '';
    if (urlCapacity !== capacity) {
      setCapacity(urlCapacity);
    }
  }, [searchParams]);

  // Keep URL search param in sync with debouncedSearch and debouncedCapacity
  useEffect(() => {
    const nextParams = new URLSearchParams(searchParams);
    let changed = false;

    const currentSearch = searchParams.get('search') ?? '';
    if (debouncedSearch !== currentSearch) {
      if (debouncedSearch) {
        nextParams.set('search', debouncedSearch);
      } else {
        nextParams.delete('search');
      }
      changed = true;
    }

    const currentCapacity = searchParams.get('capacity') ?? '';
    if (debouncedCapacity !== currentCapacity) {
      if (debouncedCapacity) {
        nextParams.set('capacity', debouncedCapacity);
      } else {
        nextParams.delete('capacity');
      }
      changed = true;
    }

    if (changed) {
      setSearchParams(nextParams, { replace: true });
    }
  }, [debouncedSearch, debouncedCapacity]);

  const activeFilterCount = [
    search,
    categoryFilter,
    minPrice,
    maxPrice,
    capacity,
    userCoords ? 'gps' : '',
  ].filter(Boolean).length;

  const clearAllFilters = () => {
    setSearch('');
    setCategoryFilter('');
    setMinPrice('');
    setMaxPrice('');
    setCapacity('');
    setUserCoords(null);
    setRadius(25);
    setSearchParams({});
  };

  return (
    <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10 py-8 space-y-8">
      <VenueHeader />

      <div className="space-y-4">
        <div className="flex flex-wrap gap-3 items-center justify-between">
          <div className="flex items-center gap-3 flex-1 min-w-[280px]">
            <VenueSearchBar value={search} onChange={setSearch} />
            <VenueGpsControl
              userCoords={userCoords}
              radius={radius}
              onEnableGps={handleEnableGps}
              onDisableGps={handleDisableGps}
              isLocating={isLocating}
            />
          </div>

          <VenueFilters
            categories={categories}
            showFilters={showFilters}
            onToggleFilters={() => setShowFilters(!showFilters)}
            sortBy={sortBy}
            onSortChange={setSortBy}
            categoryFilter={categoryFilter}
            onCategoryChange={setCategoryFilter}
            minPrice={minPrice}
            maxPrice={maxPrice}
            onMinPriceChange={setMinPrice}
            onMaxPriceChange={setMaxPrice}
            capacity={capacity}
            onCapacityChange={setCapacity}
            userCoords={userCoords}
            radius={radius}
            onRadiusChange={handleRadiusChange}
            onEnableGps={handleEnableGps}
            onDisableGps={handleDisableGps}
            isLocating={isLocating}
            activeFilterCount={activeFilterCount}
            onClearAll={clearAllFilters}
            errors={errors}
          />
        </div>

        {/* Active Filters Dismissible Bar */}
        {activeFilterCount > 0 && (
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <span className="text-xs font-semibold text-muted-foreground">Active:</span>

            {search && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-surface border border-border text-foreground shadow-2xs">
                Keyword: "{search}"
                <button
                  type="button"
                  onClick={() => setSearch('')}
                  className="hover:text-error transition-colors cursor-pointer"
                  title="Remove keyword filter"
                >
                  &times;
                </button>
              </span>
            )}

            {categoryFilter && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-surface border border-border text-foreground shadow-2xs">
                Category: {categories.find((c) => (c._id || c.id) === categoryFilter)?.name || 'Selected'}
                <button
                  type="button"
                  onClick={() => setCategoryFilter('')}
                  className="hover:text-error transition-colors cursor-pointer"
                  title="Remove category filter"
                >
                  &times;
                </button>
              </span>
            )}

            {capacity && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 border border-primary/20 text-primary shadow-2xs">
                Capacity: {capacity}+ guests
                <button
                  type="button"
                  onClick={() => setCapacity('')}
                  className="hover:text-error transition-colors cursor-pointer"
                  title="Remove capacity filter"
                >
                  &times;
                </button>
              </span>
            )}

            {(minPrice || maxPrice) && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-surface border border-border text-foreground shadow-2xs">
                Price: {minPrice ? `₹${minPrice}` : '₹0'} - {maxPrice ? `₹${maxPrice}` : 'Any'}
                <button
                  type="button"
                  onClick={() => {
                    setMinPrice('');
                    setMaxPrice('');
                  }}
                  className="hover:text-error transition-colors cursor-pointer"
                  title="Remove price filter"
                >
                  &times;
                </button>
              </span>
            )}

            {userCoords && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary/15 border border-primary/30 text-primary shadow-2xs">
                Nearby: &le;{radius} km
                <button
                  type="button"
                  onClick={handleDisableGps}
                  className="hover:text-error transition-colors cursor-pointer"
                  title="Clear GPS filter"
                >
                  &times;
                </button>
              </span>
            )}

            <button
              type="button"
              onClick={clearAllFilters}
              className="text-xs font-semibold text-error hover:underline ml-1 cursor-pointer"
            >
              Reset all
            </button>
          </div>
        )}
      </div>

      {!loading && (
        <div className="flex items-center justify-between">
          <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">
            {pagination.total} venue{pagination.total !== 1 ? 's' : ''} available
            {userCoords && ` within ${radius} km of your location`}
          </p>
        </div>
      )}

      {loading ? (
        <VenueLoading />
      ) : venues.length === 0 ? (
        <VenueEmptyState
          hasActiveFilters={activeFilterCount > 0}
          onClearFilters={clearAllFilters}
        />
      ) : (
        <>
          <VenueGrid venues={venues} userCoords={userCoords} />
          <Pagination pagination={pagination} onPageChange={setPage} itemName="venue" />
        </>
      )}
    </div>
  );
}
