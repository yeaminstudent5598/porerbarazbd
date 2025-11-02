import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.NEXTAUTH_SECRET!;

export const signJwtToken = (data: any) => {
  return jwt.sign(data, JWT_SECRET, { expiresIn: "7d" });
};

export const verifyJwtToken = (token: string) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return null;
  }
};
