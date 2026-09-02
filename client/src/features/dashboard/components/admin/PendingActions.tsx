import { UserCheck, Building2, RefreshCcw, Flag, IndianRupee, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface PendingActionsProps {
  data?: {
    ownerVerifications: number;
    venueApprovals: number;
    venueUpdates: number;
    reportedVenues: number;
    refundRequests: number;
  };
}

export default function PendingActions({ data }: PendingActionsProps) {
  const navigate = useNavigate();

  const actions = [
    {
      title: 'Pending Owner Verifications',
      count: data ? data.ownerVerifications : 0,
      icon: UserCheck,
      colorClass: 'text-info bg-info/10',
      borderColor: 'hover:border-info/25 dark:hover:border-info/35',
      path: '/admin/users',
    },
    {
      title: 'Pending Venue Approvals',
      count: data ? data.venueApprovals : 0,
      icon: Building2,
      colorClass: 'text-warning bg-warning/10',
      borderColor: 'hover:border-warning/25 dark:hover:border-warning/35',
      path: '/admin/venues',
    },
    {
      title: 'Pending Venue Updates',
      count: data ? data.venueUpdates : 0,
      icon: RefreshCcw,
      colorClass: 'text-indigo-500 bg-indigo-500/10 dark:bg-indigo-500/20',
      borderColor: 'hover:border-indigo-500/25 dark:hover:border-indigo-500/35',
      path: '/admin/venues',
    },
    {
      title: 'Reported Venues',
      count: data ? data.reportedVenues : 0,
      icon: Flag,
      colorClass: 'text-error bg-error/10',
      borderColor: 'hover:border-error/25 dark:hover:border-error/35',
      path: '/admin/venues',
    },
    {
      title: 'Refund Requests',
      count: data ? data.refundRequests : 0,
      icon: IndianRupee,
      colorClass: 'text-success bg-success/10',
      borderColor: 'hover:border-success/25 dark:hover:border-success/35',
      path: '/admin/settlements',
    },
  ];

  return (
    <div className="rounded-3xl border border-border bg-white dark:bg-[#1a1a1a] p-6 text-foreground shadow-xl transition-all duration-300 flex flex-col justify-between">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[10px] font-bold text-primary uppercase tracking-[0.25em]">
            Moderation
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-primary" />
        </div>

        <h2 className="text-lg font-bold tracking-tight text-black dark:text-white leading-none mb-6">
          Pending <span className="text-primary">Actions</span>
        </h2>

        <div className="space-y-4">
          {actions.map((action) => {
            const Icon = action.icon;
            return (
              <div
                key={action.title}
                className={`group p-4 rounded-2xl border border-border bg-card transition-all duration-300 flex items-center justify-between ${action.borderColor}`}
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${action.colorClass}`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-black dark:text-white group-hover:text-primary transition-colors duration-200">
                      {action.title}
                    </h4>
                    <p className="text-xs text-foreground/70 mt-0.5">
                      {data ? `${action.count} items requiring review` : 'Data not available'}
                    </p>
                  </div>
                </div>

                {action.count > 0 && (
                  <button
                    onClick={() => navigate(action.path)}
                    className="flex items-center gap-1.5 py-1.5 px-3 rounded-lg border border-border text-xs font-bold uppercase tracking-wider text-black dark:text-white hover:bg-card hover:border-primary/30 transition-all duration-200 group/btn cursor-pointer"
                  >
                    Review
                    <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition-transform duration-200" />
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
