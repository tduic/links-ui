import { MAX_LINKS, MIN_LINKS, MAX_LINK_VAL, MIN_LINK_VAL } from "./constants";

export const randomIntInRange = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1) + min);

export const initializeChain = () => {
  const numLinks = randomIntInRange(MIN_LINKS, MAX_LINKS);
  const linkArr = [];
  for (let i = 0; i < numLinks; i++) {
    linkArr.push(randomIntInRange(MIN_LINK_VAL, MAX_LINK_VAL));
  }
  return linkArr;
};
