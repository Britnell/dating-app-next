import { findUser } from "@/lib/database";
import { checkPassword, jwtLogin } from "@/lib/auth";

export default async function handler(req, res) {
  try {
    if (req.method !== "POST") throw new Error(" bad request");
    const { email, password } = JSON.parse(req.body);
    const user = await findUser(email);

    const correctPW = checkPassword(password, user.password);

    if (!user || !correctPW) throw new Error(" user not found ");

    jwtLogin({ email, password, id: user.id }, res);

    res.status(200).json({ data: user });
  } catch (err) {
    const msg = ` # Server Error - ${err.message} `;
    res.status(400).json({ error: msg });
  }
}
