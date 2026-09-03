import React, { useEffect, useState } from 'react';
import { Building2, Landmark, GraduationCap, HeartHandshake } from 'lucide-react';
import { fetchRecommendations } from '../api/householdApi';

interface RecommendationListProps {
  householdId: number;
  overrideScore?: number;
  householdPhone?: string;
}

export const RecommendationList: React.FC<RecommendationListProps> = ({ householdId, overrideScore, householdPhone = '+91 00000 00000' }) => {
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [referringId, setReferringId] = useState<number | null>(null);
  const [referralStatusMap, setReferralStatusMap] = useState<Record<number, string>>({});
  const [successModal, setSuccessModal] = useState<any | null>(null);
  const [confirmingRec, setConfirmingRec] = useState<any | null>(null);
  const [phoneNumber, setPhoneNumber] = useState<string>(householdPhone);

  useEffect(() => {
    setLoading(true);
    fetchRecommendations(householdId, overrideScore)
      .then(res => setRecommendations(res as any[]))
      .catch(() => console.error("Failed to load recommendations"))
      .finally(() => setLoading(false));

    // Load referral statuses from localStorage
    const effectiveHouseholdId = overrideScore ? `${householdId}_sim_${overrideScore}` : householdId;
    try {
      const existingRaw = localStorage.getItem('sthira_ngo_referrals');
      if (existingRaw) {
        const existing = JSON.parse(existingRaw);
        const statusMap: Record<number, string> = {};
        existing.forEach((ref: any) => {
          if (ref.householdId === effectiveHouseholdId) {
            statusMap[ref.programId] = ref.status;
          }
        });
        setReferralStatusMap(statusMap);
      }
    } catch (e) {
      console.error("Failed to load referral status", e);
    }
  }, [householdId, overrideScore]);

  const getProviderIcon = (type: string) => {
    switch (type) {
      case 'Government': return <Landmark size={20} className="text-blue-600" />;
      case 'NGO': return <HeartHandshake size={20} className="text-rose-600" />;
      case 'Scholarship': return <GraduationCap size={20} className="text-purple-600" />;
      case 'CSR': return <Building2 size={20} className="text-teal-600" />;
      default: return <Building2 size={20} className="text-slate-600" />;
    }
  };

  const handleReferralClick = (rec: any) => {
    setPhoneNumber(householdPhone);
    setConfirmingRec(rec);
  };

  const submitReferral = async () => {
    if (!confirmingRec) return;
    const rec = confirmingRec;
    setConfirmingRec(null);
    setReferringId(rec.program.id);
    
    const referenceId = `REF-${Math.floor(Math.random() * 90000) + 10000}`;
    
    try {
      // Simulate API delay for referral & send SMS notification
      await fetch(`/api/households/${householdId}/notify-sms`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone_number: phoneNumber, program_name: rec.program.name, reference_id: referenceId })
      });
    } catch (e) {
      console.error("Failed to send SMS notification", e);
    }

    setTimeout(() => {
      setReferralStatusMap(prev => ({ ...prev, [rec.program.id]: 'Pending' }));
      setReferringId(null);
      
      const newReferral = {
        id: referenceId,
        householdId: overrideScore ? `${householdId}_sim_${overrideScore}` : householdId,
        householdPhone: phoneNumber,
        programId: rec.program.id,
        programName: rec.program.name,
        providerType: rec.program.provider_type,
        matchScore: rec.match_score,
        status: 'Pending',
        timestamp: new Date().toISOString()
      };
      
      try {
        const existingRaw = localStorage.getItem('sthira_ngo_referrals');
        const existing = existingRaw ? JSON.parse(existingRaw) : [];
        localStorage.setItem('sthira_ngo_referrals', JSON.stringify([newReferral, ...existing]));
      } catch (e) {
        console.error("Failed to save referral to localStorage", e);
      }
      
      setSuccessModal({ ...rec, referenceId, sentPhone: phoneNumber });
    }, 1000);
  };

  return (
    <>
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm h-full relative">
        <div className="mb-6">
          <h3 className="text-xl font-bold text-slate-800">Matched Support Programs</h3>
          <p className="text-sm text-slate-500 mt-1">
            Based on the vulnerability profile, these programs offer the highest impact.
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="border border-slate-100 rounded-xl p-5 animate-pulse bg-slate-50 flex gap-4">
                <div className="w-12 h-12 bg-slate-200 rounded-full shrink-0"></div>
                <div className="flex-1 space-y-3 py-1">
                  <div className="h-4 bg-slate-200 rounded w-3/4"></div>
                  <div className="h-3 bg-slate-200 rounded w-full"></div>
                  <div className="h-3 bg-slate-200 rounded w-5/6"></div>
                </div>
              </div>
            ))}
          </div>
        ) : recommendations.length === 0 ? (
          <div className="text-center py-12 text-slate-500 bg-slate-50 rounded-xl border border-dashed border-slate-200">
            No matching programs found for this profile.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {recommendations.map((rec, i) => {
              const refStatus = referralStatusMap[rec.program.id];
              const isReferred = !!refStatus;
              const isReferring = referringId === rec.program.id;
              
              return (
                <div key={i} className="border border-slate-200 hover:border-indigo-300 hover:shadow-md transition-all rounded-xl p-5 group bg-white flex flex-col cursor-pointer">
                  <div className="flex items-start justify-between mb-3">
                    <div className="p-2.5 bg-slate-50 rounded-lg group-hover:bg-indigo-50 transition-colors">
                      {getProviderIcon(rec.program.provider_type)}
                    </div>
                    <div className="px-2.5 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-full border border-emerald-100">
                      {rec.match_score}% Match
                    </div>
                  </div>
                  <h4 className="font-bold text-slate-800 mb-1 leading-tight group-hover:text-indigo-600 transition-colors">
                    {rec.program.name}
                  </h4>
                  <span className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-3">
                    {rec.program.provider_type}
                  </span>
                  <p className="text-sm text-slate-600 leading-relaxed flex-1">
                    {rec.program.description}
                  </p>
                  
                  <button 
                    onClick={() => !isReferred && !isReferring && handleReferralClick(rec)}
                    disabled={isReferred || isReferring}
                    className={`mt-4 w-full py-2 rounded-lg text-sm font-semibold transition-colors flex items-center justify-center gap-2 ${
                      isReferred 
                        ? refStatus === 'Accepted' ? 'bg-indigo-100 text-indigo-700 cursor-default' : 'bg-emerald-100 text-emerald-700 cursor-default'
                        : isReferring
                          ? 'bg-indigo-100 text-indigo-400 cursor-not-allowed'
                          : 'bg-slate-50 hover:bg-indigo-600 hover:text-white text-slate-700'
                    }`}
                  >
                    {isReferred ? (
                      refStatus === 'Accepted' ? 'Referral Accepted 🎉' :
                      refStatus === 'Contacted' ? 'NGO Contacted 📱' :
                      'Referral Pending ⏳'
                    ) : isReferring ? (
                      <span className="animate-pulse">Processing...</span>
                    ) : (
                      'Initiate Referral'
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Success Modal Popup */}
      {successModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden relative p-8 text-center animate-in zoom-in-95">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <HeartHandshake size={32} />
            </div>
            <h2 className="text-2xl font-bold text-slate-800 mb-2">Referral Sent Successfully!</h2>
            <p className="text-slate-600 mb-6 leading-relaxed">
              The profile for Household #{householdId} has been securely transmitted to <strong>{successModal.program.name}</strong>. 
            </p>
            
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 mb-6 text-left">
              <p className="text-xs font-semibold text-slate-400 uppercase mb-2">Next Steps</p>
              <ul className="text-sm text-slate-600 space-y-2 list-disc list-inside">
                <li>A tracking link has been sent via SMS to <strong className="text-slate-800">{successModal.sentPhone}</strong>.</li>
                <li>They can use the link or reference ID to check the status anytime without re-entering details.</li>
              </ul>
              <div className="mt-4 pt-3 border-t border-slate-200 flex justify-between items-center">
                <span className="text-xs text-slate-500">Reference ID:</span>
                <span className="text-xs font-mono font-bold text-slate-700">{successModal.referenceId}</span>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <button 
                onClick={() => {
                  alert("This would navigate to the Active Cases tracking page in a full production app!");
                  setSuccessModal(null);
                }}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg px-4 py-3 font-semibold transition-colors"
              >
                Track Status in Active Cases
              </button>
              <button 
                onClick={() => setSuccessModal(null)}
                className="w-full bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg px-4 py-3 font-semibold transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {confirmingRec && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden relative p-8 text-center animate-in zoom-in-95">
            <h2 className="text-xl font-bold text-slate-800 mb-2">Confirm Referral</h2>
            <p className="text-slate-600 mb-6 text-sm">
              We will send an SMS to the household member confirming that their profile was shared with <strong>{confirmingRec.program.name}</strong>.
            </p>
            <div className="mb-6 text-left">
              <label className="block text-sm font-semibold text-slate-700 mb-2">Household Mobile Number</label>
              <input 
                type="text" 
                value={phoneNumber} 
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-shadow"
                placeholder="+91 00000 00000"
              />
            </div>
            <div className="flex gap-3">
              <button 
                onClick={() => setConfirmingRec(null)}
                className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg px-4 py-2 font-semibold transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={submitReferral}
                className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg px-4 py-2 font-semibold transition-colors"
              >
                Confirm & Send SMS
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
