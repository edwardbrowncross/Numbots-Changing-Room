import raw_data from './data.json';

export type BotPart = {
  id: number;
  name: string;
  url: string;
  position: string;
  category: string;
  category_id: number;
  groups: number[];
  price: number;
  created_at: null | string;
  updated_at: string;
}

export const allParts = raw_data.map(d => ({ ...d, url: d.image_name })) as BotPart[];

export type Robot = {
  name: string;
  url: string;
  parts: Record<'head' | 'leftArm' | 'rightArm' | 'legs' | 'body', BotPart>;
  price: number;
}

function findPart(name: string, part: string) {
  return allParts.find(p => p.name.startsWith(name + ' ') && p.position === part);
}

const robots = allParts
  .filter(p => p.position === 'full')
  .map(p => {
    const name = p.name.replace(/full body/i, '').trim();
    return {
      name: name,
      url: p.url,
      parts: {
        head: findPart(name, 'head'),
        leftArm: findPart(name, 'arm-left'),
        rightArm: findPart(name, 'arm-right'),
        legs: findPart(name, 'legs'),
        body: findPart(name, 'body'),
      },
      price: p.price
    } as Robot
  })
  .sort((a, b) => a.price - b.price);

export default robots;