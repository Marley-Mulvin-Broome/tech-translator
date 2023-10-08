import { CardBase, SentenceCard, TangoCard } from "../server/models";

export const ONE_DAY_IN_SECONDS = 60 * 60 * 24;
export const ONE_HOUR_IN_SECONDS = 60 * 60;
export const ONE_MINUTE_IN_SECONDS = 60;

/**
 * ランダムな整数を返す
 * @param min 
 * @param max 
 * @returns 
 */
export const randomRange = (min: number, max: number) => {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

/**
 * ランダムな要素を返す
 * @param array 
 * @returns 
 */
export const randomItemInArray = <T>(array: T[]) => {
    return array[randomRange(0, array.length - 1)];
}

export const shuffleArray = <T>(array: T[]) => {
  let currentIndex = array.length, randomIndex;

  // While there remain elements to shuffle.
  while (currentIndex > 0) {

    // Pick a remaining element.
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }

  return array;
}

/**
 * 
 * @returns 現在時刻のUNIXタイムスタンプ (秒)
 */
export const getCurrentTime = () => {
  return Math.floor(Date.now() / 1000);
}

export const getQuizableCards = (cards: CardBase[]) => {
  const currentTimestamp = Math.floor(new Date().getTime() / 1000);


  return cards.filter((card) => {
      // 未来のカードは除外
      return card.due_timestamp <= currentTimestamp;
  }).sort((a, b) => {
      return a.due_timestamp - b.due_timestamp;
  });
}