import { useState, useCallback } from 'react'
import type { FieldSlot, FormationType, Player } from '../types'
import { FORMATIONS } from '../services/formations'
import {
  addPlayerToSlot,
  removePlayerFromSlot,
  clearLineup,
  validateLineup,
  canExport,
} from '../services/lineup'

/**
 * Inicializa os slots a partir de uma formação.
 */
function initSlots(formation: FormationType): FieldSlot[] {
  return FORMATIONS[formation].slots.map((s, i) => ({
    slotId: `slot-${i}`,
    position: s.position,
    row: s.row,
    col: s.col,
    player: null,
  }))
}

export function useLineup(initialFormation: FormationType = '4-3-3') {
  const [formation, setFormationState] = useState<FormationType>(initialFormation)
  const [slots, setSlots] = useState<FieldSlot[]>(() => initSlots(initialFormation))
  const [lastError, setLastError] = useState<string | null>(null)

  const changeFormation = useCallback((f: FormationType) => {
    setFormationState(f)
    setSlots(initSlots(f))
    setLastError(null)
  }, [])

  const addPlayer = useCallback(
    (player: Player, slotId: string) => {
      const result = addPlayerToSlot(player, slotId, slots, formation)
      if (result.error) {
        setLastError(result.error)
      } else {
        setSlots(result.slots)
        setLastError(null)
      }
      return result.error
    },
    [slots, formation]
  )

  const removePlayer = useCallback(
    (slotId: string) => {
      setSlots((prev) => removePlayerFromSlot(slotId, prev))
      setLastError(null)
    },
    []
  )

  const clear = useCallback(() => {
    setSlots((prev) => clearLineup(prev))
    setLastError(null)
  }, [])

  const validation = validateLineup(slots, formation)
  const exportable = canExport(slots, formation)

  return {
    formation,
    slots,
    lastError,
    validation,
    exportable,
    changeFormation,
    addPlayer,
    removePlayer,
    clear,
  }
}
