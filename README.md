# Impacto Acadêmico Quiz

Quiz web mobile-first para qualificação de famílias interessadas em educação nos Estados Unidos, adaptado a partir do fluxo antigo do Typebot da Impacto Acadêmico.

## Como rodar localmente

Use um servidor HTTP local, pois o projeto usa ES Modules.

Opção com VS Code:

1. Abra a pasta do projeto.
2. Instale a extensão **Live Server**.
3. Clique com o botão direito no `index.html`.
4. Selecione **Open with Live Server**.

Opção com Python:

```bash
cd impacto-academico-quiz
python -m http.server 5500
```

Depois acesse:

```text
http://localhost:5500
```

## Estrutura de arquivos

```text
/
├── index.html
├── README.md
├── assets/
│   ├── css/
│   │   └── styles.css
│   ├── img/
│   │   └── mascot.png
│   └── js/
│       ├── main.js
│       ├── config.js
│       ├── constants.js
│       ├── state.js
│       ├── services/
│       │   ├── api.js
│       │   ├── results.service.js
│       │   ├── pixel.service.js
│       │   └── partial-save.service.js
│       ├── quiz/
│       │   ├── navigation.js
│       │   ├── answers.js
│       │   ├── validation.js
│       │   └── redirect.js
│       └── utils/
│           ├── utms.js
│           ├── phone.js
│           ├── ids.js
│           └── text.js
```

## Onde trocar pixels, URLs e webhooks futuros

Todas as configurações principais ficam em:

```text
assets/js/config.js
```

Campos importantes:

```js
ENABLE_WEBHOOKS: false,
WEBHOOKS: {
  FINAL_RESULTS_URL: '',
  PARTIAL_RESULTS_URL: ''
}
```

Neste primeiro momento, os webhooks estão desativados. O quiz monta o payload normalmente, mas não faz requisições externas. Para ativar no futuro, altere `ENABLE_WEBHOOKS` para `true` e preencha as URLs.

```js
REDIRECTS: {
  GUIA_DIGITAL_URL: 'https://lp.impactoacademico.com/guia-digital',
  EBOOK_URL: 'https://lp.impactoacademico.com/ebook-l',
  CALENDAR_PRIMARY_URL: '...',
  CALENDAR_SECONDARY_URL: '...'
}
```

```js
META_PIXEL_IDS: []
```

Para ativar Meta Pixel, preencha o array com os IDs:

```js
META_PIXEL_IDS: ['000000000000000']
```

## Ajustes desta versão

- Webhooks removidos/desativados por padrão.
- Primeira tela redesenhada para evitar sobreposição do mascote, texto e CTA.
- Campo de WhatsApp agora permite escolher claramente entre Brasil `+55` e Estados Unidos `+1`.
- Responsividade reforçada para mobile, com foco em telas próximas ao iPhone 14 Plus.

## Campos capturados

### Respostas

- nome
- telefone
- telefone_pais
- telefone_ddi
- email
- processo_imigratorio
- localizacao
- tipo_visto
- tempo_eua
- tempo_visto
- filhos_escola
- nome_escola
- idade_filho
- ano_escolar
- enviar_filho
- consultora

### Tracking

- utm_source
- utm_medium
- utm_campaign
- utm_term
- utm_content
- campaign_id
- adset_id
- ad_id
- creative_id
- creative_name
- device
- matchtype
- adposition
- network
- loc
- loci
- targetid
- placement
- gclid
- wbraid
- gbraid
- fbclid
- fbp
- fbc

Também são enviados:

- sessionId
- resultId
- createdAt
- updatedAt
- origem = Quiz
- full_url
- userAgent
- finalStatus
- eventName

O projeto não captura nem envia IP do usuário.

## Payload gerado pelo quiz

O payload é montado em:

```text
assets/js/services/results.service.js
```

Formato principal:

```js
{
  id,
  resultId,
  sessionId,
  isCompleted,
  createdAt,
  updatedAt,
  typebotId,
  bot,
  origem,
  finalStatus,
  eventName,
  answers,
  tracking,
  metadata,
  variables
}
```

A variável `full_url` continua como último item do array `variables`. O campo `telefone` é normalizado com DDI: Brasil `55...` ou EUA `1...`, conforme a escolha do usuário.

## Lógica principal do quiz

O fluxo inicial preserva a ordem do Typebot antigo:

1. Nome
2. WhatsApp
3. E-mail
4. Situação imigratória ou objetivo da família

Depois, o quiz ramifica conforme as respostas:

- Processo imigratório ou já mora nos EUA: pergunta localização, visto, tempo, escola e idade do filho.
- Pensando em morar nos EUA: direciona para Guia Digital.
- Pensando em enviar o filho para os EUA: pergunta High School/College e etapa escolar.
- Leads com perfil mais próximo da consultoria são direcionados para agendamento.
- Leads em etapa inicial são direcionados para Guia Digital ou E-book.

## Status finais

- `approved`: direciona para calendário/agendamento.
- `guia-digital`: direciona para o Guia Digital.
- `ebook`: direciona para o E-book.
- `refugo`: direciona para conteúdo gratuito sem tom negativo.
- `partial`: usado nos salvamentos parciais.

## O que foi aproveitado do Typebot antigo

- Campos principais do fluxo.
- Lógica de qualificação por processo imigratório, localização, visto, tempo nos EUA, filhos na escola, idade e ano escolar.
- URLs de Guia Digital, E-book e calendários de agendamento.
- Campos e variáveis principais do Typebot antigo, sem enviar dados para webhook neste momento.
- Tom acolhedor e direto para pais e responsáveis.

## O que foi adaptado do quiz de exemplo

- Arquitetura modular com `config`, `constants`, `state`, `services`, `quiz` e `utils`.
- Barra de progresso.
- Telas mobile-first.
- Salvamento parcial.
- Captura de UTMs e parâmetros de tracking.
- Payload estruturado para integração futura.
- Disparo único de evento Lead.

## Observações de implantação

Antes de publicar, revise:

1. Se os webhooks devem continuar desligados ou serem ativados.
2. IDs de Meta Pixel.
3. Link de calendário que deve ser usado como principal.
4. Regras de qualificação em `assets/js/quiz/answers.js`.
5. Cores finais em `assets/css/styles.css`, caso a identidade visual mude.
6. Teste visual em celulares, especialmente iPhone 14 Plus ou aparelhos próximos de 428px de largura.


## Ajuste V5

Esta versão prioriza UX mobile sem rolagem nas telas principais do quiz. Foram adicionadas regras responsivas para altura e largura usando `svh`, compactação progressiva para aparelhos baixos, redução automática de cards com muitas opções e layout específico para telas na faixa do iPhone 14 Plus.


## Ajustes V6
- Hero da primeira tela usando a nova imagem com bordas arredondadas.
- Restante do projeto usando o mascote sem fundo.
- Webhooks reativados para o endpoint do fluxo de free consultation.
- Payload final e parcial enviado em estrutura JSON estilo Typebot, com `resultId`, `answers`, `variables`, `answerMap`, `tracking` e `queryParams`.
- Campo de país de residência alterado para dropdown com múltiplos países.
- Todos os caminhos do funil direcionam para o agendamento da free consultation.
- Última tela com aviso de que não será possível realizar novo agendamento após concluir.

## Correções de robustez desta entrega

- O timer de salvamento parcial é cancelado antes do envio final.
- Nenhum parcial é enviado enquanto o quiz está finalizando ou já foi concluído.
- Cada evento possui `eventId` idempotente e `eventVersion` crescente.
- O evento final reutiliza exatamente o mesmo payload durante tentativas de retry.
- Requests finais usam timeout, retry exponencial com jitter e validação de HTTP 2xx.
- Erros definitivos não são mais tratados como sucesso: o usuário recebe botão para tentar novamente.
- Uma nova sessão é criada automaticamente ao abrir o quiz depois de uma conclusão anterior.
- O webhook recebe `X-Idempotency-Key` com o mesmo valor de `eventId`.

### Contrato esperado pelo n8n corrigido

O workflow deve respeitar `eventId`, `eventVersion`, `resultId`, `updatedAt` e `isCompleted`. Eventos antigos e parciais posteriores ao final são descartados pelo workflow entregue junto com este projeto.
