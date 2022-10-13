import { loginCheck } from "@/lib/auth";
import Layout from "comp/Layout";
import Login from "comp/Login";
import App from "comp/App";
import { fetchUser } from "@/lib/database";

export default function Page({ user }) {
  return (
    <Layout loggedIn={!!user}>{user ? <App user={user} /> : <Login />}</Layout>
  );
}

export async function getServerSideProps({ req }) {
  try {
    const { id } = loginCheck(req);
    const user = await fetchUser(id);

    return {
      props: {
        user,
      },
    };
  } catch (e) {
    return {
      props: {},
    };
  }
}
