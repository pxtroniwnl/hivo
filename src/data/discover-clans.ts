// Dataset de descubrimiento de clanes — port de clan-onboarding.jsx:5-63.
// Los gradientes CSS se transcriben como pares [from, to].
import type { DiscoverClan } from './types';

import { colors } from '@/theme';

export const DISCOVER_CLANS: DiscoverClan[] = [
  {
    id: 'IRC-4892',
    name: 'Iron Crows',
    tag: 'CRWS',
    members: 6,
    max: 8,
    rank: 'Diamond',
    region: 'Madrid',
    description:
      'High-volume strength clan. Six lifters running PPL with a focus on big compounds. Spanish + English.',
    color: [colors.accent, colors.accentDeep],
    trending: true,
    openToJoin: true,
    weeklyVolume: 92400,
    prs: 14,
    ageRange: '24–32',
    sample: ['Mara V.', 'Diego R.', 'Tea M.', 'Yuki S.'],
  },
  {
    id: 'STP-1023',
    name: 'Steel Pact',
    tag: 'STPC',
    members: 8,
    max: 8,
    rank: 'Diamond',
    region: 'Barcelona',
    description:
      'Full clan focused on powerlifting. Members run 5/3/1 and Conjugate. Weekly meets, strict accountability.',
    color: ['#5a5a5a', '#2a2a2a'],
    trending: true,
    openToJoin: false,
    weeklyVolume: 118200,
    prs: 22,
    ageRange: '28–40',
    sample: ['Pablo G.', 'Inés R.', 'Alex F.'],
  },
  {
    id: 'GLT-2208',
    name: 'Glúteas Power',
    tag: 'GLT',
    members: 5,
    max: 8,
    rank: 'Gold',
    region: 'Valencia',
    description:
      'Glute & posterior chain hypertrophy. Twice-weekly hip thrust raids. Mujeres + amigos.',
    color: ['#ff7b9c', '#c2185b'],
    trending: true,
    openToJoin: true,
    weeklyVolume: 71800,
    prs: 9,
    ageRange: '22–30',
    sample: ['Lucía A.', 'Marta T.', 'Sofía R.'],
  },
  {
    id: 'NRT-7711',
    name: 'Norte Power',
    tag: 'NRT',
    members: 5,
    max: 8,
    rank: 'Gold',
    region: 'Bilbao',
    description:
      'Casual but consistent. Mostly first-year lifters supporting each other. New members welcome.',
    color: ['#4d9cff', '#1a3d80'],
    trending: false,
    openToJoin: true,
    weeklyVolume: 42100,
    prs: 5,
    ageRange: '18–24',
    sample: ['Iker M.', 'Aitor B.'],
  },
  {
    id: 'CFR-4401',
    name: 'Casa Fuerte',
    tag: 'CFR',
    members: 4,
    max: 8,
    rank: 'Gold',
    region: 'Sevilla',
    description:
      'Home-gym lifters. Equipment-light routines, lots of bodyweight + dumbbells. Calm + supportive.',
    color: ['#c9a16e', '#6b4422'],
    trending: false,
    openToJoin: true,
    weeklyVolume: 38500,
    prs: 7,
    ageRange: '30–45',
    sample: ['Javier P.', 'Rocío L.'],
  },
  {
    id: 'WHL-9020',
    name: 'Wheel House',
    tag: 'WHL',
    members: 7,
    max: 8,
    rank: 'Platinum',
    region: 'Berlin',
    description:
      'English-speaking clan with a leg-day obsession. "Don\'t skip leg day, even on holiday."',
    color: ['#c9f24a', '#6b8e1e'],
    trending: true,
    openToJoin: true,
    weeklyVolume: 86700,
    prs: 11,
    ageRange: '26–35',
    sample: ['Lukas H.', 'Anya P.', 'Mike T.', 'Sara K.'],
  },
];

// Paleta para crear clan (clan-onboarding.jsx:390-397).
export const CLAN_COLORS: [string, string][] = [
  [colors.accent, colors.accentDeep],
  ['#4d9cff', '#1a3d80'],
  ['#c9f24a', '#6b8e1e'],
  ['#ff8a3d', '#cc5a18'],
  ['#c9a16e', '#6b4422'],
  ['#b26bff', '#5e3aa6'],
];

// ID determinista basado en el nombre (clan-onboarding.jsx:520-527).
export function makeClanId(name: string): string {
  const tag = (name.trim().slice(0, 3) || 'NEW').toUpperCase();
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) & 0x7fff;
  const num = String((h % 9000) + 1000);
  return `${tag}-${num}`;
}
