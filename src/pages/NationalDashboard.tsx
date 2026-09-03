import React, { useEffect, useState } from 'react';
import { fetchDashboardAggregate } from '../api/dashboardApi';
import type { DashboardAggregate, DashboardFilters } from '../api/dashboardApi';
import { FilterBar } from '../components/FilterBar';
import { SummaryCards } from '../components/SummaryCards';
import { RegionalHeatmap } from '../components/RegionalHeatmap';
import { TrendChart } from '../components/TrendChart';
import { Loader2, Radio, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const NationalDashboard: React.FC = () => {
  const [filters, setFilters] = useState<DashboardFilters>({
    region: 'all',
    riskBand: 'all',
    dateRange: '12m'
  });
  
  const navigate = useNavigate();

  const [data, setData] = useState<DashboardAggregate | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    // When filters change, we do ONE unified fetch here. 
    // This state is then passed down to all child charts to prevent redundant API calls.
    const timer = setTimeout(() => {
      fetchDashboardAggregate(filters)
        .then(res => setData(res))
        .finally(() => setLoading(false));
    }, 300); // minimal debounce for fast clickers

    return () => clearTimeout(timer);
  }, [filters]);

  return (
    <div className="min-h-screen bg-slate-900 text-slate-200 pb-12 font-sans selection:bg-indigo-500/30">
      
      {/* Top Nav Header */}
      <div className="bg-slate-950 border-b border-slate-800 px-6 py-4 flex items-center mb-8 sticky top-0 z-20 gap-4">
        <button 
          onClick={() => navigate(-1)} 
          className="p-2 -ml-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer flex-shrink-0"
          aria-label="Go back"
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-xl font-bold text-white tracking-tight truncate">Sthira National Dashboard</h1>
        
        <div className="ml-auto flex items-center gap-2 bg-emerald-500/10 text-emerald-400 px-3 py-1.5 rounded-full border border-emerald-500/20 text-xs font-semibold flex-shrink-0">
          <Radio size={14} className="animate-pulse" />
          Live Data
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6">
        
        {/* Filter Orchestration */}
        <FilterBar filters={filters} onChange={setFilters} />

        {/* Global Loading Overlay */}
        {loading || !data ? (
          <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 text-indigo-400">
            <Loader2 size={48} className="animate-spin" />
            <p className="font-medium animate-pulse">Aggregating National Data...</p>
          </div>
        ) : (
          <div className="space-y-6 animate-in fade-in duration-500">
            
            {/* Top-level KPIs */}
            <SummaryCards summary={data.summary} />

            {/* Main Visualizations */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="lg:col-span-1">
                <RegionalHeatmap data={data.regionalHeatmap} />
              </div>
              <div className="lg:col-span-1">
                <TrendChart data={data.trends} />
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
