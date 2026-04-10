import type { FieldSlot, FormationType, Player, Position, ValidationResult } from '../types'
import { getPositionLimits } from './formations'

/**
 * Verifica se um jogador pode ocupar um slot (compatibilidade de posição).
 */
export function isPositionCompatible(player: Player, slot: FieldSlot): boolean {
  return player.position === slot.position
}

/**
 * Verifica se um jogador já está escalado em outro slot.
 */
export function isPlayerAlreadyInLineup(player: Player, slots: FieldSlot[]): boolean {
  return slots.some((s) => s.player?.id === player.id)
}

/**
 * Verifica se o slot já está ocupado por outro jogador.
 */
export function isSlotOccupied(slot: FieldSlot): boolean {
  return slot.player !== null
}

/**
 * Conta quantos jogadores de uma posição já estão escalados.
 */
export function countPlayersInPosition(position: Position, slots: FieldSlot[]): number {
  return slots.filter((s) => s.position === position && s.player !== null).length
}

/**
 * Verifica se a posição ainda tem vagas disponíveis na formação.
 */
export function hasPositionSlotAvailable(
  position: Position,
  formation: FormationType,
  slots: FieldSlot[]
): boolean {
  const limits = getPositionLimits(formation)
  const current = countPlayersInPosition(position, slots)
  return current < (limits[position] ?? 0)
}

/**
 * Tenta adicionar um jogador a um slot.
 * Retorna a lista de slots atualizada ou null se a operação for inválida.
 */
export function addPlayerToSlot(
  player: Player,
  slotId: string,
  slots: FieldSlot[],
  _formation: FormationType
): { slots: FieldSlot[]; error: string | null } {
  const slot = slots.find((s) => s.slotId === slotId)

  if (!slot) {
    return { slots, error: 'Slot não encontrado.' }
  }

  if (!isPositionCompatible(player, slot)) {
    return {
      slots,
      error: `${player.name} joga como ${player.position}, mas esse slot é de ${slot.position}.`,
    }
  }

  if (isPlayerAlreadyInLineup(player, slots)) {
    return {
      slots,
      error: `${player.name} já está escalado.`,
    }
  }

  // Substituir o jogador no slot (mesmo que já tenha alguém)
  const newSlots = slots.map((s) =>
    s.slotId === slotId ? { ...s, player } : s
  )

  return { slots: newSlots, error: null }
}

/**
 * Remove um jogador de um slot.
 */
export function removePlayerFromSlot(slotId: string, slots: FieldSlot[]): FieldSlot[] {
  return slots.map((s) => (s.slotId === slotId ? { ...s, player: null } : s))
}

/**
 * Limpa toda a escalação.
 */
export function clearLineup(slots: FieldSlot[]): FieldSlot[] {
  return slots.map((s) => ({ ...s, player: null }))
}

/**
 * Conta quantos slots estão preenchidos.
 */
export function countFilledSlots(slots: FieldSlot[]): number {
  return slots.filter((s) => s.player !== null).length
}

/**
 * Valida a escalação completa.
 * Retorna válido apenas se todos os 11 slots estiverem preenchidos
 * e todas as regras forem respeitadas.
 */
export function validateLineup(
  slots: FieldSlot[],
  formation: FormationType
): ValidationResult {
  const errors: string[] = []
  const limits = getPositionLimits(formation)

  // Verificar se todos os slots estão preenchidos
  const filled = countFilledSlots(slots)
  if (filled < 11) {
    errors.push(`Escalação incompleta: ${filled}/11 jogadores.`)
  }

  // Verificar duplicatas
  const playerIds = slots.filter((s) => s.player).map((s) => s.player!.id)
  const uniqueIds = new Set(playerIds)
  if (playerIds.length !== uniqueIds.size) {
    errors.push('Há jogadores duplicados na escalação.')
  }

  // Verificar limites por posição
  const positions: Position[] = ['GOL', 'DEF', 'MEI', 'ATA']
  for (const pos of positions) {
    const count = countPlayersInPosition(pos, slots)
    if (count !== limits[pos]) {
      errors.push(
        `Posição ${pos}: esperado ${limits[pos]}, escalado ${count}.`
      )
    }
  }

  // Verificar compatibilidade posição × slot
  for (const slot of slots) {
    if (slot.player && slot.player.position !== slot.position) {
      errors.push(
        `${slot.player.name} (${slot.player.position}) está em slot de ${slot.position}.`
      )
    }
  }

  return { valid: errors.length === 0, errors }
}

/**
 * Verifica se a escalação está apta para exportação (completa e válida).
 */
export function canExport(slots: FieldSlot[], formation: FormationType): boolean {
  return validateLineup(slots, formation).valid
}
