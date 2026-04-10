import { describe, it, expect } from 'vitest'
import {
  getFormationConfig,
  getPositionLimits,
  getTotalSlots,
  FORMATIONS,
} from '../src/services/formations'
import type { FormationType } from '../src/types'

// TESTES DE FLUXO NORMAL (cenários válidos)
describe('formations – fluxo normal', () => {
  it('deve retornar a configuração correta para 4-3-3', () => {
    const config = getFormationConfig('4-3-3')
    expect(config.label).toBe('4-3-3')
    expect(config.slots).toHaveLength(11)
  })

  it('deve retornar a configuração correta para 4-4-2', () => {
    const config = getFormationConfig('4-4-2')
    expect(config.label).toBe('4-4-2')
    expect(config.slots).toHaveLength(11)
  })

  it('deve retornar a configuração correta para 3-5-2', () => {
    const config = getFormationConfig('3-5-2')
    expect(config.label).toBe('3-5-2')
    expect(config.slots).toHaveLength(11)
  })

  it('deve retornar 11 slots totais para 4-3-3', () => {
    expect(getTotalSlots('4-3-3')).toBe(11)
  })

  it('deve retornar 11 slots totais para 4-4-2', () => {
    expect(getTotalSlots('4-4-2')).toBe(11)
  })

  it('deve retornar 11 slots totais para 3-5-2', () => {
    expect(getTotalSlots('3-5-2')).toBe(11)
  })

  it('deve retornar limites corretos para 4-3-3 (4 DEF, 3 MEI, 3 ATA)', () => {
    const limits = getPositionLimits('4-3-3')
    expect(limits.DEF).toBe(4)
    expect(limits.MEI).toBe(3)
    expect(limits.ATA).toBe(3)
  })

  it('deve retornar limites corretos para 4-4-2 (4 DEF, 4 MEI, 2 ATA)', () => {
    const limits = getPositionLimits('4-4-2')
    expect(limits.DEF).toBe(4)
    expect(limits.MEI).toBe(4)
    expect(limits.ATA).toBe(2)
  })

  it('deve retornar limites corretos para 3-5-2 (3 DEF, 5 MEI, 2 ATA)', () => {
    const limits = getPositionLimits('3-5-2')
    expect(limits.DEF).toBe(3)
    expect(limits.MEI).toBe(5)
    expect(limits.ATA).toBe(2)
  })

  it('deve existir as três formações no mapa FORMATIONS', () => {
    expect(FORMATIONS['4-3-3']).toBeDefined()
    expect(FORMATIONS['4-4-2']).toBeDefined()
    expect(FORMATIONS['3-5-2']).toBeDefined()
  })
})

// TESTES DE FLUXO DE EXTENSÃO (cenários inválidos / limites)
describe('formations – fluxo de extensão', () => {
  it('nenhuma formação deve ter 0 goleiros', () => {
    for (const f of Object.keys(FORMATIONS) as FormationType[]) {
      expect(getPositionLimits(f).GOL).not.toBe(0)
    }
  })

  it('nenhuma formação deve ter mais de 1 goleiro', () => {
    for (const f of Object.keys(FORMATIONS) as FormationType[]) {
      expect(getPositionLimits(f).GOL).toBeLessThanOrEqual(1)
    }
  })

  it('4-3-3 não deve ter 4 meias', () => {
    expect(getPositionLimits('4-3-3').MEI).not.toBe(4)
  })

  it('3-5-2 não deve ter 4 defensores', () => {
    expect(getPositionLimits('3-5-2').DEF).not.toBe(4)
  })

  it('getTotalSlots nunca deve retornar valor diferente de 11', () => {
    const formations: FormationType[] = ['4-3-3', '4-4-2', '3-5-2']
    for (const f of formations) {
      expect(getTotalSlots(f)).not.toBe(10)
      expect(getTotalSlots(f)).not.toBe(12)
    }
  })
})
