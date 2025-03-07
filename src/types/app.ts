export type AppTokenPayload = {
  iss: string;
  sub: string;
  aud: string;
  iat: number;
  exp: number;
  scope: string;
  gty: string;
  azp: string;
};
