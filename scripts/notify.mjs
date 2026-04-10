#!/usr/bin/env node
import nodemailer from 'nodemailer'

// ── Variáveis de ambiente ─────────────────────────────────────────────
const {
  NOTIFY_EMAIL_TO,
  NOTIFY_EMAIL_FROM,
  GMAIL_APP_PASSWORD,
  CI_STATUS = 'unknown',
  CI_RUN_URL = 'https://github.com',
  CI_BRANCH = 'main',
  CI_COMMIT = 'N/A',
  CI_PROJECT = 'notify-test',
} = process.env

// ── Validação ─────────────────────────────────────────────────────────
if (!NOTIFY_EMAIL_TO || !NOTIFY_EMAIL_FROM || !GMAIL_APP_PASSWORD) {
  console.error(
    '❌ Variáveis ausentes: NOTIFY_EMAIL_TO, NOTIFY_EMAIL_FROM, GMAIL_APP_PASSWORD'
  )
  process.exit(1)
}

// ── Config SMTP Gmail ─────────────────────────────────────────────────
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: NOTIFY_EMAIL_FROM,
    pass: GMAIL_APP_PASSWORD,
  },
})

// ── Status ────────────────────────────────────────────────────────────
const isSuccess = CI_STATUS === 'success'
const isFailure = CI_STATUS === 'failure'

const statusEmoji = isSuccess ? '✅' : isFailure ? '❌' : '⚠️'
const statusLabel = isSuccess ? 'SUCESSO' : isFailure ? 'FALHA' : 'DESCONHECIDO'
const borderColor = isSuccess ? '#22c55e' : isFailure ? '#ef4444' : '#f59e0b'

const shortCommit =
  CI_COMMIT && CI_COMMIT !== 'N/A' ? CI_COMMIT.slice(0, 7) : 'N/A'

// ── HTML do e-mail ────────────────────────────────────────────────────
const htmlBody = `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8" />
</head>
<body style="margin:0; padding:24px; font-family:'Segoe UI', Arial, sans-serif; background:#0f172a; color:#f1f5f9;">
  <div style="max-width:560px; margin:0 auto; background:#1e293b; border-radius:10px; border-left:5px solid ${borderColor}; padding:24px;">

    <h2 style="margin:0 0 12px; color:${borderColor};">
      ${statusEmoji} Pipeline CI/CD – ${statusLabel}
    </h2>

    <p style="margin:0 0 16px; color:#94a3b8;">
      O pipeline do projeto <strong style="color:#38bdf8;">${CI_PROJECT}</strong> finalizou.
    </p>

    <table style="width:100%; border-collapse:collapse; font-size:14px;">
      <tr>
        <td style="padding:6px 0; color:#64748b;">Projeto</td>
        <td style="padding:6px 0;"><code>${CI_PROJECT}</code></td>
      </tr>
      <tr>
        <td style="padding:6px 0; color:#64748b;">Branch</td>
        <td style="padding:6px 0;"><code>${CI_BRANCH}</code></td>
      </tr>
      <tr>
        <td style="padding:6px 0; color:#64748b;">Commit</td>
        <td style="padding:6px 0;"><code>${shortCommit}</code></td>
      </tr>
      <tr>
        <td style="padding:6px 0; color:#64748b;">Status</td>
        <td style="padding:6px 0; color:${borderColor}; font-weight:bold;">${statusLabel}</td>
      </tr>
    </table>

    <div style="margin-top:20px;">
      <a href="${CI_RUN_URL}"
         style="display:inline-block; background:#38bdf8; color:#0f172a;
                padding:8px 16px; border-radius:6px; text-decoration:none;
                font-weight:700; font-size:13px;">
        Ver execução no GitHub →
      </a>
    </div>

    <p style="margin-top:20px; font-size:11px; color:#475569;">
      Notificação automática do pipeline
    </p>
  </div>
</body>
</html>
`

// ── Envio ─────────────────────────────────────────────────────────────
try {
  const info = await transporter.sendMail({
    from: `"CI/CD Bot 🤖" <${NOTIFY_EMAIL_FROM}>`,
    to: NOTIFY_EMAIL_TO,
    subject: `${statusEmoji} [${CI_PROJECT}] Pipeline ${statusLabel} – ${CI_BRANCH}`,
    html: htmlBody,
  })

  console.log(`✅ Email enviado! ID: ${info.messageId}`)
} catch (err) {
  console.error('❌ Erro ao enviar email:', err)
  process.exit(1)
}