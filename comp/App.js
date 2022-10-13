import { apiFetch, apiPost } from "@/lib/helper";
import { useCallback, useEffect, useState } from "react";
import styles from "./App.module.css";

let once = false;

const useFetch = (fetcher) => {
  const [state, setState] = useState({ data: null, error: null });

  const callback = useCallback(fetcher, [fetcher]);

  useEffect(() => {
    if (once) return;
    once = true;
    callback()
      .then((res) => setState({ error: null, data: res }))
      .catch((err) => setState({ data: null, error: err.message }));
  }, [callback]);
  return state;
};

export default function App({ user }) {
  const { data: profiles } = useFetch(() =>
    apiFetch("/api/profiles").then((res) => res.data)
  );
  const [swiped, setSwiped] = useState([]);

  const onSwipe = (pref, other) => {
    apiPost("/api/swipe", {
      user_id: user.id,
      match_id: other.id,
      preference: pref,
    }).then(({ match }) => {
      if (match) alert(" congratulations, its a match!");
      setSwiped([...swiped, other.id]);
    });
  };

  const hasLoaded = profiles && Array.isArray(profiles);
  const filteredProfiles = !profiles
    ? []
    : profiles.filter((u) => !swiped.includes(u.id));

  const firstProfile = hasLoaded ? filteredProfiles[0] : null;

  return (
    <div>
      <div>
        <h2>App</h2>
        <h3>Hi {user.name} - Let's find you a match!</h3>
        <p>You can start swiping again</p>
      </div>
      <div>
        {firstProfile && <ShowMatch onSwipe={onSwipe} data={firstProfile} />}
        {!hasLoaded && <div> [ L O A D I N G . . . . ] </div>}
        {hasLoaded && !firstProfile && (
          <div> the profiles match your search filter</div>
        )}
      </div>
    </div>
  );
}

const ShowMatch = ({ data, onSwipe }) => {
  return (
    <div key={data.id} className={styles.match}>
      <h3>
        {data.name} - {data.id}
      </h3>
      <h4>
        {data.gender} - {data.age}
      </h4>
      <div className={styles.buttons}>
        <button onClick={() => onSwipe("NO", data)}>No</button>
        <button onClick={() => onSwipe("YES", data)}>YES</button>
      </div>
    </div>
  );
};
