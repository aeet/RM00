ALTER DATABASE rm00 SET timezone TO 'UTC+8';
ALTER DATABASE rm00 SET client_encoding TO 'UTF8';
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'GrantType') THEN
        CREATE TYPE "GrantType" AS ENUM (
            'client_credentials',
            'authorization_code',
            'refresh_token',
            'implicit',
            'password'
        );
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'CodeChallengeMethod') THEN
        CREATE TYPE "CodeChallengeMethod" AS ENUM (
            's256',
            'plain'
        );
    END IF;
END $$;

CREATE TABLE IF NOT EXISTS "OAuthClient" (
  "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "clientId" VARCHAR(255) NOT NULL UNIQUE,
  "name" VARCHAR(255) NOT NULL,
  "secret" VARCHAR(255),
  "redirectUris" TEXT[] NOT NULL
);

CREATE TABLE IF NOT EXISTS "OAuthClientGrant" (
  "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "clientId" UUID REFERENCES "OAuthClient"("id"),
  "grantType" "GrantType" NOT NULL
);

CREATE TABLE IF NOT EXISTS "OAuthScope" (
  "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "name" VARCHAR(255) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS "OAuthClientScope" (
  "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "clientId" UUID REFERENCES "OAuthClient"("id"),
  "scopeId" UUID REFERENCES "OAuthScope"("id")
);

CREATE TABLE IF NOT EXISTS "OAuthUser" (
  "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "name" VARCHAR(255) NOT NULL,
  "account" VARCHAR(255) NOT NULL,
  "email" VARCHAR(255) NOT NULL,
  "password" VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS "OAuthAuthCode" (
  "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "code" VARCHAR(255) NOT NULL UNIQUE,
  "redirectUri" VARCHAR(255),
  "codeChallenge" VARCHAR(255),
  "codeChallengeMethod" "CodeChallengeMethod" NOT NULL,
  "expiresAt" TIMESTAMP NOT NULL,
  "userId" UUID REFERENCES "OAuthUser"("id"),
  "clientId" UUID REFERENCES "OAuthClient"("id")
);

CREATE TABLE IF NOT EXISTS "OAuthCodeScope" (
  "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "oauthCodeId" UUID REFERENCES "OAuthAuthCode"("id"),
  "scopeId" UUID REFERENCES "OAuthScope"("id")
);

CREATE TABLE IF NOT EXISTS "OAuthToken" (
  "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "accessToken" VARCHAR(255) NOT NULL UNIQUE,
  "accessTokenExpiresAt" TIMESTAMP NOT NULL,
  "refreshToken" VARCHAR(255) UNIQUE,
  "refreshTokenExpiresAt" TIMESTAMP,
  "clientId" UUID REFERENCES "OAuthClient"("id"),
  "userId" UUID REFERENCES "OAuthUser"("id"),
  "originatingAuthCodeId" UUID REFERENCES "OAuthAuthCode"("id")
);

CREATE TABLE IF NOT EXISTS "OAuthTokenScope" (
  "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "tokenId" UUID REFERENCES "OAuthToken"("id"),
  "scopeId" UUID REFERENCES "OAuthScope"("id")
);
