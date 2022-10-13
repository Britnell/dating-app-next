import { deleteCookie } from "@/lib/auth";

export default async function handler(req, res) {
  try {
    deleteCookie(res);
    res.status(200).json({ user: null });
  } catch (err) {
    const msg = ` # Server Error - ${err.message} `;
    res.status(400).json({ error: msg });
  }
}
