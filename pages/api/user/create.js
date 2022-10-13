import { fetchUser, insertUser, connectToDB } from "@/lib/database";
import { hashPassword } from "@/lib/auth";

const randomUser = () => {
  const age = 20 + Math.floor(Math.random() * 10);
  const id = Math.floor(Math.random() * 1000000);
  const r = Math.random();
  return {
    name: `name_${id}`,
    email: `${id}@test.com`,
    password: hashPassword(`${id}`),
    age,
    gender: r < 0.5 ? "m" : "f",
  };
};
export default async function handler(req, res) {
  const newUser = randomUser();
  const connect = await connectToDB();

  try {
    const [resp] = await insertUser(newUser, connect);
    if (!resp || !resp?.insertId) throw new Error(" error signing up");

    const { insertId: id } = resp;
    const user = await fetchUser(id, connect);
    connect.end();
    res.status(200).json({ data: user });
  } catch (err) {
    connect.end();
    const msg = ` # Server Error - ${err.message} `;
    res.status(400).json({ error: msg });
  }
}
