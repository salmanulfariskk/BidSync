import { DefaultSession } from 'next-auth';

declare module 'next-auth' {
  interface Session {
    accessToken?: string;
    user: {
      id: string;
      role: 'BUYER' | 'SELLER';
    } & DefaultSession['user'];
  }

  interface User {
    id: string;
    email: string;
    name: string;
    role: 'BUYER' | 'SELLER';
    token: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    role: 'BUYER' | 'SELLER';
    accessToken: string;
  }
}