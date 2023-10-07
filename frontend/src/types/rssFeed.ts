export interface RssFeedFetchRequest  {
  urls: string[]
  limit?: number
}

export interface RssFeed {
  title: string
  link: string
  description: string
  published: string
  tags: string[]
}

export type RssFeedFetchResponse = RssFeed[]