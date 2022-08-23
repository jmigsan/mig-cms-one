import { createProtectedRouter } from './protected-router';

// Example router with queries that can only be hit if the user requesting is signed in
export const userRouter = createProtectedRouter()
  .query('getRole', {
    async resolve({ ctx }) {
      const userRole = await ctx.prisma.user.findFirst({
        where: { id: ctx.session.user.id },
        select: { role: true },
      });

      return userRole?.role;
    },
  })
  .query('getName', {
    async resolve({ ctx }) {
      const userName = await ctx.prisma.user.findFirst({
        where: { id: ctx.session.user.id },
        select: { name: true },
      });

      return userName?.name;
    },
  })
  .query('getImage', {
    async resolve({ ctx }) {
      const userImage = await ctx.prisma.user.findFirst({
        where: { id: ctx.session.user.id },
        select: { image: true },
      });

      return userImage?.image;
    },
  });
