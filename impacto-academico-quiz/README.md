# Impacto Acadêmico Quiz — V10 estável para GitHub e Vercel

## Diagnóstico do problema

A linha exibida no topo da página com `HEAD` e um hash é um marcador de conflito de merge do Git. Isso significa que um arquivo conflitante foi publicado sem a resolução do merge. A V10 bloqueia o build se esse tipo de marcador existir no HTML, JavaScript ou CSS.

O projeto também passou a gerar uma pasta `dist` limpa. Assim, a Vercel publica somente os arquivos de produção e não mistura arquivos antigos com novos.

## Rodar localmente

```bash
npm install
npm run build
npm run preview
```

Abra `http://127.0.0.1:4173`.

## Publicar no GitHub

```bash
git init
git add .
git commit -m "fix: estabiliza quiz e deploy na Vercel"
git branch -M main
git remote add origin URL_DO_SEU_REPOSITORIO
git push -u origin main
```

## Configurar na Vercel

1. Importe o repositório do GitHub.
2. Deixe o diretório raiz apontando para a pasta que contém `package.json` e `vercel.json`.
3. Não informe manualmente outra pasta de saída: o `vercel.json` já define `dist`.
4. Faça o deploy.
5. No domínio de produção, faça uma atualização forçada com `Ctrl + F5`.

## Fluxo preservado

O frontend continua enviando:

- `partial` durante a jornada;
- `basic_contact` após nome, WhatsApp e e-mail;
- `calendar_final` antes do direcionamento ao Google Calendar.

No final, permanecem:

```text
processingMode = calendar_final
destination = google_calendar
consultora = Calendário Free
finalStatus = approved
```

## Arquivos importantes

- `assets/js/config.js`: webhook e URLs do Google Calendar.
- `assets/js/main.js`: renderização da interface.
- `assets/js/quiz/answers.js`: regras da jornada.
- `assets/js/services/results.service.js`: payload enviado ao n8n.
- `scripts/check.mjs`: bloqueia conflitos de merge.
- `scripts/build.mjs`: gera a versão publicada em `dist`.
- `vercel.json`: configuração da Vercel.
