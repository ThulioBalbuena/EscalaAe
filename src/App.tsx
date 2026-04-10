import { useState, useRef } from 'react'
import { toPng } from 'html-to-image'
import type { FormationType, Player } from './types'
import { useLineup } from './hooks/useLineup'
import { FootballField } from './components/FootballField'
import { PlayerList } from './components/PlayerList'
import playersData from './data/players.json'
import styles from './App.module.css'

const players = playersData as Player[]
const FORMATIONS: FormationType[] = ['4-3-3', '4-4-2', '3-5-2']

export default function App() {
  const { formation, slots, lastError, validation, exportable, changeFormation, addPlayer, removePlayer, clear } =
    useLineup('4-3-3')

  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null)
  const [exportLoading, setExportLoading] = useState(false)
  const [notification, setNotification] = useState<{ msg: string; type: 'error' | 'success' | 'info' } | null>(null)
  const fieldRef = useRef<HTMLDivElement>(null)

  const notify = (msg: string, type: 'error' | 'success' | 'info' = 'info') => {
    setNotification({ msg, type })
    setTimeout(() => setNotification(null), 3000)
  }

  const handleSelectPlayer = (player: Player) => {
    setSelectedPlayer((prev) => (prev?.id === player.id ? null : player))
  }

  const handleSlotClick = (slotId: string) => {
    if (!selectedPlayer) {
      notify('Selecione um jogador primeiro.', 'info')
      return
    }
    const error = addPlayer(selectedPlayer, slotId)
    if (error) {
      notify(error, 'error')
    } else {
      setSelectedPlayer(null)
    }
  }

  const handleRemove = (slotId: string) => {
    removePlayer(slotId)
    notify('Jogador removido.', 'info')
  }

  const handleExport = async () => {
    if (!exportable) {
      notify('Complete a escalação antes de exportar.', 'error')
      return
    }
    const el = document.getElementById('football-field')
    if (!el) return
    setExportLoading(true)
    try {
      const dataUrl = await toPng(el, { quality: 0.95, pixelRatio: 2 })
      const link = document.createElement('a')
      link.download = `escalacao-${formation}.png`
      link.href = dataUrl
      link.click()
      notify('Imagem exportada com sucesso!', 'success')
    } catch {
      notify('Erro ao exportar imagem.', 'error')
    } finally {
      setExportLoading(false)
    }
  }

  const handleClear = () => {
    clear()
    setSelectedPlayer(null)
    notify('Escalação limpa.', 'info')
  }

  const filled = slots.filter((s) => s.player).length

  return (
    <div className={styles.app}>
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <span className={styles.logo}>⚽</span>
          <div>
            <h1 className={styles.title}>Champions League 2026!</h1>
            <p className={styles.subtitle}>Monte seu time ideal</p>
          </div>
        </div>

        <div className={styles.controls}>
          {/* Formações */}
          <div className={styles.formationGroup}>
            {FORMATIONS.map((f) => (
              <button
                key={f}
                className={`${styles.formationBtn} ${formation === f ? styles.active : ''}`}
                onClick={() => {
                  changeFormation(f)
                  setSelectedPlayer(null)
                }}
              >
                {f}
              </button>
            ))}
          </div>

          {/* Ações */}
          <button className={`${styles.clearBtn} ${filled === 0 ? styles.disabled : ''}`} onClick={handleClear} disabled={filled === 0}>
            🗑 Limpar
          </button>
          <button
            className={`${styles.exportBtn} ${!exportable ? styles.disabled : ''}`}
            onClick={handleExport}
            disabled={!exportable || exportLoading}
          >
            {exportLoading ? '⏳ Exportando...' : ' Exportar PNG'}
          </button>
        </div>
      </header>

      {/* Notificação */}
      {notification && (
        <div className={`${styles.notification} ${styles[notification.type]}`}>
          {notification.msg}
        </div>
      )}

      {/* Instrução */}
      {selectedPlayer && (
        <div className={styles.instruction}>
          <strong>{selectedPlayer.name}</strong> selecionado — clique em um slot <em>{selectedPlayer.position}</em> no campo
        </div>
      )}

      <main className={styles.main} ref={fieldRef}>
        {/* Lista de jogadores */}
        <PlayerList
          players={players}
          selectedPlayer={selectedPlayer}
          slots={slots}
          onSelect={handleSelectPlayer}
        />

        {/* Campo */}
        <div className={styles.fieldWrapper}>
          <FootballField
            slots={slots}
            selectedPlayer={selectedPlayer}
            onSlotClick={handleSlotClick}
            onRemove={handleRemove}
          />
          <div className={styles.progress}>
            <span>{filled}/11 jogadores escalados</span>
            {!validation.valid && filled === 11 && (
              <ul className={styles.errors}>
                {validation.errors.map((e, i) => (
                  <li key={i}>{e}</li>
                ))}
              </ul>
            )}
            {validation.valid && (
              <span className={styles.valid}>✅ Escalação válida!</span>
            )}
          </div>
        </div>

        {/* Info lateral */}
        <div className={styles.sidebar}>
          <div className={styles.infoCard}>
            <h4>Formação: {formation}</h4>
            {lastError && <p className={styles.errorText}>{lastError}</p>}
            <p className={styles.hint}>
              Clique em um jogador, depois clique no slot correspondente no campo.
              <br /><br />
              Clique num jogador já escalado para <strong>removê-lo</strong>.
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
