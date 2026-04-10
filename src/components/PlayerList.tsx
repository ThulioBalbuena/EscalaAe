import { useState } from 'react'
import type { FieldSlot, Player, Position } from '../types'
import { PlayerCard } from './PlayerCard'
import styles from './PlayerList.module.css'

interface Props {
  players: Player[]
  selectedPlayer: Player | null
  slots: FieldSlot[]
  onSelect: (player: Player) => void
}

const POSITIONS: Array<Position | 'TODOS'> = ['TODOS', 'GOL', 'DEF', 'MEI', 'ATA']

export function PlayerList({ players, selectedPlayer, slots, onSelect }: Props) {
  const [filter, setFilter] = useState<Position | 'TODOS'>('TODOS')
  const [search, setSearch] = useState('')

  const usedIds = new Set(slots.filter((s) => s.player).map((s) => s.player!.id))

  const filtered = players.filter((p) => {
    const matchPos = filter === 'TODOS' || p.position === filter
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase())
    return matchPos && matchSearch
  })

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>Jogadores</h3>

      <input
        className={styles.search}
        type="text"
        placeholder="Buscar jogador..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        aria-label="Buscar jogador"
      />

      <div className={styles.filters}>
        {POSITIONS.map((pos) => (
          <button
            key={pos}
            className={`${styles.filterBtn} ${filter === pos ? styles.active : ''}`}
            onClick={() => setFilter(pos)}
          >
            {pos}
          </button>
        ))}
      </div>

      <div className={styles.list}>
        {filtered.length === 0 && (
          <p className={styles.empty}>Nenhum jogador encontrado.</p>
        )}
        {filtered.map((player) => (
          <div key={player.id} className={usedIds.has(player.id) ? styles.used : ''}>
            <PlayerCard
              player={player}
              onSelect={onSelect}
              selected={selectedPlayer?.id === player.id}
            />
            {usedIds.has(player.id) && (
              <span className={styles.usedBadge}>Escalado</span>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
