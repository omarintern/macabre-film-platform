import request from 'supertest';
import app from '../index';

describe('API Server', () => {
  describe('GET /health', () => {
    it('should return health status with database info', async () => {
      const response = await request(app)
        .get('/health')
        .expect(200);

      expect(response.body).toHaveProperty('status', 'OK');
      expect(response.body).toHaveProperty('message', 'Film Collaboration Platform API is running');
      expect(response.body).toHaveProperty('timestamp');
      expect(response.body).toHaveProperty('database');
      expect(response.body).toHaveProperty('version');
      expect(typeof response.body.timestamp).toBe('string');
      expect(['connected', 'disconnected']).toContain(response.body.database);
    });
  });

  describe('GET /api', () => {
    it('should return API information', async () => {
      const response = await request(app)
        .get('/api')
        .expect(200);

      expect(response.body).toHaveProperty('message', 'Film Collaboration Platform API v1.0');
      expect(response.body).toHaveProperty('endpoints');
      expect(response.body.endpoints).toContain('/health');
      expect(response.body.endpoints).toContain('/api');
    });
  });

  describe('404 handler', () => {
    it('should return 404 for unknown routes', async () => {
      const response = await request(app)
        .get('/unknown-route')
        .expect(404);

      expect(response.body).toHaveProperty('error', 'Not Found');
      expect(response.body.message).toContain('/unknown-route');
    });
  });
});
