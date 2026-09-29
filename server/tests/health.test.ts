import app from '../src/app';
import request from 'supertest';

describe('Health Check Endpoint', () => {
  it('should return 200 and a success message', async () => {
    const response = await request(app).get('/api/health');
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('success', true);
    expect(response.body).toHaveProperty('message', 'Smart Campus QuickFix API is running.');
  });
});
