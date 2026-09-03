import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { HeartHandshake, Search, Calendar, ChevronLeft, Loader2, CheckCircle2 } from 'lucide-react';

export const TrackStatus: React.FC = () => {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  
  const [searchInput, setSearchInput] = useState(id || '');
  const [loading, setLoading] = useState(false);
  const [referral, setReferral] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      lookupReferral(id);
    }
  }, [id]);

  const lookupReferral = (refId: string) => {
    setLoading(true);
    setError(null);
    setReferral(null);
    
    // Simulate API network delay
    setTimeout(() => {
      try {
        const existingRaw = localStorage.getItem('sthira_ngo_referrals');
        if (existingRaw) {
          const existing = JSON.parse(existingRaw);
          const found = existing.find((r: any) => r.id.toUpperCase() === refId.toUpperCase());
          
          if (found) {
            setReferral(found);
          } else {
            setError("We couldn't find a referral with that Reference ID.");
          }
        } else {
          setError("No active referrals found in the system.");
        }
      } catch (e) {
        setError("An error occurred while looking up your referral.");
      } finally {
        setLoading(false);
      }
    }, 800);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchInput.trim()) return;
    
    if (searchInput !== id) {
      navigate(`/track/${searchInput}`);
    } else {
      lookupReferral(searchInput);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Top Nav Header */}
      <div className="bg-white border-b border-slate-200 px-6 py-4 flex items-center shadow-sm">
        <Link to="/" className="flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-indigo-600 transition-colors">
          <ChevronLeft size={16} /> Back to Home
        </Link>
        <h1 className="ml-auto text-lg font-bold text-slate-800 flex items-center gap-3">
          <Search className="text-indigo-600" size={20} /> 
          Track Application
        </h1>
      </div>

      <div className="flex-1 max-w-3xl w-full mx-auto px-6 py-12 flex flex-col items-center">
        
        {/* Search Box */}
        <div className="w-full max-w-lg bg-white rounded-2xl shadow-sm border border-slate-200 p-8 text-center mb-8">
          <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search size={32} />
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Track Your Status</h2>
          <p className="text-slate-500 mb-6 text-sm">
            Enter your Reference ID (e.g., REF-12345) to check the real-time status of your NGO application.
          </p>
          
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="REF-XXXXX"
              className="flex-1 border border-slate-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none uppercase font-mono transition-shadow"
              required
            />
            <button 
              type="submit"
              disabled={loading}
              className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-semibold rounded-lg px-6 py-3 transition-colors flex items-center justify-center min-w-[120px]"
            >
              {loading ? <Loader2 size={20} className="animate-spin" /> : 'Check Status'}
            </button>
          </form>

          {error && (
            <div className="mt-4 p-3 bg-rose-50 text-rose-600 border border-rose-100 rounded-lg text-sm text-left">
              {error}
            </div>
          )}
        </div>

        {/* Results Box */}
        {referral && !loading && (
          <div className="w-full bg-white rounded-2xl shadow-sm border border-slate-200 p-8 animate-in slide-in-from-bottom-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-6 border-b border-slate-100">
              <div>
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">Application Reference</span>
                <div className="text-2xl font-mono font-bold text-slate-800">{referral.id}</div>
              </div>
              <div className="text-left md:text-right">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">Current Status</span>
                <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-bold ${
                    referral.status === 'Pending' ? 'bg-amber-100 text-amber-700' :
                    referral.status === 'Contacted' ? 'bg-blue-100 text-blue-700' :
                    'bg-emerald-100 text-emerald-700'
                  }`}>
                  {referral.status === 'Pending' && 'Pending Review ⏳'}
                  {referral.status === 'Contacted' && 'Contacted 📱'}
                  {referral.status === 'Accepted' && 'Application Accepted 🎉'}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm font-semibold text-slate-800 mb-3 flex items-center gap-2">
                  <HeartHandshake size={16} className="text-rose-500" />
                  Program Details
                </h3>
                <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 space-y-3">
                  <div>
                    <span className="block text-xs text-slate-500 mb-0.5">Program Name</span>
                    <strong className="text-sm text-slate-800">{referral.programName}</strong>
                  </div>
                  <div>
                    <span className="block text-xs text-slate-500 mb-0.5">Provider Type</span>
                    <span className="text-sm text-slate-700">{referral.providerType}</span>
                  </div>
                  <div>
                    <span className="block text-xs text-slate-500 mb-0.5">Applied On</span>
                    <span className="text-sm text-slate-700 flex items-center gap-1">
                      <Calendar size={14} className="text-slate-400" />
                      {new Date(referral.timestamp).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-slate-800 mb-3 flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-emerald-500" />
                  Next Steps
                </h3>
                <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 h-full">
                  <ul className="text-sm text-slate-600 space-y-3">
                    {referral.status === 'Pending' && (
                      <>
                        <li className="flex gap-2"><div className="mt-1 w-1.5 h-1.5 rounded-full bg-slate-400 shrink-0" /> Your application has been received and is waiting for review by the provider.</li>
                        <li className="flex gap-2"><div className="mt-1 w-1.5 h-1.5 rounded-full bg-slate-400 shrink-0" /> Reviews typically take 48-72 hours.</li>
                      </>
                    )}
                    {referral.status === 'Contacted' && (
                      <>
                        <li className="flex gap-2"><div className="mt-1 w-1.5 h-1.5 rounded-full bg-blue-400 shrink-0" /> The provider has reviewed your profile and a field agent has been assigned.</li>
                        <li className="flex gap-2"><div className="mt-1 w-1.5 h-1.5 rounded-full bg-blue-400 shrink-0" /> Expect a phone call on <strong className="text-slate-800">{referral.householdPhone}</strong> shortly.</li>
                      </>
                    )}
                    {referral.status === 'Accepted' && (
                      <>
                        <li className="flex gap-2"><div className="mt-1 w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" /> Congratulations! Your application for support has been formally accepted.</li>
                        <li className="flex gap-2"><div className="mt-1 w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" /> A representative will process the benefits over the next few days.</li>
                      </>
                    )}
                  </ul>
                </div>
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
