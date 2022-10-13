import jwt from "jsonwebtoken";
import cookie from "cookie";
import bcrypt from "bcrypt";

const TOKEN_SECRET = "1234567890";
const TOKEN_NAME = "DATING_ACCESS_TOKEN";

export const jwtLogin = (data, res) => {
  const token = jwt.sign({ ...data, time: Date.now() }, TOKEN_SECRET, {
    expiresIn: "8h",
  });
  const _cookie = cookie.serialize(TOKEN_NAME, token, {
    httpOnly: true,
    maxAge: 3600 * 8,
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });
  res.setHeader("Set-Cookie", _cookie);
};

export const deleteCookie = (res) => {
  res.setHeader(
    "Set-Cookie",
    cookie.serialize(TOKEN_NAME, "deleted", {
      path: "/",
      expires: new Date(0),
    })
  );
};

export const hashPassword = (pass) => {
  const salt = bcrypt.genSaltSync();
  return bcrypt.hashSync(pass, salt);
};

export const checkPassword = (passA, passB) => bcrypt.compareSync(passA, passB);

const jwtVerify = (token) => jwt.verify(token, TOKEN_SECRET);

export const loginCheck = (req) => {
  const token = req.cookies[TOKEN_NAME];
  if (!token) throw new Error(" Login Error ");
  try {
    return jwtVerify(token);
  } catch (e) {
    throw new Error(" Login error");
  }
};
