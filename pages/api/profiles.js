import { loginCheck } from "@/lib/auth";
import { connectToDB, fetchProfiles } from "@/lib/database";

export default async function handler(req, res) {
  const connect = await connectToDB();
  try {
    const { id } = await loginCheck(req);
    const profiles = await fetchProfiles(id, connect);
    connect.end();

    res.status(200).json({ data: profiles });
  } catch (err) {
    connect.end();
    const msg = ` # Server Error - ${err.message} `;
    res.status(400).json({ error: msg });
  }
}
