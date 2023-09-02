import { Client } from './client.ts';
import { load } from 'https://deno.land/std@0.201.0/dotenv/mod.ts';
import { assertEquals } from "https://deno.land/std@0.191.0/testing/asserts.ts";


// setup
const env = await load();
const client = new Client({ apiKey: env['CLASH_TOKEN'] });

Deno.test({
  name: "Limit's the number of cards retrieved",
  fn: async () => {
    const cards = await client.cards({ limit: 10 });
    assertEquals(cards.length, 109);
  }
})