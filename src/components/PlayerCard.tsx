import type { Player } from '../types'
import styles from './PlayerCard.module.css'

interface Props {
  player: Player
  onSelect?: (player: Player) => void
  selected?: boolean
  compact?: boolean
}

const POSITION_COLORS: Record<string, string> = {
  GOL: '#f59e0b',
  DEF: '#3b82f6',
  MEI: '#10b981',
  ATA: '#ef4444',
}

export function PlayerCard({ player, onSelect, selected = false, compact = false }: Props) {
  return (
    <div
      className={`${styles.card} ${selected ? styles.selected : ''} ${compact ? styles.compact : ''}`}
      onClick={() => onSelect?.(player)}
      role="button"
      tabIndex={0}
      aria-label={`${player.name}, ${player.club}, ${player.position}`}
      onKeyDown={(e) => e.key === 'Enter' && onSelect?.(player)}
    >
      <span
        className={styles.badge}
        style={{ backgroundColor: POSITION_COLORS[player.position] }}
      >
        {player.position}
      </span>
      <div className={styles.info}>
        <span className={styles.name}>{player.name}</span>
        {!compact && <span className={styles.club}>{player.club}</span>}
      </div>
      <span className={styles.number}>#{player.number}</span>
    </div>
  )
}
