import { cookies } from "next/headers";

const API_BASE_URL: string =
  process.env.ALLOWED_ORIGINS || "http://localhost:8080";
const get_cookies = async () => {
  const cookie = await cookies();
  const accessToken = cookie.get("accessToken")?.value;
  const refreshToken = cookie.get("refreshToken")?.value;
  return { accessToken, refreshToken };
};

const call_api = async (url: string, method: string, body?: any) => {
  try {
    const MainURL = API_BASE_URL + url;
    const { accessToken, refreshToken } = await get_cookies();

    let res;
    if (method === "GET") {
      res = await fetch(MainURL, {
        method,
        headers: {
          cookie: `accessToken=${accessToken}; refreshToken=${refreshToken}`,
          "Content-Type": "application/json",
        },
      });
    } else {
      res = await fetch(MainURL, {
        method,
        headers: {
          cookie: `accessToken=${accessToken}; refreshToken=${refreshToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });
    }

    if (res.status === 200) {
      return res.json();
    }
    else if (res.status === 401) {
      const refreshURL: string = API_BASE_URL + "/api/auth/refresh";
      if (MainURL === refreshURL) {
        throw Error("Refresh token expired");
      }
      const res = await fetch(refreshURL, {
        method: "POST",
        headers: {
          cookie: `refreshToken=${refreshToken}`,
          "Content-Type": "application/json",
        },
      });

      if (res.status === 200) {
        return await call_api(url, method, body);
      } else {
        throw Error("Failed to refresh token");
      }
    }
    else {
        throw Error("API call failed");
    }
  } catch (error) {
    throw Error("Refresh token expired");
  }
};
