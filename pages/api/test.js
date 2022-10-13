import { fetchTest } from "@/lib/database";

export default async function handler(req, res) {
  // console.log(" / GET test");

  try {
    const [rows] = await fetchTest();
    res.status(200).json({ data: rows });
  } catch (err) {
    const msg = ` # Server Error - ${err.message} `;
    res.status(400).json({ error: msg });
  }
}
