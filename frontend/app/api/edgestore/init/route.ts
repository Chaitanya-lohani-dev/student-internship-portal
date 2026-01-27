import { initEdgeStore } from '@edgestore/server';
import { createEdgeStoreNextHandler } from '@edgestore/server/adapters/next/app';

const es = initEdgeStore.create();

const handler = createEdgeStoreNextHandler({
  router: es.router({}), 
});

export { handler as GET, handler as POST };
