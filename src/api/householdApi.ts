export interface HouseholdDetails {
  id: number;
  score: number;
  risk_band: 'Low' | 'Medium' | 'High';
  phone_number: string;
  features: {
    monthly_income: number;
    total_debt: number;
    essential_monthly_expenses: number;
    emergency_savings_months: number;
    dependents_count?: number;
    employment_type?: string;
    health_insurance?: boolean;
  };
  shap_values?: Array<{ feature: string; impact: number }>;
}

export const fetchHouseholdDetails = async (id: number): Promise<HouseholdDetails> => {
  const res = await fetch(`/api/households/${id}`);
  if (!res.ok) {
    throw new Error(`Failed to fetch household details for ID ${id}: ${res.statusText}`);
  }
  return await res.json();
};

export const fetchGenAIExplanation = async (id: number, overrideScore?: number): Promise<string> => {
  const url = overrideScore !== undefined ? `/api/households/${id}/next-steps?override_score=${overrideScore}` : `/api/households/${id}/next-steps`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Failed to fetch GenAI Explanation for ID ${id}: ${res.statusText}`);
  }
  const data = await res.json();
  // Try to return something from next_steps
  return data.next_steps ? data.next_steps.map((s: string) => `• ${s}`).join('\n\n') : "No explanation available.";
};

export const simulateCliff = async (id: number, payload: { shock_type: string, magnitude: number }, overrideScore?: number) => {
  const url = overrideScore !== undefined ? `/api/simulator/${id}/simulate?override_score=${overrideScore}` : `/api/simulator/${id}/simulate`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  if (!res.ok) {
    throw new Error(`Failed to simulate cliff for ID ${id}: ${res.statusText}`);
  }
  return await res.json();
};

export const fetchRecommendations = async (id: number, overrideScore?: number) => {
  const url = overrideScore !== undefined ? `/api/households/${id}/recommendations?override_score=${overrideScore}` : `/api/households/${id}/recommendations`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Failed to fetch recommendations for ID ${id}: ${res.statusText}`);
  }
  const data = await res.json();
  return data.recommendations || [];
};

export const simulateScore = async (payload: any) => {
  const res = await fetch('/api/households/simulate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  if (!res.ok) {
    throw new Error(`Backend request failed: ${res.statusText}`);
  }
  return await res.json();
};
