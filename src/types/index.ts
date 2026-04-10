// Posições disponíveis no futebol
export type Position = 'GOL' | 'DEF' | 'MEI' | 'ATA'

// Formações suportadas
export type FormationType = '4-3-3' | '4-4-2' | '3-5-2'

// Dados de um jogador
export interface Player {
  id: string
  name: string
  club: string
  position: Position
  number: number
}

// Slot do campo (posição física no campinho)
export interface FieldSlot {
  slotId: string
  position: Position
  row: number
  col: number
  player: Player | null
}

// Configuração de uma formação
export interface FormationConfig {
  label: FormationType
  slots: Array<{
    position: Position
    row: number
    col: number
  }>
}

// Estado da escalação
export interface LineupState {
  formation: FormationType
  slots: FieldSlot[]
}

// Resultado de validação
export interface ValidationResult {
  valid: boolean
  errors: string[]
}
