export interface SupportProgram {
  id: number;
  name: string;
  provider_type: 'Government' | 'NGO' | 'CSR' | 'Scholarship';
  description: string;
  region_coverage: string[];
  min_score: number;
  max_score: number;
  eligibility_criteria: any; // Raw JSON rules
}

export interface ModelVersion {
  version: string;
  deployed_at: string;
  is_active: boolean;
  metrics: {
    accuracy: number;
    f1: number;
    rmse: number;
    mae: number;
    r2: number;
  };
}

export interface UserAdmin {
  id: number;
  email: string;
  role: string;
  status: 'Active' | 'Deactivated';
  created_at: string;
}

export interface AuditLogEntry {
  id: number;
  timestamp: string;
  admin_email: string;
  action: string;
  details: string;
}

// MOCK DATA

let mockPrograms: SupportProgram[] = [
  {
    id: 1,
    name: 'Pratham Education Relief',
    provider_type: 'NGO',
    description: 'Grants for families struggling with education expenses.',
    region_coverage: ['Maharashtra', 'Bihar'],
    min_score: 60,
    max_score: 95,
    eligibility_criteria: {
      and: [
        { field: 'num_children', operator: '>=', value: 1 }
      ]
    }
  }
];

const mockModels: ModelVersion[] = [
  {
    version: 'xgboost-v2.1.0',
    deployed_at: '2026-07-20T10:00:00Z',
    is_active: true,
    metrics: { accuracy: 0.92, f1: 0.89, rmse: 4.2, mae: 3.1, r2: 0.88 }
  },
  {
    version: 'lightgbm-v1.4.2',
    deployed_at: '2026-05-12T14:30:00Z',
    is_active: false,
    metrics: { accuracy: 0.88, f1: 0.85, rmse: 5.1, mae: 3.8, r2: 0.82 }
  }
];

let mockUsers: UserAdmin[] = [
  { id: 1, email: 'admin@sthira.com', role: 'admin', status: 'Active', created_at: '2026-01-01T00:00:00Z' },
  { id: 2, email: 'csr_partner@tata.com', role: 'csr', status: 'Active', created_at: '2026-02-15T00:00:00Z' },
  { id: 3, email: 'bad_actor@fake.com', role: 'household', status: 'Deactivated', created_at: '2026-06-10T00:00:00Z' }
];

let mockLogs: AuditLogEntry[] = [
  { id: 101, timestamp: '2026-07-20T10:05:00Z', admin_email: 'admin@sthira.com', action: 'MODEL_PROMOTED', details: 'Promoted xgboost-v2.1.0 to production.' },
  { id: 100, timestamp: '2026-07-18T14:22:00Z', admin_email: 'admin@sthira.com', action: 'PROGRAM_CREATED', details: 'Created Pratham Education Relief.' }
];

// API CALLS

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

export const fetchPrograms = async () => {
  await delay(600);
  return [...mockPrograms];
};

export const saveProgram = async (program: Partial<SupportProgram>) => {
  await delay(800);
  if (program.id) {
    mockPrograms = mockPrograms.map(p => p.id === program.id ? { ...p, ...program } as SupportProgram : p);
  } else {
    const newProg = { ...program, id: Math.max(...mockPrograms.map(p => p.id), 0) + 1 } as SupportProgram;
    mockPrograms.push(newProg);
  }
  
  mockLogs.unshift({
    id: Date.now(),
    timestamp: new Date().toISOString(),
    admin_email: 'admin@sthira.com',
    action: program.id ? 'PROGRAM_UPDATED' : 'PROGRAM_CREATED',
    details: `Updated eligibility for ${program.name}`
  });
};

export const fetchModels = async () => {
  await delay(500);
  return [...mockModels];
};

export const fetchUsers = async () => {
  await delay(600);
  return [...mockUsers];
};

export const updateUserRole = async (userId: number, role: string) => {
  await delay(400);
  mockUsers = mockUsers.map(u => u.id === userId ? { ...u, role } : u);
};

export const toggleUserStatus = async (userId: number) => {
  await delay(400);
  mockUsers = mockUsers.map(u => u.id === userId ? { ...u, status: u.status === 'Active' ? 'Deactivated' : 'Active' } : u);
};

export const fetchAuditLogs = async () => {
  await delay(300);
  return [...mockLogs];
};
