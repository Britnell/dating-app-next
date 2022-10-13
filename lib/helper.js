export const apiPost = (route, data) =>
  fetch(route, { method: "POST", body: JSON.stringify(data) })
    .then((res) => res.json())
    .catch((e) => {
      console.log(" fetch err ", err);
      throw err;
    });

export const apiFetch = (route) => fetch(route).then((res) => res.json());
