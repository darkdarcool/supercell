interface ClientOps {
  /** configurable base url */
  baseUrl?: string,
  /** version of api */
  version?: string,
  /** required api key to use the (official) clash royale api */
  apiKey?: string
}

interface CardsOps {
  /** limit the number of possible results */
  limit?: number,
  /** return results after this number (for pagination) */
  after?: number, 
  /** refresh the cache */
  refresh?: boolean
}

interface InternalClientOps {
  url: string,
  apiKey: string
}

interface CardItem {
  name: string,
  id: number,
  maxLevel: number,
  iconUrls: {
    medium: string,
    evolutionMedium?: string
  },
  maxEvolutionLevel?: number
}