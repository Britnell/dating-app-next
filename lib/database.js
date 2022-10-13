import mysql from "mysql2/promise";

const DB_USER = process.env.NEXT_PUBLIC_DB_USER;
const DB_PASSWORD = process.env.NEXT_PUBLIC_DB_PASSWORD;
const DB_HOST = process.env.NEXT_PUBLIC_DB_HOST;
const DB_DB = process.env.NEXT_PUBLIC_DB_DB;
const DB_PORT = parseInt(process.env.NEXT_PUBLIC_DB_PORT);

export const connectToDB = () =>
  mysql.createConnection({
    host: DB_HOST,
    port: DB_PORT,
    database: DB_DB,
    user: DB_USER,
    password: DB_PASSWORD,
  });

export const fetchTest = async (_connect) => {
  const connect = _connect ? _connect : await connectToDB();
  const res = await db.query("SELECT * FROM User");
  if (!_connect) connect.end();
  return res;
};

const createQuery = (obj) => {
  const columns = Object.keys(obj).join(",");
  const values = Object.values(obj)
    .map((x) => {
      if (typeof x === "string") return `'${x}'`;
      if (typeof x === "number") return `${x}`;
    })
    .join(",");

  const query = `(${columns}) VALUES (${values})`;
  return query;
};

export const insertUser = async (data, _connect) => {
  const connect = _connect ? _connect : await connectToDB();
  const queryString = " INSERT INTO User " + createQuery(data);
  const res = await connect.query(queryString);
  if (!_connect) connect.end();
  return res;
};

export const fetchUser = async (id, _connect) => {
  const connect = _connect ? _connect : await connectToDB();
  const [data] = await connect.query(`SELECT * FROM User WHERE id=${id}`);
  if (!_connect) connect.end();
  const user = data[0];
  if (!user) throw new Error(" user not found ");
  return user;
};

export const findUser = async (email, _connect) => {
  const connect = _connect ? _connect : await connectToDB();
  const [data] = await connect.query(
    `SELECT * FROM User WHERE email='${email}'`
  );
  if (!_connect) connect.end();
  const user = data[0];
  if (!user) throw new Error(" user not found ");
  return user;
};

// mock - later preferences will be fetched
const getPreferences = (user) => ({
  gender: user.gender === "m" ? "f" : "m",
  ageMin: user.age - 2,
  ageMax: user.age + 2,
});

export const getSwiped = async (id, _connect) => {
  const connect = _connect ? _connect : await connectToDB();
  const [rows] = await connect.query(
    ` SELECT DISTINCT match_id FROM Swipe WHERE user_id=${id} `
  );
  if (!_connect) connect.end();
  return rows.map((row) => row.match_id);
};

export const fetchMatching = async (user, _connect) => {
  const connect = _connect ? _connect : await connectToDB();

  const preference = getPreferences(user);

  const swiped = await getSwiped(user.id);
  const swipedQuery =
    swiped.length > 0 ? `AND id NOT IN (${swiped.join(",")})` : "";
  const query = `
    SELECT * FROM User 
     WHERE age>=${preference.ageMin}
     AND age<=${preference.ageMax}
     AND gender='${preference.gender}'
     ${swipedQuery} `;

  const [rows] = await connect.query(query);
  if (!_connect) connect.end();
  return rows;
};

export const fetchProfiles = async (id, _connect) => {
  const connect = _connect ? _connect : await connectToDB();
  const user = await fetchUser(id, connect);
  const profiles = await fetchMatching(user, connect);
  if (!_connect) connect.end();
  return profiles;
};

const swipeUser = async (user_id, match_id, preference, _connect) => {
  const connect = _connect ? _connect : await connectToDB();
  const qs =
    `INSERT INTO Swipe ` + createQuery({ user_id, match_id, preference });
  const res = await connect.query(qs);
  if (!_connect) connect.end();
  return res;
};

export const checkMatch = async (user_id, match_id, _connect) => {
  const connect = _connect ? _connect : await connectToDB();
  const [data] = await connect.query(
    ` SELECT * FROM Swipe WHERE user_id=${user_id} AND match_id=${match_id} `
  );
  if (!_connect) connect.end();
  if (!data[0]) return false;
  return data[0].preference === "YES";
};

export const swipeAction = async (
  { user_id, match_id, preference },
  _connect
) => {
  const connect = _connect ? _connect : await connectToDB();
  await swipeUser(user_id, match_id, preference, connect);

  if (preference === "NO") return false;
  const res = await checkMatch(match_id, user_id, connect);
  if (!_connect) connect.end();
  return res;
};
