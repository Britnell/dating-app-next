import { connectToDB, swipeAction } from "@/lib/database";

export default async function handler(req, res) {
  const connect = await connectToDB();

  try {
    const { user_id, match_id, preference } = JSON.parse(req.body);

    if (!(user_id && match_id && preference))
      return res.status(400).json({ error: " request incomplete" });

    // TODO checkCookie()

    const data = {
      match_id: parseInt(match_id),
      user_id: parseInt(user_id),
      preference,
    };
    const match = await swipeAction(data, connect);
    connect.end();
    res.status(200).json({ match });
  } catch (err) {
    connect.end();
    const msg = ` # Server Error - ${err.message} `;
    res.status(400).json({ error: msg });
  }
}
