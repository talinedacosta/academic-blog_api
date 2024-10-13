import request from 'supertest';
import { app } from '../app';

describe('App', () => {
  it('should be running and return 200 on the root route', async () => {
    const response = await request(app).get('/');
    expect(response.status).toBe(200);
  });

  it('should return 404 for an unknown route', async () => {
    const response = await request(app).get('/unknown-route');
    expect(response.status).toBe(404);
  });
});