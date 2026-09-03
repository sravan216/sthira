export interface DashboardFilters {
  region: string;
  riskBand: string;
  dateRange: string;
}

export interface DashboardAggregate {
  summary: {
    totalHouseholds: number;
    riskDistribution: { low: number; medium: number; high: number };
    averageFVS: number;
    modelMetadata: { version: string; accuracy: number; rmse: number };
  };
  regionalHeatmap: Array<{ region: string; averageFVS: number; householdCount: number }>;
  trends: Array<{ month: string; fvs: number }>;
}

export const fetchDashboardAggregate = async (filters: DashboardFilters): Promise<DashboardAggregate> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Simulate some mock data that "changes" based on filters slightly
      let baseFVS = filters.region === 'all' ? 62 : 75;
      let count = filters.region === 'all' ? 45210 : 8420;
      
      let heatData = [
        { region: "Maharashtra", averageFVS: 68, householdCount: 12000 },
        { region: "Bihar", averageFVS: 82, householdCount: 9500 },
        { region: "Karnataka", averageFVS: 54, householdCount: 8200 },
        { region: "Uttar Pradesh", averageFVS: 79, householdCount: 15510 },
      ];

      if (filters.region !== 'all') {
        const formatRegion = (val: string) => val === 'up' ? 'Uttar Pradesh' : val.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
        const displayRegion = formatRegion(filters.region);
        
        let found = heatData.find(d => d.region.toLowerCase() === displayRegion.toLowerCase());
        
        if (found) {
          baseFVS = found.averageFVS;
          count = found.householdCount;
          heatData = [found];
        } else {
          // Generate deterministic mock data for newly added states
          const hash = filters.region.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
          baseFVS = 40 + (hash % 45); // generates a score between 40 and 85
          const stateCount = 1000 + ((hash * 13) % 15000);
          count = stateCount;
          
          heatData = [{ region: displayRegion, averageFVS: baseFVS, householdCount: stateCount }];
        }
      }

      resolve({
        summary: {
          totalHouseholds: count,
          riskDistribution: { low: 45, medium: 35, high: 20 },
          averageFVS: baseFVS,
          modelMetadata: { version: "v2.1.0-xgboost", accuracy: 0.92, rmse: 4.2 }
        },
        regionalHeatmap: heatData,
        trends: [
          { month: 'Jan', fvs: Math.max(0, baseFVS - 2) },
          { month: 'Feb', fvs: Math.max(0, baseFVS - 1) },
          { month: 'Mar', fvs: Math.max(0, baseFVS + 1) },
          { month: 'Apr', fvs: Math.max(0, baseFVS) },
          { month: 'May', fvs: Math.max(0, baseFVS + 3) },
          { month: 'Jun', fvs: Math.max(0, baseFVS + 4) },
          { month: 'Jul', fvs: Math.max(0, baseFVS + 6) },
          { month: 'Aug', fvs: baseFVS },
        ]
      });
    }, 800); // simulate API delay
  });
};
