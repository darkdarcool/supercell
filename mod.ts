import { Client as ClashClient } from "./src/clash/client.ts";

export { 
  ClashClient
}

async function main() {
  const { load } = await import("https://deno.land/std@0.201.0/dotenv/mod.ts");
  const env = await load();
  const apiKey = env['CLASH_TOKEN'];
  /*
  let limit = 1000;

  const resp = await fetch(`${constants.BASE_URL_WITH_VERSION}${constants.CARDS}`, {
    headers: {
      "Authorization": `Bearer ${apiToken}`
    }
  });

  const data = await resp.json();

  console.log(data.items.length);
  */

  const client = new ClashClient({ apiKey });
  // 109 cards

  let cards = await client.cards({ limit: 10 });

  console.log(cards);  
}

if (import.meta.main) {
  main();
}