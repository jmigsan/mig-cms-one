// src/server/router/index.ts
import { createRouter } from './context';
import superjson from 'superjson';

import { exampleRouter } from './example';
import { protectedExampleRouter } from './protected-example-router';
import { userRouter } from './user-router';
import { postRouter } from './post-router';
import { productRouter } from './product-router';
import { b2Router } from './b2-router';
import { publicRouter } from './public-router';
import { imageRouter } from './image-router';

export const appRouter = createRouter()
  .transformer(superjson)
  .merge('example.', exampleRouter)
  .merge('question.', protectedExampleRouter)
  .merge('user.', userRouter)
  .merge('post.', postRouter)
  .merge('product.', productRouter)
  .merge('b2.', b2Router)
  .merge('public.', publicRouter)
  .merge('image.', imageRouter);

// export type definition of API
export type AppRouter = typeof appRouter;
