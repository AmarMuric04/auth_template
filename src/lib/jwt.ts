import { SignJWT, jwtVerify, JWTPayload } from "jose";

const secret = new TextEncoder().encode(process.env.JWT_SECRET!);

if (!secret) {
  throw new Error("JWT_SECRET is not set in the environment variables.");
}

export async function signJwt(payload: JWTPayload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secret);
}

export async function verifyJwt(token: string): Promise<JWTPayload> {
  const { payload } = await jwtVerify(token, secret);
  return payload as JWTPayload;
}
