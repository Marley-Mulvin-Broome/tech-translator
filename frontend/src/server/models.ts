export interface CardContainer {
  container_id: string;
  owner_id: string;
  is_sentence: boolean;
  name: string;
}

export interface CardContainerList {
  containers: CardContainer[];
}

export interface CardBase {
  card_id: string;
  english: string;
  japanese: string;
  url: string;
  due_timestamp: number;
  known: boolean;
  created_timestamp: number;
  miss_count: number;
  is_sentence: boolean;
}

export interface TangoCard extends CardBase {
  pronunciation: string;
  example_sentence_english: string;
  example_sentence_japanese: string;
}

export interface SentenceCard extends CardBase {
  explanation: string;
}

export interface CreateTangoCardModel {
  english: string;
  japanese: string;
  pronunciation: string;
  example_sentence_english: string;
  example_sentence_japanese: string;
  url: string;
}

export interface CreateSentenceCardModel {
  english: string;
  japanese: string;
  explanation: string;
  url: string;
}

export interface CardContainerCreatedResponse {
  container_id: string;
  owner_uid: string;
  is_sentence: boolean;
}

export interface OkResponse {
  message: "OK";
}

export type SettableCardField = "name" | "english" | "japanese" | "pronunciation" | "example_sentence_english" | "example_sentence_japanese" | "explanation" | "url" | "due_timestamp" | "known" | "miss_count";

export interface RssFetchRequest {
  urls: string[];
  limit: number;
};

export interface RssFeed {
  title: string;
  link: string;
  description: string;
  published: string;
  tags: string[];
};

export interface RssFeedEntriesModel {
  entries: RssFeed[];
}

export interface LoginResponse {
  token: string;
  refresh_token: string;
}