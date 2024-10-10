export type CardsQuizAnswer = {
  id: string;
  name: string;
  simpleName: string;
  set: string;
  cost: string[];
  identity: string[];
  colors: string[];
  type: string;
  image: string;
  price: {
    usd: string;
    eur: string;
    tix: string;
  };
};
