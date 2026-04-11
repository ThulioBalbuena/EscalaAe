import { describe, expect, it } from 'vitest'
import {
  addPlayerToSlot,
  canExport,
  clearLineup,
  countFilledSlots,
  isPlayerAlreadyInLineup,
  isPositionCompatible,
  isSlotOccupied,
  removePlayerFromSlot,
  validateLineup,
} from '../src/services/lineup'
import { getFormationConfig } from '../src/services/formations'
import type { FieldSlot, FormationType, Player, Position } from '../src/types'

function createPlayer(id: string, position: Position, name = `Jogador ${id}`): Player {
  return {
    id,
    name,
    club: 'Teste FC',
    position,
    number: Number(id.replace(/\D/g, '')) || 1,
  }
}

function createSlots(formation: FormationType): FieldSlot[] {
  return getFormationConfig(formation).slots.map((slot, index) => ({
    slotId: `slot-${index + 1}`,
    position: slot.position,
    row: slot.row,
    col: slot.col,
    player: null,
  }))
}

function fillSlotsWithMatchingPlayers(slots: FieldSlot[]): FieldSlot[] {
  const counters: Record<Position, number> = {
    GOL: 0,
    DEF: 0,
    MEI: 0,
    ATA: 0,
  }

  return slots.map((slot) => {
    counters[slot.position] += 1
    return {
      ...slot,
      player: createPlayer(
        `${slot.position}-${counters[slot.position]}`,
        slot.position,
        `${slot.position} ${counters[slot.position]}`
      ),
    }
  })
}

describe('lineup - fluxo normal', () => {
  it('deve adicionar um jogador em um slot compatível', () => {
    const slots = createSlots('4-3-3')
    const goleiro = createPlayer('gol-1', 'GOL', 'Alisson')
    const golSlot = slots.find((slot) => slot.position === 'GOL')!

    const result = addPlayerToSlot(goleiro, golSlot.slotId, slots, '4-3-3')

    expect(result.error).toBeNull()
    expect(result.slots.find((slot) => slot.slotId === golSlot.slotId)?.player).toEqual(goleiro)
  })

  it('deve remover um jogador de um slot preenchido', () => {
    const slots = fillSlotsWithMatchingPlayers(createSlots('4-3-3'))
    const targetSlot = slots[0]

    const updated = removePlayerFromSlot(targetSlot.slotId, slots)

    expect(updated[0].player).toBeNull()
    expect(isSlotOccupied(updated[0])).toBe(false)
  })

  it('deve limpar toda a escalação', () => {
    const slots = fillSlotsWithMatchingPlayers(createSlots('4-4-2'))

    const cleared = clearLineup(slots)

    expect(countFilledSlots(cleared)).toBe(0)
    expect(cleared.every((slot) => slot.player === null)).toBe(true)
  })

  it('deve validar uma escalação completa e permitir exportação', () => {
    const slots = fillSlotsWithMatchingPlayers(createSlots('3-5-2'))

    const validation = validateLineup(slots, '3-5-2')

    expect(validation.valid).toBe(true)
    expect(validation.errors).toEqual([])
    expect(canExport(slots, '3-5-2')).toBe(true)
  })
})

describe('lineup - fluxo de extensao', () => {
  it('deve retornar erro ao tentar adicionar jogador em slot inexistente', () => {
    const slots = createSlots('4-3-3')
    const jogador = createPlayer('mei-1', 'MEI', 'Modric')

    const result = addPlayerToSlot(jogador, 'slot-invalido', slots, '4-3-3')

    expect(result.error).toBe('Slot não encontrado.')
    expect(result.slots).toEqual(slots)
  })

  it('deve retornar erro ao tentar adicionar jogador em posição incompatível', () => {
    const slots = createSlots('4-3-3')
    const atacante = createPlayer('ata-1', 'ATA', 'Haaland')
    const golSlot = slots.find((slot) => slot.position === 'GOL')!

    const result = addPlayerToSlot(atacante, golSlot.slotId, slots, '4-3-3')

    expect(result.error).toContain('Haaland joga como ATA')
    expect(result.error).toContain('slot é de GOL')
    expect(isPositionCompatible(atacante, golSlot)).toBe(false)
  })

  it('deve retornar erro ao tentar escalar o mesmo jogador duas vezes', () => {
    const slots = createSlots('4-4-2')
    const defensor = createPlayer('def-1', 'DEF', 'Marquinhos')
    const defSlots = slots.filter((slot) => slot.position === 'DEF')
    const firstAttempt = addPlayerToSlot(defensor, defSlots[0].slotId, slots, '4-4-2')

    const secondAttempt = addPlayerToSlot(defensor, defSlots[1].slotId, firstAttempt.slots, '4-4-2')

    expect(isPlayerAlreadyInLineup(defensor, firstAttempt.slots)).toBe(true)
    expect(secondAttempt.error).toBe('Marquinhos já está escalado.')
  })

  it('deve invalidar escalação incompleta e impedir exportação', () => {
    const slots = createSlots('4-3-3')
    const validation = validateLineup(slots, '4-3-3')

    expect(validation.valid).toBe(false)
    expect(validation.errors[0]).toContain('Escalação incompleta')
    expect(canExport(slots, '4-3-3')).toBe(false)
  })

  it('deve invalidar escalação com jogador em slot incompatível', () => {
    const slots = fillSlotsWithMatchingPlayers(createSlots('4-3-3'))
    const invalidSlots = slots.map((slot, index) =>
      index === 0 ? { ...slot, player: createPlayer('ata-extra', 'ATA', 'Mbappe') } : slot
    )
    const validation = validateLineup(invalidSlots, '4-3-3')

    expect(validation.valid).toBe(false)
    expect(validation.errors).toContain('Mbappe (ATA) está em slot de GOL.')
    expect(canExport(invalidSlots, '4-3-3')).toBe(false)
  })
})
