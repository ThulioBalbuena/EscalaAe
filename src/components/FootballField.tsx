import type { FieldSlot, Player } from '../types'
import { FieldSlotComponent } from './FieldSlot'
import styles from './FootballField.module.css'

interface Props {
  slots: FieldSlot[]
  selectedPlayer: Player | null
  onSlotClick: (slotId: string) => void
  onRemove: (slotId: string) => void
}

/**
 * Agrupa slots por linha (row) e os organiza para exibição no campo.
 */
function groupByRow(slots: FieldSlot[]): Map<number, FieldSlot[]> {
  const map = new Map<number, FieldSlot[]>()
  for (const slot of slots) {
    if (!map.has(slot.row)) map.set(slot.row, [])
    map.get(slot.row)!.push(slot)
  }
  return map
}

export function FootballField({ slots, selectedPlayer, onSlotClick, onRemove }: Props) {
  const rowMap = groupByRow(slots)
  // Ordenar linhas do 0 (GOL) ao último (ATA) e inverter para mostrar GOL em baixo
  const rows = Array.from(rowMap.keys()).sort((a, b) => b - a)

  return (
    <div id="football-field" className={styles.field}>
      {/* Marcações do campo */}
      <div className={styles.centerCircle} />
      <div className={styles.centerLine} />
      <div className={styles.penaltyAreaTop} />
      <div className={styles.penaltyAreaBottom} />

      {/* Linhas de jogadores */}
      <div className={styles.rows}>
        {rows.map((row) => (
          <div key={row} className={styles.row}>
            {rowMap.get(row)!.map((slot) => (
              <FieldSlotComponent
                key={slot.slotId}
                slot={slot}
                selectedPlayer={selectedPlayer}
                onSlotClick={onSlotClick}
                onRemove={onRemove}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
