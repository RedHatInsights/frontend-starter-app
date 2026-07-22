import { HttpResponse, delay, http } from 'msw';
import type { ResettableMockCollection } from '../../../../shared/mockCollections';
import type { MockRole } from './db';

export interface RolesHandlerOptions {
  networkDelay?: number;
  onList?: (...args: unknown[]) => void;
  onRead?: (...args: unknown[]) => void;
  onCreate?: (...args: unknown[]) => void;
  onUpdate?: (...args: unknown[]) => void;
  onDelete?: (...args: unknown[]) => void;
}

export function createRolesHandlers(
  collection: ResettableMockCollection<MockRole>,
  options: RolesHandlerOptions = {},
) {
  const {
    networkDelay = 200,
    onList,
    onRead,
    onCreate,
    onUpdate,
    onDelete,
  } = options;

  return [
    http.get('/api/rbac/v1/roles/', async ({ request }) => {
      await delay(networkDelay);
      const url = new URL(request.url);
      const offset = parseInt(url.searchParams.get('offset') || '0', 10);
      const limit = parseInt(url.searchParams.get('limit') || '20', 10);
      const nameFilter = url.searchParams.get('name') || '';
      const orderBy = url.searchParams.get('order_by') || '';

      let roles = collection.findAll();

      if (nameFilter) {
        const lower = nameFilter.toLowerCase();
        roles = roles.filter(
          (r) =>
            r.name.toLowerCase().includes(lower) ||
            (r.display_name?.toLowerCase().includes(lower) ?? false),
        );
      }

      if (orderBy) {
        const desc = orderBy.startsWith('-');
        const field = desc ? orderBy.slice(1) : orderBy;
        const getValue = (r: MockRole) =>
          String((r as unknown as Record<string, unknown>)[field] ?? '');
        roles.sort((a, b) =>
          desc
            ? getValue(b).localeCompare(getValue(a))
            : getValue(a).localeCompare(getValue(b)),
        );
      }

      const total = roles.length;
      const paged = roles.slice(offset, offset + limit);

      onList?.(url.searchParams);

      return HttpResponse.json({
        meta: { count: total },
        links: {
          first: `/api/rbac/v1/roles/?offset=0&limit=${limit}`,
          next:
            offset + limit < total
              ? `/api/rbac/v1/roles/?offset=${offset + limit}&limit=${limit}`
              : null,
          previous:
            offset > 0
              ? `/api/rbac/v1/roles/?offset=${Math.max(0, offset - limit)}&limit=${limit}`
              : null,
          last: `/api/rbac/v1/roles/?offset=${Math.max(0, total - limit)}&limit=${limit}`,
        },
        data: paged,
      });
    }),

    http.get('/api/rbac/v1/roles/:uuid/', async ({ params }) => {
      await delay(networkDelay);
      const role = collection.findById(params.uuid as string);
      onRead?.(params.uuid);
      if (!role) {
        return HttpResponse.json(
          { errors: [{ status: '404', detail: 'Not found' }] },
          { status: 404 },
        );
      }
      return HttpResponse.json(role);
    }),

    http.post('/api/rbac/v1/roles/', async ({ request }) => {
      await delay(networkDelay);
      const body = (await request.json()) as {
        name: string;
        display_name: string;
        description: string;
        access: unknown[];
      };
      const uuid = `uuid-${Date.now()}`;
      const now = new Date().toISOString();
      const newRole: MockRole = {
        id: uuid,
        uuid,
        name: body.name,
        display_name: body.display_name,
        description: body.description,
        created: now,
        modified: now,
        accessCount: 0,
        system: false,
        platform_default: false,
        admin_default: false,
      };
      collection.create(newRole);
      onCreate?.(body);
      return HttpResponse.json(newRole, { status: 201 });
    }),

    http.put('/api/rbac/v1/roles/:uuid/', async ({ params, request }) => {
      await delay(networkDelay);
      const uuid = params.uuid as string;
      const body = (await request.json()) as {
        name: string;
        display_name: string;
        description: string;
      };
      const updated = collection.update(uuid, {
        ...body,
        modified: new Date().toISOString(),
      } as Partial<MockRole>);
      onUpdate?.(uuid, body);
      if (!updated) {
        return HttpResponse.json(
          { errors: [{ status: '404', detail: 'Not found' }] },
          { status: 404 },
        );
      }
      return HttpResponse.json(updated);
    }),

    http.delete('/api/rbac/v1/roles/:uuid/', async ({ params }) => {
      await delay(networkDelay);
      const uuid = params.uuid as string;
      const deleted = collection.delete(uuid);
      onDelete?.(uuid);
      if (!deleted) {
        return HttpResponse.json(
          { errors: [{ status: '404', detail: 'Not found' }] },
          { status: 404 },
        );
      }
      return new HttpResponse(null, { status: 204 });
    }),
  ];
}
