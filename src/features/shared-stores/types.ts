// Remote hook result types
export interface FedModuleRoute {
  pathname: string;
}

export interface FedModule {
  id: string;
  module: string;
  routes: FedModuleRoute[];
}

export interface FedModuleEntry {
  // Config is optional and can have different structures
  config?: {
    ssoScopes?: string[];
    supportCaseData?: {
      product: string;
      version: string;
    };
  };
  // Some entries use moduleConfig instead
  moduleConfig?: {
    ssoScopes?: string[];
    supportCaseData?: {
      product: string;
      version: string;
    };
  };
  manifestLocation: string;
  modules?: FedModule[];
  // Additional optional properties from real API
  cdnPath?: string;
  fullProfile?: boolean;
  analytics?: {
    APIKey?: string;
    APIKeyDev?: string;
  };
  defaultDocumentTitle?: string;
  isFedramp?: boolean;
}

export interface FedModulesData {
  [key: string]: FedModuleEntry;
}

export interface FedModulesStoreResult {
  data: FedModulesData | null;
  filteredData: FedModulesData | null;
  loading: boolean;
  error: string | null;
  fetchFedModules: () => void;
  toggleSort: (key: string) => void;
  totalCount: number;
  filteredCount: number;
  clearFilters: () => void;
  sortConfig: {
    validKeys: string[];
    key: string | null;
    direction: 'asc' | 'desc';
  };
  setSortConfig: (key: string, direction: 'asc' | 'desc') => void;
  filterConfig: {
    searchTerm: string;
    ssoScopeFilter: string[];
    moduleFilter: string;
  };
  availableSsoScopes: string[];
  availableModules: string[];
  setSsoScopeFilter: (filter: string[]) => void;
  setModuleFilter: (filter: string) => void;
}

export interface FedModulesFilterResult {
  setFilters: (newFilterConfig: {
    searchTerm?: string;
    ssoScopeFilter?: string[];
    moduleFilter?: string;
  }) => void;
  clearFilters: () => void;
}

export const columnsData = [
  { label: 'Module ID', key: 'id' },
  { label: 'Manifest Location', key: 'manifestLocation' },
  { label: 'Modules', key: 'modules' },
  { label: 'SSO Scopes', key: 'ssoScopes' },
  { label: 'Routes', key: 'routes' },
];
