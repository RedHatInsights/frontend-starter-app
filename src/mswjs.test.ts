import { server } from './api-mock/test-server';

describe('sample test', () => {
  beforeAll(() => server.listen());
  afterEach(() => server.resetHandlers());
  afterAll(() => server.close());

  test('should get mocked user', async () => {
    const response = await fetch('/api/chrome-service/v1/user');
    const data = await response.json();
    console.log('Mocked user data:', data);
    expect(data).toEqual({
      id: 'abc-123',
      firstName: 'John',
      lastName: 'Maverick',
    });
  });
});
