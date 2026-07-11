# Testes da V10

## Build e integridade

- `npm run check`: aprovado.
- `npm run build`: aprovado.
- Bundle JavaScript validado com `node --check`.
- Busca por marcadores de conflito de merge: nenhum encontrado.

## Jornada funcional em Chromium

Os webhooks foram simulados para validar a interface e os payloads sem enviar dados reais.

1. Estados Unidos → filho já está na escola → nome da escola → idade → calendário.
2. Outro país → visto → menos de 12 meses → calendário.
3. Outro país → visto → mais de 12 meses → idade → calendário.
4. Pensando em morar nos EUA → High School → calendário.
5. Pensando em enviar o filho → College → ano escolar → calendário.

Em todos os caminhos foram confirmados:

- ausência da tela de erro;
- evento `basic_contact` após o e-mail;
- evento final `calendar_final`;
- `destination = google_calendar`;
- `consultora = Calendário Free`;
- `finalStatus = approved`.
