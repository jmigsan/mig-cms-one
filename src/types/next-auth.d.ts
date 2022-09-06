import { DefaultSession } from 'next-auth';

enum Role {
  ADMIN,
  USER,
}
declare module 'next-auth' {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user?: {
      id: string;
      role: Role;
    } & DefaultSession['user'];
  }
}
