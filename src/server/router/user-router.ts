import { createProtectedRouter } from './protected-router';

// Example router with queries that can only be hit if the user requesting is signed in
export const userRouter = createProtectedRouter().query('getRole', {
  async resolve({ ctx }) {
    const userRole = await ctx.prisma.user.findFirst({
      where: { id: ctx.session.user.id },
      select: { role: true },
    });

    return userRole?.role;
  },
});
