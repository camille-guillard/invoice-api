import { describe, it, expect, vi } from 'vitest';
import request from 'supertest';
import { createServer } from '../../../src/infrastructure/http/server.js';

describe('Server error handler', () => {
  it('should handle uncaught errors with error middleware', async () => {
    const { app } = createServer();
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    // Find the error handler in the middleware stack
    const stack = app._router.stack;
    const errorHandlerIndex = stack.findIndex(layer => layer.handle.length === 4);

    // Insert a test route just BEFORE the error handler
    stack.splice(errorHandlerIndex, 0, {
      route: undefined,
      handle: (req, res, next) => {
        if (req.path === '/test-trigger-error') {
          return next(new Error('Test unhandled error'));
        }
        next();
      },
      name: 'testErrorTrigger',
      params: undefined,
      path: undefined,
      keys: [],
      regexp: /.*/,
      method: undefined
    });

    const response = await request(app).get('/test-trigger-error');

    expect(response.status).toBe(500);
    expect(response.body).toEqual({ error: 'Internal server error' });
    expect(consoleErrorSpy).toHaveBeenCalled();

    consoleErrorSpy.mockRestore();
  });
});
