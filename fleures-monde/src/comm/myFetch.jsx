import axios from "axios";
import { config } from "../config/config";

export async function myFetch(endpoint, options = {}) {
  const url = `${config.apiBaseUrl}${endpoint}`;

  if (config.useAxios) {
    // Axios
    const method = options.method || "GET";
    const data = options.body || null;
    const response = await axios({ url, method, data });
    return response.data;
  } else {
    // Fetch
    const res = await fetch(url, options);
    return await res.json();
  }
}
