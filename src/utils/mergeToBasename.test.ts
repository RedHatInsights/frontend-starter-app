import { mergeToBasename } from './mergeToBasename';

describe('mergeToBasename', () => {
  const basename = '/staging/starter';

  describe('with empty basename', () => {
    it('returns string path unchanged', () => {
      expect(mergeToBasename('/roles', '')).toBe('/roles');
    });

    it('returns Location object unchanged', () => {
      expect(mergeToBasename({ pathname: '/roles' }, '')).toEqual({
        pathname: '/roles',
      });
    });
  });

  describe('with string paths', () => {
    it('prepends basename to absolute path', () => {
      expect(mergeToBasename('/roles', basename)).toBe(
        '/staging/starter/roles',
      );
    });

    it('prepends basename to relative path', () => {
      expect(mergeToBasename('roles', basename)).toBe('/staging/starter/roles');
    });

    it('prepends basename to root path', () => {
      expect(mergeToBasename('/', basename)).toBe('/staging/starter/');
    });

    it('does not double-prepend if already prefixed', () => {
      expect(mergeToBasename('/staging/starter/roles', basename)).toBe(
        '/staging/starter/roles',
      );
    });

    it('handles nested paths', () => {
      expect(mergeToBasename('/roles/uuid-123/edit', basename)).toBe(
        '/staging/starter/roles/uuid-123/edit',
      );
    });
  });

  describe('with Location objects', () => {
    it('prepends basename to pathname', () => {
      expect(mergeToBasename({ pathname: '/roles' }, basename)).toEqual({
        pathname: '/staging/starter/roles',
      });
    });

    it('preserves search and hash', () => {
      expect(
        mergeToBasename(
          { pathname: '/roles', search: '?q=admin', hash: '#top' },
          basename,
        ),
      ).toEqual({
        pathname: '/staging/starter/roles',
        search: '?q=admin',
        hash: '#top',
      });
    });

    it('does not double-prepend if already prefixed', () => {
      expect(
        mergeToBasename({ pathname: '/staging/starter/roles' }, basename),
      ).toEqual({ pathname: '/staging/starter/roles' });
    });

    it('handles nested paths', () => {
      expect(
        mergeToBasename({ pathname: '/roles/uuid-123/edit' }, basename),
      ).toEqual({ pathname: '/staging/starter/roles/uuid-123/edit' });
    });

    it('returns Location unchanged when pathname is missing', () => {
      expect(mergeToBasename({ search: '?q=admin' }, basename)).toEqual({
        search: '?q=admin',
      });
    });
  });
});
