import { user_token, type User } from "../stores/layout";



const getHeaders = () => {
  return {
    "content-type": "application/json",
    Authorization: `Bearer ${user_token}`,
  };
};

const localstring: String = "http://localhost:3000/api";

export async function getRandomCredentials(type?:string): Promise<User> {
  if (type) {
    const response = await fetch(
      `${localstring}/user/search?role=${type}`
    );
    const { data } = await response.json();

    return data;
  }
  const response = await fetch(`${localstring}/user/`);
  const { data } = await response.json();
  return data;
}

export async function userLogin({
  username,
  password
}: {
  username: string;
  password: string;
}): Promise<any> {
  const response = await fetch(`${localstring}/user/login`, {
    headers: getHeaders(),
    method: "POST",
    body: JSON.stringify({
      username,
      password
    }),
  });
  const { data } = await response.json();
  return data;
}

export async function getById(path: string, id: number): Promise<object> {
  const response = await fetch(`${localstring}/${path}/${id}`, {
    method: "GET",
    headers: getHeaders(),
  });
  const json = await response.json();
  return json;
}

export async function getAll(path: string): Promise<any> {
  const response = await fetch(`${localstring}/${path}`, {
    method: "GET",
    headers: getHeaders(),
  });
  const json = await response.json();

  return json;
}

export async function post(path: string, data: object) {
  const response = await fetch(`${localstring}/${path}`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(data),
  });
  const json = await response.json();

  return json;
}

export async function put(path: string, id:number, data: object) {
  const response = await fetch(`${localstring}/${path}/${id}`, {
    method: "PUT",
    headers: getHeaders(),
    body: JSON.stringify(data),
  });
  const json = await response.json();

  return json;
}

export async function deleteItem(path: string, id:number) {
  const response = await fetch(`${localstring}/${path}/${id}`, {
    method: "DELETE",
    headers: getHeaders()
  });
  const json = await response.json();

  return json;
}