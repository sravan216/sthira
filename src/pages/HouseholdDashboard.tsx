import React, { useEffect, useState } from 'react';
import { useParams, Link, useSearchParams } from 'react-router-dom';
import { fetchHouseholdDetails } from '../api/householdApi';
import type { HouseholdDetails } from '../api/householdApi';
import { HeroSection } from '../components/HeroSection';
import { AttributionPanel } from '../components/AttributionPanel';
import { CliffSimulator } from '../components/CliffSimulator';
import { RecommendationList } from '../components/RecommendationList';
import { ManualScoreModal } from '../components/ManualScoreModal';
import { ChevronLeft, Loader2, Calculator } from 'lucide-react';

export const HouseholdDashboard: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const householdId = Number(id) || 1;
  const overrideParam = searchParams.get('override');
  
  const [data, setData] = useState<HouseholdDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const parsedOverride = overrideParam ? Number(overrideParam) : null;
  const initialOverride = (parsedOverride !== null && !isNaN(parsedOverride)) ? {
    score: parsedOverride,
    risk: parsedOverride >= 75 ? 'High' : (parsedOverride >= 50 ? 'Medium' : 'Low'),
    inputs: {}
  } : null;
  const [manualOverride, setManualOverride] = useState<{score: number, risk: string, inputs: any} | null>(initialOverride);

  useEffect(() => {
    if (overrideParam) {
      const parsed = Number(overrideParam);
      if (!isNaN(parsed)) {
        setManualOverride(prev => {
          if (prev?.score === parsed) return prev;
          return {
            score: parsed,
            risk: parsed >= 75 ? 'High' : (parsed >= 50 ? 'Medium' : 'Low'),
            inputs: {}
          };
        });
      }
    } else {
      setManualOverride(null);
    }
  }, [overrideParam]);

  useEffect(() => {
    setLoading(true);
    fetchHouseholdDetails(householdId)
      .then(res => {
        setData(res);
        setError(null);
      })
      .catch(() => setError("Failed to load household details."))
      .finally(() => setLoading(false));
  }, [householdId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Loader2 className="animate-spin text-indigo-600" size={48} />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center text-slate-500 p-6">
        <p className="text-xl font-medium mb-4">{error || "Household not found."}</p>
        <Link to="/" className="text-indigo-600 hover:underline">Return to Home</Link>
      </div>
    );
  }

  const displayData = manualOverride 
    ? { 
        ...data, 
        score: manualOverride.score, 
        risk_band: manualOverride.risk as any, 
        features: { 
          ...data.features, 
          monthly_income: manualOverride.inputs.monthly_income ?? data.features.monthly_income, 
          total_debt: manualOverride.inputs.total_debt ?? data.features.total_debt, 
          essential_monthly_expenses: manualOverride.inputs.essential_monthly_expenses ?? data.features.essential_monthly_expenses 
        } 
      }
    : data;

  return (
    <div className="min-h-screen bg-slate-100 pb-12">
      {/* Top Nav Header */}
      <div className="bg-white border-b border-slate-200 px-6 py-4 flex items-center mb-8 sticky top-0 z-10">
        <Link to="/" className="flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-indigo-600 transition-colors">
          <ChevronLeft size={16} /> Back to Directory
        </Link>
        <h1 className="ml-auto text-lg font-bold text-slate-800 flex items-center gap-4">
          Household Profile
          {manualOverride && (
            <span className="bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 border border-amber-200">
              <Calculator size={14} /> SIMULATED
            </span>
          )}
        </h1>
        <div className="ml-4 flex gap-2">
          {manualOverride && (
            <button 
              onClick={() => {
                setManualOverride(null);
                // Remove override from URL
                searchParams.delete('override');
                window.history.replaceState({}, '', `${window.location.pathname}?${searchParams.toString()}`);
              }}
              className="px-4 py-2 bg-slate-200 text-slate-700 text-sm font-bold rounded-lg hover:bg-slate-300 transition-colors shadow-sm border border-slate-300"
            >
              Clear Override
            </button>
          )}
          <button 
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 bg-indigo-600 text-white text-sm font-bold rounded-lg hover:bg-indigo-700 transition-colors shadow-sm shadow-indigo-200"
          >
            Check Vulnerability Score
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 space-y-6">
        {/* Row 1: Hero Banner */}
        <HeroSection 
          householdId={householdId}
          overrideScore={manualOverride?.score}
          score={displayData.score} 
          riskBand={displayData.risk_band} 
          features={displayData.features} 
        />

        {/* Row 2: Analytics & Attribution */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <CliffSimulator householdId={householdId} overrideScore={manualOverride?.score} />
          </div>
          <div className="lg:col-span-1">
            <AttributionPanel shapValues={manualOverride ? manualOverride.inputs.shap_values || displayData.shap_values : displayData.shap_values} />
          </div>
        </div>

        {/* Row 3: Recommendations */}
        <div className="pt-4">
          <RecommendationList householdId={householdId} overrideScore={manualOverride?.score} householdPhone={data.phone_number} />
        </div>
      </div>

      {isModalOpen && (
        <ManualScoreModal 
          householdId={householdId}
          onClose={() => setIsModalOpen(false)} 
          onApply={(item) => setManualOverride({ score: item.result.score, risk: item.result.risk_band, inputs: { ...item.inputs, shap_values: item.result.shap_values } })}
        />
      )}
    </div>
  );
};
