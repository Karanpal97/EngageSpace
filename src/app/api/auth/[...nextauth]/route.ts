import NextAuth from "next-auth/next";

import { authoptions } from "./option";

const handler = NextAuth(authoptions);
export { handler as POST, handler as GET };
