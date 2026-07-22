import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type {
  RoleOut,
  RolePagination,
} from '@redhat-cloud-services/rbac-client';
import { useAppServices } from '../../../../shared/ServiceContext';

export type { RoleOut } from '@redhat-cloud-services/rbac-client';

export interface RolesListParams {
  offset?: number;
  limit?: number;
  name?: string;
  orderBy?: string;
}

export interface CreateRoleParams {
  name: string;
  display_name: string;
  description: string;
}

export interface UpdateRoleParams {
  uuid: string;
  name: string;
  display_name: string;
  description: string;
}

export const roleKeys = {
  all: ['roles'] as const,
  lists: () => [...roleKeys.all, 'list'] as const,
  list: (params: RolesListParams) => [...roleKeys.lists(), params] as const,
  details: () => [...roleKeys.all, 'detail'] as const,
  detail: (uuid: string) => [...roleKeys.details(), uuid] as const,
};

export function useRolesQuery(params: RolesListParams = {}) {
  const { axios } = useAppServices();
  return useQuery({
    queryKey: roleKeys.list(params),
    queryFn: async (): Promise<RolePagination> => {
      const { data } = await axios.get('/api/rbac/v1/roles/', {
        params: {
          offset: params.offset,
          limit: params.limit,
          name: params.name || undefined,
          order_by: params.orderBy || undefined,
        },
      });
      return data;
    },
  });
}

export function useRoleQuery(uuid: string) {
  const { axios } = useAppServices();
  return useQuery({
    queryKey: roleKeys.detail(uuid),
    queryFn: async (): Promise<RoleOut> => {
      const { data } = await axios.get(`/api/rbac/v1/roles/${uuid}/`);
      return data;
    },
    enabled: !!uuid,
  });
}

export function useCreateRoleMutation() {
  const { notify } = useAppServices();
  const qc = useQueryClient();
  return useMutation({
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    mutationFn: async (params: CreateRoleParams) => {
      // In a real app:
      // const { data } = await axios.post('/api/rbac/v1/roles/', {
      //   name: params.name,
      //   display_name: params.display_name,
      //   description: params.description,
      //   access: [],
      // });
      // return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: roleKeys.all });
      notify('success', 'Role created');
    },
    onError: (error: Error) => {
      notify('danger', 'Failed to create role', error.message);
    },
  });
}

export function useUpdateRoleMutation() {
  const { notify } = useAppServices();
  const qc = useQueryClient();
  return useMutation({
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    mutationFn: async (params: UpdateRoleParams) => {
      // In a real app:
      // const { data } = await axios.put(`/api/rbac/v1/roles/${params.uuid}/`, {
      //   name: params.name,
      //   display_name: params.display_name,
      //   description: params.description,
      // });
      // return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: roleKeys.all });
      notify('success', 'Role updated');
    },
    onError: (error: Error) => {
      notify('danger', 'Failed to update role', error.message);
    },
  });
}

export function useDeleteRoleMutation() {
  const { notify } = useAppServices();
  const qc = useQueryClient();
  return useMutation({
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    mutationFn: async (uuid: string) => {
      // In a real app:
      // await axios.delete(`/api/rbac/v1/roles/${uuid}/`);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: roleKeys.all });
      notify('success', 'Role deleted');
    },
    onError: (error: Error) => {
      notify('danger', 'Failed to delete role', error.message);
    },
  });
}
