import { SummonerSpell } from "@fyp/types";
import env from "@root/env";
import no_champion_img from '@assets/images/no_champion.png';

export const PATCH = '14.7.1';
export const BASE_CDN = 'https://ddragon.leagueoflegends.com/cdn';
export const BASE_RUNE_CDN = 'https://ddragon.canisback.com/img/perk-images/Styles/';

export const Asset = {
  champion: (champion: string) => {
    if (champion) {
      if (champion === 'FiddleSticks') {
        return `${BASE_CDN}/${PATCH}/img/champion/Fiddlesticks.png`;
      } else {
        return `${BASE_CDN}/${PATCH}/img/champion/${champion}.png`;
      }
    } else {
      return no_champion_img;
    }
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
  item: (id: number) => `${BASE_CDN}/${PATCH}/img/item/${id}.png`,
  primaryRune: (id: number) => {
    switch(id) {
      case 8005:
        return `${BASE_RUNE_CDN}/Precision/PressTheAttack/PressTheAttack.png`;
      case 8008:
        return `${BASE_RUNE_CDN}/Precision/LethalTempo/LethalTempoTemp.png`;
      case 8021:
        return `${BASE_RUNE_CDN}/Precision/FleetFootwork/FleetFootwork.png`;
      case 8010:
        return `${BASE_RUNE_CDN}/Precision/Conqueror/Conqueror.png`;
      case 8112:
        return `${BASE_RUNE_CDN}/Domination/Electrocute/Electrocute.png`;
      case 8124:
        return `${BASE_RUNE_CDN}/Domination/Predator/Predator.png`;
      case 8128:
        return `${BASE_RUNE_CDN}/Domination/DarkHarvest/DarkHarvest.png`;
      case 9923:
        return `${BASE_RUNE_CDN}/Domination/HailOfBlades/HailOfBlades.png`;
      case 8214:
        return `${BASE_RUNE_CDN}/Sorcery/SummonAery/SummonAery.png`;
      case 8229:
        return `${BASE_RUNE_CDN}/Sorcery/ArcaneComet/ArcaneComet.png`;
      case 8230:
        return `${BASE_RUNE_CDN}/Sorcery/PhaseRush/PhaseRush.png`;
      case 8437:
        return `${BASE_RUNE_CDN}/Resolve/GraspOfTheUndying/GraspOfTheUndying.png`;
      case 8439:
        return `${BASE_RUNE_CDN}/Resolve/VeteranAftershock/VeteranAftershock.png`;
      case 8465:
        return `${BASE_RUNE_CDN}/Resolve/Guardian/Guardian.png`;
      case 8351:
        return `${BASE_RUNE_CDN}/Inspiration/GlacialAugment/GlacialAugment.png`;
      case 8360:
        return `${BASE_RUNE_CDN}/Inspiration/UnsealedSpellbook/UnsealedSpellbook.png`;
      case 8369:
        return `${BASE_RUNE_CDN}/Inspiration/FirstStrike/FirstStrike.png`;
      default:
        return '';
    }
  },
  secondaryRune: (id: number) => {
    switch(id) {
      case 8000:
        return `${BASE_RUNE_CDN}/7201_Precision.png`;
      case 8100:
        return `${BASE_RUNE_CDN}/7200_Domination.png`;
      case 8200:
        return `${BASE_RUNE_CDN}/7202_Sorcery.png`;
      case 8300:
        return `${BASE_RUNE_CDN}/7203_Whimsy.png`;
      case 8400:
        return `${BASE_RUNE_CDN}/7204_Resolve.png`;
      default:
        return '';
    }
  },
  profileIcon: (id: number) => `${BASE_CDN}/${PATCH}/img/profileicon/${id}.png`,
  splash: (champion: string) => `${env.RENDERER_VITE_CDN_URL}/splash/${champion}.jpg`
};
