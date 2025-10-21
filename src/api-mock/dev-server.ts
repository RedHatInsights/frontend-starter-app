import { createServer } from '@mswjs/http-middleware';
import { handlers } from './handlers';

const httpServer = createServer(...handlers);

httpServer.use(async (req, res, next) => {
  console.log(`Received request: ${req.method} ${req.url}`);
  await next();
});

httpServer.listen(9001, () => {
  console.log('Mock API server is running at http://localhost:9001');
});
