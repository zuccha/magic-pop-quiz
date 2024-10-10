export type CardsQuizAnswer = {
  id: string;
  name: string;
  simpleName: string;
  set: string;
  cost: string[];
  identity: string[];
  colors: string[];
  type: string;
  stats: {
    power: string;
    toughness: string;
  };
  image: string;
  url: string;
  price: {
    usd: string;
    eur: string;
    tix: string;
  };
};
