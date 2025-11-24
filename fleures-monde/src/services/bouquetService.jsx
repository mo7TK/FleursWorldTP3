import { myFetch } from "../comm/myFetch";

export async function getBouquets() {
  return await myFetch("/api/bouquets");
}

export async function sendLike(id) {
  return await myFetch(`/like?id=${id}`, { method: "POST" });
}
