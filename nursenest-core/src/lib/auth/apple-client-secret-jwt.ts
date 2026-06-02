import jwt from "jsonwebtoken";

/** Apple Sign In client secret JWT (ES256), max ~180 days per Apple policy. */
export function generateAppleClientSecretJwt(args: {
  clientId: string;
  teamId: string;
  keyId: string;
  privateKey: string;
}): string {
  return jwt.sign(
    {
      iss: args.teamId,
      aud: "https://appleid.apple.com",
      sub: args.clientId,
    },
    args.privateKey,
    {
      algorithm: "ES256",
      keyid: args.keyId,
      expiresIn: "180d",
    },
  );
}
