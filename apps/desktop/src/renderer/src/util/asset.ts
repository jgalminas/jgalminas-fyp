import { SummonerSpell } from "@fyp/types";

export const PATCH = '13.23.1';
export const BASE_CDN = 'https://ddragon.leagueoflegends.com/cdn';

//https://ddragon.leagueoflegends.com/cdn/13.23.1/img/champion/Belveth.png

export const Asset = {
  circleImage: (champion: string) => {
    return `${BASE_CDN}/${PATCH}/img/champion/${champion[0].toUpperCase() + champion.substring(1, champion.length).toLowerCase()}.png`;
  },
  summonerSpell: (spell: SummonerSpell) => {
    const url = `${BASE_CDN}/${PATCH}/img/spell/`;
    switch (spell) {
      case 1:
        return url + 'SummonerBoost.png';
      case 3:
        return url + 'SummonerExhaust.png'
      case 4:
        return url + 'SummonerFlash.png';
      case 6:
        return url + 'SummonerHaste.png';
      case 7:
        return url + 'SummonerHeal.png';
      case 11:
        return url + 'SummonerSmite.png';
      case 12:
        return url + 'SummonerTeleport.png';
      case 13:
        return url + 'SummonerMana.png';
      case 14:
        return url + 'SummonerDot.png';
      case 21:
        return url + 'SummonerBarrier.png';
    }
  },
  item: (id: number) => `${BASE_CDN}/${PATCH}/img/item/${id}.png`
};