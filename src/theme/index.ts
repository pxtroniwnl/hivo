export { colors, radii, space, screenInset } from './tokens';
export { fonts, tabularNums, type } from './typography';
// NOTA: motion.ts importa react-native-reanimated; se importa por separado
// (`@/theme/motion`) para no arrastrar Reanimated a módulos puros/tests (p.ej. lib/heat).
