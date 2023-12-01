import { QueueType } from "@fyp/types";

export const queue = (queue: QueueType) => {
  let name: string;
  switch (queue) {
    case 400:
      name = 'Normal (Draft)'
      break;
    case 420:
      name = 'Ranked (Solo)'
      break;
    case 430:
      name = 'Normal (Blind)'
      break;
    case 440:
      name = 'Ranked (Flex)'
      break;
  }
  return name;
}