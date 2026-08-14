import jwt, { Secret, SignOptions } from "jsonwebtoken";

export type JwtPayload = {
  id: string;
  email: string;
};

export const signJwt = (
  payload: JwtPayload,
  expiresIn: SignOptions["expiresIn"] = "7d",
) => {
  const secret = process.env.JWT_SECRET as Secret;

  return jwt.sign(payload, secret, { expiresIn });
};

export const verifyJwt = (token: string) => {
  const secret = process.env.JWT_SECRET as Secret;

  return jwt.verify(token, secret) as JwtPayload;
};
