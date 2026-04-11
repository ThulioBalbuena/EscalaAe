# ⚽ Champions League 2026 – Monte seu Time
---

## 🌐 Acesse online

https://thuliobalbuena.github.io/EscalaAe/

---

## 🔄 Pipeline CI/CD

O projeto utiliza GitHub Actions com as seguintes etapas:

- Execução de testes automatizados (testes unitários)
- Build de produção
- Armazenamento de artefatos
- Envio de notificação por e-mail ao final do pipeline
- Deploy automático no GitHub Pages

O deploy é realizado apenas após sucesso nos testes e no build.

---

## 📦 Artefatos

O pipeline gera automaticamente:

- Relatório de testes
- Build da aplicação (dist/)

Os artefatos ficam disponíveis na aba "Actions" do GitHub.

---

## 🚀 Como rodar localmente

### Pré-requisitos
- Node.js 20+
- npm 10+

### Instalação

```bash
# 1. Clone o repositório
git clone https://github.com/ThulioBalbuena/EscalaAe.git

# 2. Instale as dependências
npm install

# 3. Inicie o servidor de desenvolvimento
npm run dev
```

Acesse: [http://localhost:5173](http://localhost:5173)

---

## 🧪 Como testar

```bash
# Rodar todos os testes
npm test

# Interface gráfica do Vitest
npm run test:ui
```
---

## 🎮 Funcionalidades

- ✅ Lista de 80 jogadores da Champions League 2026 (mockados)
- ✅ Campo de futebol interativo com slots por posição
- ✅ Formações: 4-3-3, 4-4-2, 3-5-2
- ✅ Validação: posição compatível, sem duplicatas, limite por formação
- ✅ Filtro e busca na lista de jogadores e times
- ✅ Exportar escalação como PNG (apenas quando completa e válida)
- ✅ Limpar escalação
- ✅ Feedback visual (slots compatíveis piscam em verde)

---

## 📋 Regras de negócio

| Regra | Comportamento |
|---|---|
| Posição incompatível | Erro: jogador só vai para slot da sua posição |
| Jogador duplicado | Erro: mesmo jogador não pode estar em dois slots |
| Escalação incompleta | Export bloqueado até 11 jogadores escalados |
| Troca de formação | Limpa toda a escalação atual |
| Slot ocupado | Clicar substitui o jogador existente |
| Remover jogador | Clicar no slot já preenchido remove o jogador |
---

## 🤖 Uso de IA

Ferramentas de IA foram utilizadas como apoio na estruturação do pipeline CI/CD, ajustes no workflow e refinamento das classes. Todas as decisões finais foram revisadas e validadas pelo grupo.