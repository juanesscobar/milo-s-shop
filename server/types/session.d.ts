import 'express-session';

declare module 'express-session' {
  interface SessionData {
    userId?: string;
    userRole?: 'client' | 'admin';
    csrfToken?: string;
  }
}