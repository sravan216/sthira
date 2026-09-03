import React from 'react';
import type { DashboardFilters } from '../api/dashboardApi';
import { Filter, Calendar, MapPin, Activity } from 'lucide-react';

interface FilterBarProps {
  filters: DashboardFilters;
  onChange: (filters: DashboardFilters) => void;
}

export const FilterBar: React.FC<FilterBarProps> = ({ filters, onChange }) => {
  return (
    <div className="bg-slate-800 border border-slate-700 rounded-xl p-4 flex flex-col md:flex-row items-center gap-4 shadow-lg mb-8">
      <div className="flex items-center gap-2 text-slate-300 font-semibold mr-auto">
        <Filter size={18} className="text-indigo-400" />
        Global Filters
      </div>

      <div className="relative flex items-center gap-2 bg-slate-900 rounded-lg px-3 py-2 border border-slate-700 focus-within:border-indigo-500 transition-colors w-full md:w-auto md:min-w-[200px]">
        <MapPin size={16} className="text-slate-500" />
        <select 
          value={filters.region}
          onChange={e => onChange({ ...filters, region: e.target.value })}
          className="bg-transparent text-sm text-slate-200 focus:outline-none w-full"
        >
          <option className="bg-slate-900 text-slate-200" value="all">All Regions</option>
          <option className="bg-slate-900 text-slate-200" value="andhra_pradesh">Andhra Pradesh</option>
          <option className="bg-slate-900 text-slate-200" value="arunachal_pradesh">Arunachal Pradesh</option>
          <option className="bg-slate-900 text-slate-200" value="assam">Assam</option>
          <option className="bg-slate-900 text-slate-200" value="bihar">Bihar</option>
          <option className="bg-slate-900 text-slate-200" value="chhattisgarh">Chhattisgarh</option>
          <option className="bg-slate-900 text-slate-200" value="goa">Goa</option>
          <option className="bg-slate-900 text-slate-200" value="gujarat">Gujarat</option>
          <option className="bg-slate-900 text-slate-200" value="haryana">Haryana</option>
          <option className="bg-slate-900 text-slate-200" value="himachal_pradesh">Himachal Pradesh</option>
          <option className="bg-slate-900 text-slate-200" value="jharkhand">Jharkhand</option>
          <option className="bg-slate-900 text-slate-200" value="karnataka">Karnataka</option>
          <option className="bg-slate-900 text-slate-200" value="kerala">Kerala</option>
          <option className="bg-slate-900 text-slate-200" value="madhya_pradesh">Madhya Pradesh</option>
          <option className="bg-slate-900 text-slate-200" value="maharashtra">Maharashtra</option>
          <option className="bg-slate-900 text-slate-200" value="manipur">Manipur</option>
          <option className="bg-slate-900 text-slate-200" value="meghalaya">Meghalaya</option>
          <option className="bg-slate-900 text-slate-200" value="mizoram">Mizoram</option>
          <option className="bg-slate-900 text-slate-200" value="nagaland">Nagaland</option>
          <option className="bg-slate-900 text-slate-200" value="odisha">Odisha</option>
          <option className="bg-slate-900 text-slate-200" value="punjab">Punjab</option>
          <option className="bg-slate-900 text-slate-200" value="rajasthan">Rajasthan</option>
          <option className="bg-slate-900 text-slate-200" value="sikkim">Sikkim</option>
          <option className="bg-slate-900 text-slate-200" value="tamil_nadu">Tamil Nadu</option>
          <option className="bg-slate-900 text-slate-200" value="telangana">Telangana</option>
          <option className="bg-slate-900 text-slate-200" value="tripura">Tripura</option>
          <option className="bg-slate-900 text-slate-200" value="up">Uttar Pradesh</option>
          <option className="bg-slate-900 text-slate-200" value="uttarakhand">Uttarakhand</option>
          <option className="bg-slate-900 text-slate-200" value="west_bengal">West Bengal</option>
          <option className="bg-slate-800 text-slate-400" disabled>── Union Territories ──</option>
          <option className="bg-slate-900 text-slate-200" value="andaman">Andaman & Nicobar</option>
          <option className="bg-slate-900 text-slate-200" value="chandigarh">Chandigarh</option>
          <option className="bg-slate-900 text-slate-200" value="dadra">Dadra & Nagar Haveli</option>
          <option className="bg-slate-900 text-slate-200" value="delhi">Delhi</option>
          <option className="bg-slate-900 text-slate-200" value="jammu_kashmir">Jammu & Kashmir</option>
          <option className="bg-slate-900 text-slate-200" value="ladakh">Ladakh</option>
          <option className="bg-slate-900 text-slate-200" value="lakshadweep">Lakshadweep</option>
          <option className="bg-slate-900 text-slate-200" value="puducherry">Puducherry</option>
        </select>
        {filters.region !== 'all' && (
          <span className="absolute -top-2 -right-2 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-indigo-500"></span>
          </span>
        )}
      </div>

      <div className="flex items-center gap-2 bg-slate-900 rounded-lg px-3 py-2 border border-slate-700 focus-within:border-indigo-500 transition-colors w-full md:w-auto">
        <Activity size={16} className="text-slate-500" />
        <select 
          value={filters.riskBand}
          onChange={e => onChange({ ...filters, riskBand: e.target.value })}
          className="bg-transparent text-sm text-slate-200 focus:outline-none w-full"
        >
          <option value="all">All Risk Bands</option>
          <option value="high">High Risk</option>
          <option value="medium">Medium Risk</option>
          <option value="low">Low Risk</option>
        </select>
      </div>

      <div className="flex items-center gap-2 bg-slate-900 rounded-lg px-3 py-2 border border-slate-700 focus-within:border-indigo-500 transition-colors w-full md:w-auto">
        <Calendar size={16} className="text-slate-500" />
        <select 
          value={filters.dateRange}
          onChange={e => onChange({ ...filters, dateRange: e.target.value })}
          className="bg-transparent text-sm text-slate-200 focus:outline-none w-full"
        >
          <option value="12m">Last 12 Months</option>
          <option value="6m">Last 6 Months</option>
          <option value="30d">Last 30 Days</option>
        </select>
      </div>
    </div>
  );
};
