import ACache from "./cache.ts";
import constants from "./constants.ts";

class ClientError extends Error {
  constructor(msg: string) {
    super(msg);
  }
}

const defaultClientOps: ClientOps = {
  baseUrl: constants.BASE_URL,
  version: constants.VERSION,
  apiKey: undefined
}

export class Client {
  private ops: InternalClientOps;
  private readonly cache = ACache;


  /**
   * Creates a new instance of the `Client` class.
   * @constructor
   * @param {ClientOps} ops - The options for the client. API key is required.
   */
  constructor(ops: ClientOps) {
    ops.apiKey ? ops = { ...defaultClientOps, apiKey: ops.apiKey } : ops = { ...defaultClientOps };

    if (!ops.apiKey) {
      throw new ClientError("API key is required");
    }

    /* check for proper deno permissions */
    const netPerm = Deno.permissions.querySync({  
      name: "net",
    });

    if (netPerm.state == "denied" || netPerm.state == "prompt") throw new ClientError(`Net permission required. Please add --allow-net to your deno flags`);

    this.ops = {
      url: `${ops.baseUrl}/${ops.version}`,
      apiKey: ops.apiKey
    };
  }

  /**
   * Retrieve a list of cards based on the specified options.
   *
   * @param {CardsOps} [cardOps] - Optional parameter to customize the card retrieval.
   * @return {Promise<CardItem[]>} - A promise that resolves to an array of card items.
   * 
   * Getting all cards:
   * @example 
   * ``` ts
   * const cards = await client.cards();
   * console.log(cards[0])
   * ```
   * Paginating the cards:
   * @example
   * ``` ts
   * const cards = await client.cards({ limit: 10, after: 10 });
   * console.log(cards[0])
   * ```
   */
  public async cards(cardOps?: CardsOps): Promise<CardItem[]> {
    cardOps = { ...cardOps };
    /*
    For some reason, none of the official api url params work,
    so we have to improvise and be nice to the client users and 
    provide them programmatically ourselves.
    */

    let cards: CardItem[] = [];

    if (this.isCached(this.cache.cardCache, cardOps.refresh)) {
      cards = this.cache.cardCache!;
    } else {
      let data = await this.execute(constants.CARDS) as {
        items: CardItem[]
      };
      this.cache.cardCache = data.items;
      cards = data.items;
    }

    /*
    Provide the helpers
     */
    if (cardOps.after) {
      cards = cards.slice(cardOps.after);
    }

    if (cardOps.limit) {
      cards = cards.slice(0, cardOps.limit);
    }
    return cards;
  }

  private isCached(cache: any, ref: boolean | undefined) {
    return cache != undefined  && (ref == false || ref == undefined);
  }

  private async execute(apiPath: string, params?: Record<string, string>) {
    const urlParams = params ? new URLSearchParams(params).toString() : "";
    let resp =  await (await fetch(`${this.ops.url}${apiPath}${urlParams}`, { headers: { "Authorization": "Bearer " + this.ops.apiKey  } })).json();

    let respStr = JSON.stringify(resp);

    if (resp.message) throw new ClientError(`Received malformed response from API: "${respStr}"`)

    return resp;
  }
}