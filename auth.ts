import NextAuth, { NextAuthConfig, Profile } from "next-auth";
import type { OAuth2Config } from "next-auth/providers";
import { IDProfile } from "./types";

export const PurdueHackersIDProvider: OAuth2Config<IDProfile> = {
  id: 'purduehackers-id',
  name: 'Purdue Hackers ID',
  type: 'oauth',
  authorization: {
    url: 'https://id.purduehackers.com/api/authorize',
    params: {
      scope: 'user:read user',
      response_mode: 'form_post'
    }
  },
  checks: [],
  token: {
    url: 'https://id.purduehackers.com/api/token',
  },
  client: {
    token_endpoint_auth_method: 'client_secret_post',
  },
  issuer: 'https://id.purduehackers.com/api',
  userinfo: {
    url: 'https://id.purduehackers.com/api/user'
  },
  clientId: 'auth-test',
  clientSecret: '0',
  profile(profile) {
    return {
      ...profile,
      id: String(profile.id)
    }
  }
}

export const authConfig = {
  providers: [
    PurdueHackersIDProvider
  ],
  secret: process.env.AUTH_SECRET,
  callbacks: {
    async jwt({ token, profile }) {
      if (profile) {
        token.profile = profile;
      }
      return token;
    },
    async session({ session, token }) {
      if (token.profile) {
        session.user = {
          ...session.user,
          ...token.profile
        }
      }
      return { ...session };
    },
  },
} satisfies NextAuthConfig

export const { handlers: { GET, POST }, signIn, signOut, auth } = NextAuth(authConfig);
