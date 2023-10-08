import { SentenceCard, TangoCard } from "../../server/models";
import { ONE_MINUTE_IN_SECONDS, getCurrentTime, randomRange } from "../../shared/util";

export const doCardCorrect = <T extends TangoCard | SentenceCard>(card: T) => {
  const currentTime = getCurrentTime();

  const timeDifference = card.due_timestamp - currentTime;

  const toAdd = Math.floor(card.due_timestamp + timeDifference * 0.9 + (randomRange(10, ONE_MINUTE_IN_SECONDS * 5)));

  // 秒数を増やす
  card.due_timestamp += toAdd;

  return card;
};

export const doCardIncorrect = <T extends TangoCard | SentenceCard>(card: T) => {
    card.miss_count += 1;

    return card;
}