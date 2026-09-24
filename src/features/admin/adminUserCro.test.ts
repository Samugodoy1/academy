import { describe, expect, it } from 'vitest';
import {
  croByUserId,
  pickCro,
  rowsFromAdminUsersPayload,
  showsOdontohubCro,
  withResolvedCro,
} from './adminUserCro';

describe('admin user CRO', () => {
  it('shows CRO only for the regular OdontoHub product', () => {
    expect(showsOdontohubCro('odontohub')).toBe(true);
    expect(showsOdontohubCro('academy')).toBe(false);
  });

  it('trims a stored CRO and treats blanks as missing', () => {
    expect(pickCro({ cro: '  CRO-SP 12345  ' })).toBe('CRO-SP 12345');
    expect(pickCro({ cro: '   ' })).toBeNull();
    expect(pickCro({})).toBeNull();
  });

  it('indexes CRO from admin user rows by user id', () => {
    const index = croByUserId([
      { user_id: 4, cro: '1111' },
      { id: 9, cro: ' 2222 ' },
      { id: 3, cro: '' },
    ]);
    expect(index.get(4)).toBe('1111');
    expect(index.get(9)).toBe('2222');
    expect(index.has(3)).toBe(false);
  });

  it('fills CRO on an OdontoHub row when the directory omitted it', () => {
    const index = croByUserId([{ id: 7, cro: '54321' }]);
    expect(withResolvedCro({ user_id: 7, product: 'odontohub', cro: null }, index).cro).toBe('54321');
    expect(withResolvedCro({ user_id: 7, product: 'odontohub', cro: '999' }, index).cro).toBe('999');
    expect(withResolvedCro({ id: 7, product: 'academy', cro: null }, index).cro).toBeNull();
  });

  it('reads both a bare array and a users envelope', () => {
    expect(rowsFromAdminUsersPayload([{ id: 1, cro: '1' }])).toHaveLength(1);
    expect(rowsFromAdminUsersPayload({ users: [{ id: 2 }] })).toEqual([{ id: 2 }]);
    expect(rowsFromAdminUsersPayload({ error: 'nope' })).toEqual([]);
  });
});
