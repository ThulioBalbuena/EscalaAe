import type { FormationConfig, FormationType, Position } from '../types'

/**
 * Mapa de configurações de formações.
 * row: distância do gol (0 = goleiro, 4 = ataque)
 * col: coluna dentro da linha (0-indexed, centrado)
 */
export const FORMATIONS: Record<FormationType, FormationConfig> = {
  '4-3-3': {
    label: '4-3-3',
    slots: [
      // Goleiro
      { position: 'GOL', row: 0, col: 0 },
      // Defensores
      { position: 'DEF', row: 1, col: 0 },
      { position: 'DEF', row: 1, col: 1 },
      { position: 'DEF', row: 1, col: 2 },
      { position: 'DEF', row: 1, col: 3 },
      // Meio-campo
      { position: 'MEI', row: 2, col: 0 },
      { position: 'MEI', row: 2, col: 1 },
      { position: 'MEI', row: 2, col: 2 },
      // Ataque
      { position: 'ATA', row: 3, col: 0 },
      { position: 'ATA', row: 3, col: 1 },
      { position: 'ATA', row: 3, col: 2 },
    ],
  },
  '4-4-2': {
    label: '4-4-2',
    slots: [
      // Goleiro
      { position: 'GOL', row: 0, col: 0 },
      // Defensores
      { position: 'DEF', row: 1, col: 0 },
      { position: 'DEF', row: 1, col: 1 },
      { position: 'DEF', row: 1, col: 2 },
      { position: 'DEF', row: 1, col: 3 },
      // Meio-campo
      { position: 'MEI', row: 2, col: 0 },
      { position: 'MEI', row: 2, col: 1 },
      { position: 'MEI', row: 2, col: 2 },
      { position: 'MEI', row: 2, col: 3 },
      // Ataque
      { position: 'ATA', row: 3, col: 0 },
      { position: 'ATA', row: 3, col: 1 },
    ],
  },
  '3-5-2': {
    label: '3-5-2',
    slots: [
      // Goleiro
      { position: 'GOL', row: 0, col: 0 },
      // Defensores
      { position: 'DEF', row: 1, col: 0 },
      { position: 'DEF', row: 1, col: 1 },
      { position: 'DEF', row: 1, col: 2 },
      // Meio-campo
      { position: 'MEI', row: 2, col: 0 },
      { position: 'MEI', row: 2, col: 1 },
      { position: 'MEI', row: 2, col: 2 },
      { position: 'MEI', row: 2, col: 3 },
      { position: 'MEI', row: 2, col: 4 },
      // Ataque
      { position: 'ATA', row: 3, col: 0 },
      { position: 'ATA', row: 3, col: 1 },
    ],
  },
}

/**
 * Retorna a configuração de uma formação.
 */
export function getFormationConfig(formation: FormationType): FormationConfig {
  return FORMATIONS[formation]
}

/**
 * Retorna quantos jogadores de cada posição a formação exige.
 */
export function getPositionLimits(formation: FormationType): Record<Position, number> {
  const config = getFormationConfig(formation)
  const limits: Record<Position, number> = { GOL: 0, DEF: 0, MEI: 0, ATA: 0 }
  for (const slot of config.slots) {
    limits[slot.position]++
  }
  return limits
}

/**
 * Retorna o total de jogadores em uma formação (sempre 11).
 */
export function getTotalSlots(formation: FormationType): number {
  return getFormationConfig(formation).slots.length
}
