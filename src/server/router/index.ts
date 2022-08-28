// src/server/router/index.ts
import { createRouter } from './context';
import superjson from 'superjson';

import { exampleRouter } from './example';
import { protectedExampleRouter } from './protected-example-router';
import { userRouter } from './user-router';
import { postRouter } from './post-router';
import { productRouter } from './product-router';

export const appRouter = createRouter()
  .transformer(superjson)
  .merge('example.', exampleRouter)
  .merge('question.', protectedExampleRouter)
  .merge('user.', userRouter)
  .merge('post.', postRouter)
  .merge('product.', productRouter);

// export type definition of API
export type AppRouter = typeof appRouter;
