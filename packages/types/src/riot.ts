
export const REGIONS = [
  "BR1",
  "EUN1",
  "EUW1",
  "KR",
  "LA1",
  "LA2",
  "NA1",
  "OC1",
  "TR1",
  "RU",
  "JP1",
  "VN2",
  "TW2",
  "TH2",
  "SG2",
  "PH2",
  "PBE1"
] as const

export type Regions = typeof REGIONS[number];

export const REGION_GROUPS = [
  "ASIA",
  "AMERICAS",
  "EUROPE",
  "SEA"
] as const

export type RegionGroups = typeof REGION_GROUPS[number];