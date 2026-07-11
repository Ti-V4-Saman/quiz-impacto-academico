import { state } from '../state.js';
import { QUIZ_STEPS } from '../constants.js';
import { schedulePartialSave } from '../services/partial-save.service.js';
<<<<<<< HEAD
import { sendBasicContactResults } from '../services/results.service.js';
=======
>>>>>>> 633d536e8834b1d696353ab96dd64c55b8acfe2e
import { getPhoneCountryConfig, maskPhone } from '../utils/phone.js';
import { validateField } from './validation.js';
import { finishQuiz, goTo } from './navigation.js';

export function saveChoice(field, value) {
  state.answers[field] = value;
  schedulePartialSave(`answer_${field}`);

  const next = getNextStep(field, value);
  if (next.finalStatus) {
    finishQuiz(next.finalStatus);
    return;
  }

  goTo(next.stepId);
}

export function saveInput(field, value) {
  const country = state.answers.telefone_pais || 'BR';
  const normalized = field === 'telefone' ? maskPhone(value, country) : String(value || '').trim();

  if (field === 'telefone') {
    const phoneConfig = getPhoneCountryConfig(country);
    state.answers.telefone_pais = phoneConfig.code;
    state.answers.telefone_ddi = phoneConfig.ddi;
  }

  state.answers[field] = normalized;
  schedulePartialSave(`input_${field}`);
}

export function submitInput(field, value) {
  const error = validateField(field, value);
  if (error) return { ok: false, error };

  saveInput(field, value);
<<<<<<< HEAD

  if (field === 'email') {
    void sendBasicContactResults().catch(() => {});
  }

=======
>>>>>>> 633d536e8834b1d696353ab96dd64c55b8acfe2e
  const next = getNextStep(field, state.answers[field]);

  if (next.finalStatus) finishQuiz(next.finalStatus);
  else goTo(next.stepId);

  return { ok: true, error: '' };
}

export function getNextStep(field, value = '') {
  if (field === 'nome') return { stepId: QUIZ_STEPS.telefone.id };
  if (field === 'telefone') return { stepId: QUIZ_STEPS.email.id };
  if (field === 'email') return { stepId: QUIZ_STEPS.processo_imigratorio.id };

  if (field === 'processo_imigratorio') {
    if (value === 'Sim') return { stepId: QUIZ_STEPS.localizacao.id };
<<<<<<< HEAD
=======
    if (value === 'Pensando em morar nos EUA') return { finalStatus: 'guia-digital' };
>>>>>>> 633d536e8834b1d696353ab96dd64c55b8acfe2e
    return { stepId: QUIZ_STEPS.enviar_filho.id };
  }

  if (field === 'localizacao') {
    if (value === 'Estados Unidos') return { stepId: QUIZ_STEPS.tempo_eua.id };
    return { stepId: QUIZ_STEPS.tipo_visto.id };
  }

  if (field === 'tipo_visto') return { stepId: QUIZ_STEPS.tempo_visto.id };
<<<<<<< HEAD

  if (field === 'tempo_visto') {
    if (value === 'Menos de 12 meses') return { finalStatus: 'approved' };
    return { stepId: QUIZ_STEPS.idade_filho.id };
  }

=======
  if (field === 'tempo_visto') return { stepId: QUIZ_STEPS.idade_filho.id };
>>>>>>> 633d536e8834b1d696353ab96dd64c55b8acfe2e
  if (field === 'tempo_eua') return { stepId: QUIZ_STEPS.filhos_escola.id };

  if (field === 'filhos_escola') {
    if (value === 'Sim') return { stepId: QUIZ_STEPS.nome_escola.id };
    return { stepId: QUIZ_STEPS.idade_filho.id };
  }

  if (field === 'nome_escola') return { stepId: QUIZ_STEPS.idade_filho.id };
<<<<<<< HEAD
  if (field === 'idade_filho') return { finalStatus: 'approved' };

  if (field === 'enviar_filho') {
    if (value === 'High School') return { finalStatus: 'approved' };
    return { stepId: QUIZ_STEPS.ano_escolar.id };
  }

  if (field === 'ano_escolar') return { finalStatus: 'approved' };
=======

  if (field === 'idade_filho') {
    if (value === '0 a 10 anos') return { finalStatus: 'guia-digital' };
    return { finalStatus: 'approved' };
  }

  if (field === 'enviar_filho') return { stepId: QUIZ_STEPS.ano_escolar.id };

  if (field === 'ano_escolar') {
    if (value === 'Sim') return { finalStatus: 'approved' };
    return { finalStatus: 'ebook' };
  }
>>>>>>> 633d536e8834b1d696353ab96dd64c55b8acfe2e

  return { stepId: QUIZ_STEPS.processo_imigratorio.id };
}
