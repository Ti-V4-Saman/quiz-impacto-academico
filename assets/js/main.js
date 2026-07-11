import { COUNTRY_OPTIONS, FINAL_SCREENS, QUIZ_STEPS } from './constants.js';
import { state } from './state.js';
import { hydrateTrackingFromUrl } from './utils/utms.js';
import { escapeHtml, firstName } from './utils/text.js';
import { getPhoneCountryConfig, PHONE_COUNTRIES, maskPhone } from './utils/phone.js';
import { initMetaPixels, trackPageView } from './services/pixel.service.js';
import { schedulePartialSave } from './services/partial-save.service.js';
import { saveChoice, saveInput, submitInput } from './quiz/answers.js';
import { validateField } from './quiz/validation.js';
<<<<<<< HEAD
import { goBack, openFinalRedirect, retryFinalSubmission, startQuiz } from './quiz/navigation.js';
=======
<<<<<<< HEAD
import { goBack, openFinalRedirect, retryFinalSubmission, startQuiz } from './quiz/navigation.js';
=======
import { goBack, openFinalRedirect, startQuiz } from './quiz/navigation.js';
>>>>>>> d3d3880abb39b317b80fc1521e707c08c5c29494
>>>>>>> 633d536e8834b1d696353ab96dd64c55b8acfe2e

const root = document.getElementById('screen-root');
const header = document.getElementById('quiz-header');
const backButton = document.getElementById('back-button');
const progressBar = document.getElementById('progress-bar');
const progressLabel = document.getElementById('progress-label');

const TOTAL_PROGRESS = 10;

document.addEventListener('DOMContentLoaded', () => {
  hydrateTrackingFromUrl();
  initMetaPixels();
  trackPageView();
  schedulePartialSave('page_started', { immediate: true });
  bindChromeEvents();
  renderStep('hero');
});

function bindChromeEvents() {
  backButton.addEventListener('click', goBack);
}

export function renderStep(stepId) {
  const step = QUIZ_STEPS[stepId] || QUIZ_STEPS.hero;
  updateChrome(step);

  if (step.type === 'hero') {
    root.innerHTML = heroTemplate();
    document.getElementById('start-button').addEventListener('click', startQuiz);
    return;
  }

  if (step.type === 'choice') {
    root.innerHTML = choiceTemplate(step);
    root.querySelectorAll('[data-choice]').forEach((button) => {
      button.addEventListener('click', () => {
        button.classList.add('is-selected');
        saveChoice(step.field, button.dataset.value);
      });
    });
    return;
  }

  if (step.type === 'select') {
    root.innerHTML = selectTemplate(step);
    bindSelectStep(step);
    return;
  }

  if (step.type === 'input') {
    root.innerHTML = inputTemplate(step);
    bindInputStep(step);
  }
}

export function renderFinal(finalStatus, options = {}) {
  header.hidden = true;
  const screen = FINAL_SCREENS[finalStatus] || FINAL_SCREENS.refugo;
<<<<<<< HEAD
=======
<<<<<<< HEAD
>>>>>>> 633d536e8834b1d696353ab96dd64c55b8acfe2e
  root.innerHTML = finalTemplate(screen, options);

  const button = document.getElementById('final-button');
  if (button) button.addEventListener('click', openFinalRedirect);

  const retryButton = document.getElementById('retry-submit-button');
  if (retryButton) retryButton.addEventListener('click', retryFinalSubmission);
<<<<<<< HEAD
=======
=======
  root.innerHTML = finalTemplate(screen, options.loading);

  const button = document.getElementById('final-button');
  if (button) button.addEventListener('click', openFinalRedirect);
>>>>>>> d3d3880abb39b317b80fc1521e707c08c5c29494
>>>>>>> 633d536e8834b1d696353ab96dd64c55b8acfe2e
}

function bindSelectStep(step) {
  const select = document.getElementById(`field-${step.field}`);
  const form = document.getElementById('step-form');
  const error = document.getElementById('field-error');
  const otherWrap = document.getElementById('field-localizacao-outro-wrap');
  const otherInput = document.getElementById('field-localizacao-outro');
  const otherError = document.getElementById('field-localizacao-outro-error');

  if (select && step.field === 'localizacao') {
    toggleOtherField(otherWrap, otherInput, select.value === 'Outro');

    select.addEventListener('change', () => {
      saveInput(step.field, select.value);
      error.textContent = '';
      if (otherError) otherError.textContent = '';
      toggleOtherField(otherWrap, otherInput, select.value === 'Outro');
    });

    if (otherInput) {
      otherInput.addEventListener('input', () => {
        saveInput('localizacao_outro', otherInput.value);
        if (otherError) otherError.textContent = '';
      });
    }
  } else if (select) {
    select.addEventListener('change', () => {
      saveInput(step.field, select.value);
      error.textContent = '';
    });
  }

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    if (step.field === 'localizacao' && select.value === 'Outro') {
      const customError = validateField('localizacao_outro', otherInput?.value || '');
      if (customError) {
        if (otherError) otherError.textContent = customError;
        otherInput?.focus({ preventScroll: true });
        return;
      }
      saveInput('localizacao_outro', otherInput?.value || '');
    }

    const result = submitInput(step.field, select.value);
    error.textContent = result.error || '';
  });
}

function bindInputStep(step) {
  const input = document.getElementById(`field-${step.field}`);
  const form = document.getElementById('step-form');
  const error = document.getElementById('field-error');

  if (!input || !form) return;

  if (step.field === 'telefone') {
    bindPhoneCountrySelector(input, error);
  }

  input.focus({ preventScroll: true });

  input.addEventListener('input', () => {
    if (step.field === 'telefone') {
      const country = state.answers.telefone_pais || 'BR';
      input.value = maskPhone(input.value, country);
    }
    saveInput(step.field, input.value);
    error.textContent = '';
  });

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    if (step.field === 'telefone' && !validatePhoneExtraField()) {
      return;
    }

    const result = submitInput(step.field, input.value);
    error.textContent = result.error || '';
  });
}

function validatePhoneExtraField() {
  const country = state.answers.telefone_pais || 'BR';
  if (country !== 'OTHER') return true;

  const customInput = document.getElementById('field-telefone-pais-outro');
  const customErrorNode = document.getElementById('field-telefone-pais-outro-error');
  const customError = validateField('telefone_pais_outro', customInput?.value || '');

  if (customError) {
    if (customErrorNode) customErrorNode.textContent = customError;
    customInput?.focus({ preventScroll: true });
    return false;
  }

  saveInput('telefone_pais_outro', customInput?.value || '');
  return true;
}

function updateChrome(step) {
  const isHero = step.id === 'hero';
  header.hidden = isHero;

  if (isHero) return;

  const progress = Math.max(1, step.progress || 1);
  progressBar.style.width = `${Math.min(100, Math.round((progress / TOTAL_PROGRESS) * 100))}%`;
  progressLabel.textContent = `${progress} de ${TOTAL_PROGRESS}`;
  backButton.disabled = state.history.length <= 1;
}

function heroTemplate() {
  return `
    <div class="hero hero-home">
      <div class="brand-row brand-row-home">
        <div class="brand-mark"><span class="brand-dot"></span> Impacto Acadêmico</div>
      </div>

      <section class="hero-card hero-card-home">
        <div class="hero-card-bg" aria-hidden="true"></div>

        <div class="hero-copy-top hero-content-home">
          <span class="hero-eyebrow">Para pais e responsáveis</span>
          <h1>Descubra o melhor caminho acadêmico para seu filho <strong>estudar nos EUA</strong></h1>
        </div>

        <div class="hero-visual-wrap hero-visual-wrap-home" aria-hidden="true">
          <div class="hero-image-frame">
            <img class="hero-cover-image" src="assets/img/hero-cover.webp" alt="Mascote da Impacto Acadêmico" />
          </div>
        </div>

        <div class="hero-copy-bottom hero-content-home">
          <p class="hero-sub">Responda algumas perguntas rápidas e veja qual orientação faz mais sentido para a sua família.</p>
        </div>
      </section>

      <div class="cta-area cta-area-home">
        <button class="cta-primary" id="start-button" type="button">Começar análise gratuita →</button>
        <p class="cta-note">Seus dados serão usados apenas para atendimento e envio de materiais da Impacto Acadêmico.</p>
      </div>
    </div>
  `;
}

function stepIntro(step) {
  const name = firstName(state.answers.nome);
  const greeting = name && !['nome', 'telefone', 'email'].includes(step.id)
    ? `<span class="step-kicker">${escapeHtml(name)}, estamos quase lá</span>`
    : `<span class="step-kicker">Análise gratuita</span>`;
  const support = step.support ? `
    <div class="support-card">
      <img src="assets/img/mascot-clean.png" alt="Mascote Impacto Acadêmico" />
      <p>${escapeHtml(step.support)}</p>
    </div>
  ` : '';

  return `
    <div class="step-main">
      ${support}
      <div>
        ${greeting}
        <h2 class="step-title">${escapeHtml(step.title)}</h2>
        ${step.subtitle ? `<p class="step-subtitle">${escapeHtml(step.subtitle)}</p>` : ''}
      </div>
    </div>
  `;
}

function choiceTemplate(step) {
  const options = step.options.map((option) => `
    <button class="option-card" type="button" data-choice data-value="${escapeHtml(option.value)}">
      <span class="option-icon">${escapeHtml(option.icon || '•')}</span>
      <span class="option-text">
        <strong>${escapeHtml(option.label)}</strong>
        <span>${escapeHtml(option.description || '')}</span>
      </span>
      <span class="option-arrow">→</span>
    </button>
  `).join('');

  return `
    <div class="step step-${escapeHtml(step.id)} step-choice">
      ${stepIntro(step)}
      <div class="options options-count-${step.options.length}">${options}</div>
    </div>
  `;
}

function inputTemplate(step) {
  const value = state.answers[step.field] || '';
  const isPhone = step.field === 'telefone';
  const phoneCountry = state.answers.telefone_pais || 'BR';
  const phoneConfig = getPhoneCountryConfig(phoneCountry);
  const isOtherPhone = isPhone && phoneCountry === 'OTHER';
  const placeholder = isPhone ? phoneConfig.placeholder : step.placeholder;
  const autocomplete = isPhone ? phoneConfig.autocomplete : (step.autocomplete || 'off');
  const phoneOtherValue = state.answers.telefone_pais_outro || '';

  return `
    <form class="step step-${escapeHtml(step.id)} step-input" id="step-form" novalidate>
      ${stepIntro(step)}
      <div class="form-stack">
        ${isPhone ? phoneCountrySelectorTemplate(phoneCountry) : ''}
        ${isPhone ? `
          <div class="field conditional-field ${isOtherPhone ? '' : 'is-hidden'}" id="field-telefone-pais-outro-wrap">
            <label for="field-telefone-pais-outro">De qual país é esse WhatsApp?</label>
            <input
              id="field-telefone-pais-outro"
              type="text"
              value="${escapeHtml(phoneOtherValue)}"
              placeholder="Ex.: Bélgica, Japão, África do Sul..."
              autocomplete="country-name"
            />
            <small class="phone-help">Como você escolheu Outro, informe também o DDI do país no número abaixo.</small>
            <span class="field-error" id="field-telefone-pais-outro-error"></span>
          </div>
        ` : ''}
        <div class="field ${isPhone ? `phone-field ${isOtherPhone ? 'phone-field-no-prefix' : ''}` : ''}">
          <label for="field-${step.field}">${isPhone ? (isOtherPhone ? 'Digite o WhatsApp com o DDI do país' : 'Digite o número do WhatsApp') : escapeHtml(step.placeholder)}</label>
          ${isPhone && !isOtherPhone ? `<span class="phone-prefix" id="phone-prefix">${escapeHtml(phoneConfig.ddi)}</span>` : ''}
          <input
            id="field-${step.field}"
            type="${escapeHtml(step.inputType || 'text')}"
            value="${escapeHtml(value)}"
            placeholder="${escapeHtml(placeholder)}"
            autocomplete="${escapeHtml(autocomplete)}"
            inputmode="${isPhone ? 'tel' : 'text'}"
          />
          ${isPhone ? `<small class="phone-help" id="phone-help">${escapeHtml(phoneConfig.help)}</small>` : ''}
          <span class="field-error" id="field-error"></span>
        </div>
        <button class="cta-primary" type="submit">${escapeHtml(step.buttonLabel || 'Continuar')} →</button>
      </div>
    </form>
  `;
}

function selectTemplate(step) {
  const value = state.answers[step.field] || '';
  const otherValue = state.answers.localizacao_outro || '';
  const showOther = step.field === 'localizacao' && value === 'Outro';
  const options = COUNTRY_OPTIONS.map((option) => `
    <option value="${escapeHtml(option.value)}" ${option.value === value ? 'selected' : ''}>${escapeHtml(`${option.flag} ${option.label}`)}</option>
  `).join('');

  return `
    <form class="step step-${escapeHtml(step.id)} step-input" id="step-form" novalidate>
      ${stepIntro(step)}
      <div class="form-stack">
        <div class="field select-field">
          <label for="field-${step.field}">${escapeHtml(step.placeholder || 'Selecione uma opção')}</label>
          <div class="select-wrap select-wrap-country">
            <select id="field-${step.field}" autocomplete="country-name">
              <option value="">🌍 Selecione o país</option>
              ${options}
            </select>
          </div>
          <span class="field-error" id="field-error"></span>
        </div>
        ${step.field === 'localizacao' ? `
          <div class="field conditional-field ${showOther ? '' : 'is-hidden'}" id="field-localizacao-outro-wrap">
            <label for="field-localizacao-outro">De qual país vocês são?</label>
            <input
              id="field-localizacao-outro"
              type="text"
              value="${escapeHtml(otherValue)}"
              placeholder="Escreva o país"
              autocomplete="country-name"
            />
            <span class="field-error" id="field-localizacao-outro-error"></span>
          </div>
        ` : ''}
        <button class="cta-primary" type="submit">${escapeHtml(step.buttonLabel || 'Continuar')} →</button>
      </div>
    </form>
  `;
}

function phoneCountrySelectorTemplate(selectedCountry) {
  return `
    <div class="field phone-country-field">
      <label for="phone-country-select">O número é de qual país?</label>
      <div class="select-wrap select-wrap-country">
        <select id="phone-country-select" autocomplete="country-name">
          ${Object.values(PHONE_COUNTRIES).map((country) => `
            <option value="${escapeHtml(country.code)}" ${country.code === selectedCountry ? 'selected' : ''}>${escapeHtml(`${country.flag} ${country.label}${country.ddi ? ` ${country.ddi}` : ''}`)}</option>
          `).join('')}
        </select>
      </div>
    </div>
  `;
}

function bindPhoneCountrySelector(input, error) {
  const select = document.getElementById('phone-country-select');
  const prefix = document.getElementById('phone-prefix');
  const help = document.getElementById('phone-help');
  const phoneField = root.querySelector('.phone-field');
  const label = root.querySelector('.phone-field label');
  const otherWrap = document.getElementById('field-telefone-pais-outro-wrap');
  const otherInput = document.getElementById('field-telefone-pais-outro');
  const otherError = document.getElementById('field-telefone-pais-outro-error');
  if (!select) return;

  if (otherInput) {
    otherInput.addEventListener('input', () => {
      saveInput('telefone_pais_outro', otherInput.value);
      if (otherError) otherError.textContent = '';
    });
  }

  toggleOtherField(otherWrap, otherInput, select.value === 'OTHER');

  select.addEventListener('change', () => {
    const country = select.value || 'BR';
    const config = getPhoneCountryConfig(country);
    const isOther = country === 'OTHER';

    state.answers.telefone_pais = config.code;
    state.answers.telefone_ddi = config.ddi;
    input.value = maskPhone(input.value, config.code);
    input.placeholder = config.placeholder;
    input.autocomplete = config.autocomplete;
    state.answers.telefone = input.value;

    if (prefix) {
      prefix.textContent = config.ddi;
      prefix.classList.toggle('is-hidden', isOther || !config.ddi);
    }
    if (phoneField) phoneField.classList.toggle('phone-field-no-prefix', isOther || !config.ddi);
    if (help) help.textContent = config.help;
    if (label) label.textContent = isOther ? 'Digite o WhatsApp com o DDI do país' : 'Digite o número do WhatsApp';
    if (error) error.textContent = '';
    if (otherError) otherError.textContent = '';

    toggleOtherField(otherWrap, otherInput, isOther);
    input.focus({ preventScroll: true });
  });
}

function toggleOtherField(wrapper, input, show) {
  if (!wrapper) return;
  wrapper.classList.toggle('is-hidden', !show);
  if (show && input) {
    input.focus({ preventScroll: true });
  }
}

<<<<<<< HEAD
=======
<<<<<<< HEAD
>>>>>>> 633d536e8834b1d696353ab96dd64c55b8acfe2e
function finalTemplate(screen, options = {}) {
  const loading = Boolean(options.loading);
  const hasError = Boolean(options.error);
  const action = loading
    ? '<div class="loading-dot" aria-label="Processando respostas"></div>'
    : hasError
      ? '<button class="final-button" id="retry-submit-button" type="button">Tentar enviar novamente →</button>'
      : `<button class="final-button" id="final-button" type="button">${escapeHtml(screen.buttonLabel)} →</button>`;

<<<<<<< HEAD
=======
=======
function finalTemplate(screen, loading = false) {
>>>>>>> d3d3880abb39b317b80fc1521e707c08c5c29494
>>>>>>> 633d536e8834b1d696353ab96dd64c55b8acfe2e
  return `
    <section class="final-screen">
      <div class="final-badge">${escapeHtml(screen.icon)}</div>
      <h2>${escapeHtml(screen.title)}</h2>
      <p>${escapeHtml(screen.text)}</p>
      ${screen.note ? `<div class="final-note-box">${escapeHtml(screen.note)}</div>` : ''}
      ${screen.warning ? `<div class="final-warning">${escapeHtml(screen.warning)}</div>` : ''}
<<<<<<< HEAD
=======
<<<<<<< HEAD
>>>>>>> 633d536e8834b1d696353ab96dd64c55b8acfe2e
      ${hasError ? `<div class="final-warning">Não conseguimos registrar suas respostas agora. ${escapeHtml(options.errorMessage || '')}</div>` : ''}
      <div class="final-actions">
        ${action}
        <p class="cta-note">${hasError ? 'Mantenha esta página aberta e tente novamente.' : 'Suas respostas foram registradas nesta sessão.'}</p>
<<<<<<< HEAD
=======
=======
      <div class="final-actions">
        ${loading ? '<div class="loading-dot" aria-label="Processando respostas"></div>' : `<button class="final-button" id="final-button" type="button">${escapeHtml(screen.buttonLabel)} →</button>`}
        <p class="cta-note">Suas respostas foram registradas nesta sessão.</p>
>>>>>>> d3d3880abb39b317b80fc1521e707c08c5c29494
>>>>>>> 633d536e8834b1d696353ab96dd64c55b8acfe2e
      </div>
    </section>
  `;
}
