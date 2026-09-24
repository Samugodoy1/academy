export const ODONTOHUB_PRODUCT = 'odontohub';

type CroRecord = {
  id?: number;
  user_id?: number;
  product?: string;
  cro?: string | null;
};

export function showsOdontohubCro(product: string | undefined): boolean {
  return product === ODONTOHUB_PRODUCT;
}

export function pickCro(record: { cro?: string | null } | null | undefined): string | null {
  const value = typeof record?.cro === 'string' ? record.cro.trim() : '';
  return value || null;
}

export function croByUserId(rows: CroRecord[]): Map<number, string> {
  const index = new Map<number, string>();
  for (const row of rows) {
    const cro = pickCro(row);
    const id = row.user_id ?? row.id;
    if (cro && typeof id === 'number') index.set(id, cro);
  }
  return index;
}

export function withResolvedCro<T extends CroRecord>(user: T, index: Map<number, string>): T {
  if (!showsOdontohubCro(user.product)) return user;
  if (pickCro(user)) return user;
  const id = user.user_id ?? user.id;
  const cro = typeof id === 'number' ? index.get(id) : undefined;
  return cro ? { ...user, cro } : user;
}

export function rowsFromAdminUsersPayload(data: unknown): CroRecord[] {
  if (Array.isArray(data)) return data as CroRecord[];
  if (data && typeof data === 'object' && Array.isArray((data as { users?: unknown }).users)) {
    return (data as { users: CroRecord[] }).users;
  }
  return [];
}
