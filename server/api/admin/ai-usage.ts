import { auth } from "~/utils/auth";

export default defineEventHandler(async (event) => {
 
   
  const req = await fetch("https://openrouter.ai/api/v1/key", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
    },
  });
  const res = await req.json();
  return res;
});
