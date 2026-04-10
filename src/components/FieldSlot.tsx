import type { FieldSlot as FieldSlotType, Player } from '../types'
import styles from './FieldSlot.module.css'

interface Props {
  slot: FieldSlotType
  selectedPlayer: Player | null
  onSlotClick: (slotId: string) => void
  onRemove: (slotId: string) => void
}

const POSITION_COLORS: Record<string, string> = {
  GOL: '#f59e0b',
  DEF: '#3b82f6',
  MEI: '#10b981',
  ATA: '#ef4444',
}

export function FieldSlotComponent({ slot, selectedPlayer, onSlotClick, onRemove }: Props) {
  const isCompatible =
    selectedPlayer !== null && selectedPlayer.position === slot.position

  const handleClick = () => {
    if (slot.player) {
      onRemove(slot.slotId)
    } else {
      onSlotClick(slot.slotId)
    }
  }

  return (
    <div
      className={`${styles.slot} ${slot.player ? styles.filled : ''} ${
        isCompatible && !slot.player ? styles.compatible : ''
      }`}
      onClick={handleClick}
      role="button"
      tabIndex={0}
      aria-label={
        slot.player
          ? `Remover ${slot.player.name}`
          : `Slot vazio – ${slot.position}`
      }
      onKeyDown={(e) => e.key === 'Enter' && handleClick()}
    >
      {slot.player ? (
        <div className={styles.playerInner}>
          <span
            className={styles.dot}
            style={{ backgroundColor: POSITION_COLORS[slot.player.position] }}
          />
          <span className={styles.playerName}>{slot.player.name.split(' ')[0]}</span>
          <span className={styles.playerClub}>{slot.player.club}</span>
        </div>
      ) : (
        <div className={styles.empty}>
          <span
            className={styles.posLabel}
            style={{ color: POSITION_COLORS[slot.position] }}
          >
            {slot.position}
          </span>
        </div>
      )}
    </div>
  )
}
