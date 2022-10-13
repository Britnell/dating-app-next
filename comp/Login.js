import { apiPost } from "@/lib/helper";

export default function Login() {
  const submit = async (ev) => {
    ev.preventDefault();
    const { email, password } = Object.fromEntries(new FormData(ev.target));
    const { error } = await apiPost("/api/login", { email, password });
    if (!error) window.location.reload();
  };

  return (
    <div>
      <h2>Login</h2>
      <div>
        <form onSubmit={submit}>
          <label htmlFor="email">Email</label>
          <input name="email" type="email" />
          <label htmlFor="password">Password</label>
          <input name="password" type="password" />
          <button type="submit">Login</button>
        </form>
      </div>
    </div>
  );
}
