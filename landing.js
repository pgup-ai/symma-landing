const root = document.documentElement;
const body = document.body;
const story = document.querySelector('.story');
const header = document.querySelector('[data-header]');
const progressLabel = document.querySelector('.progress-label');
const progressButtons = [...document.querySelectorAll('[data-jump]')];
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const motionOverride = new URLSearchParams(window.location.search).get('motion');
const calmMotion = () => reducedMotion.matches || motionOverride === 'calm';

const state = {
  current: 0,
  target: 0,
  storyTop: 0,
  travel: 1,
  frame: 0,
  stage: -1,
};

const stages = [
  { start: 0.07, end: 0.24, label: 'Start privately' },
  { start: 0.24, end: 0.41, label: 'Set the scope' },
  { start: 0.41, end: 0.58, label: 'Watch the work move' },
  { start: 0.58, end: 0.76, label: 'Keep going' },
  { start: 0.76, end: 1, label: 'Review before sharing' },
];

const clamp = (value, min = 0, max = 1) => Math.min(max, Math.max(min, value));
const mix = (from, to, amount) => from + (to - from) * amount;
const smooth = (value, from, to) => {
  const amount = clamp((value - from) / (to - from));
  return amount * amount * (3 - 2 * amount);
};

const bandOpacity = (progress, start, end) => {
  const fade = Math.min(0.04, (end - start) * 0.24);
  const entering = smooth(progress, start, start + fade);
  const leaving = end === 1 ? 1 : 1 - smooth(progress, end - fade, end);
  return entering * leaving;
};

const setVariable = (name, value) => {
  root.style.setProperty(name, value);
};

const updateHeader = () => {
  setVariable('--header-rule', window.scrollY > 12 ? '1' : '0');
  header.toggleAttribute('data-scrolled', window.scrollY > 12);
};

const updateTarget = () => {
  state.target = clamp((window.scrollY - state.storyTop) / state.travel);
  updateHeader();
  requestFrame();
};

const measure = () => {
  const rect = story.getBoundingClientRect();
  state.storyTop = window.scrollY + rect.top;
  state.travel = Math.max(1, story.offsetHeight - window.innerHeight);
  updateTarget();
};

const setStageText = (stage) => {
  if (stage === state.stage) return;
  state.stage = stage;
  body.dataset.stage = String(stage);
  progressLabel.textContent = stages[stage].label;
  progressButtons.forEach((button, index) => {
    if (index === stage) button.setAttribute('aria-current', 'step');
    else button.removeAttribute('aria-current');
  });
};

const threadPosition = (progress) => {
  if (progress < 0.41) return mix(0, -110, smooth(progress, 0.2, 0.39));
  if (progress < 0.58) return mix(-110, -265, smooth(progress, 0.42, 0.56));
  if (progress < 0.76) return mix(-265, -465, smooth(progress, 0.59, 0.74));
  return mix(-465, -625, smooth(progress, 0.77, 0.96));
};

const apply = (progress) => {
  const heroOut = smooth(progress, 0.018, 0.095);
  setVariable('--hero-o', (1 - heroOut).toFixed(4));
  setVariable('--hero-y', -heroOut * 28 + 'px');
  setVariable('--steps-o', smooth(progress, 0.055, 0.095).toFixed(4));
  setVariable('--rail-o', smooth(progress, 0.035, 0.095).toFixed(4));
  setVariable('--cue-o', (1 - smooth(progress, 0.018, 0.075)).toFixed(4));

  stages.forEach((stage, index) => {
    const opacity = bandOpacity(progress, stage.start, stage.end);
    const entering = smooth(progress, stage.start, stage.start + 0.04);
    const leaving = stage.end === 1 ? 0 : smooth(progress, stage.end - 0.04, stage.end);
    setVariable('--s' + (index + 1) + '-o', opacity.toFixed(4));
    setVariable('--s' + (index + 1) + '-y', 16 * (1 - entering) - leaving * 10 + 'px');

    const fill = clamp((progress - stage.start) / (stage.end - stage.start)) * 100;
    setVariable('--rf' + (index + 1), fill.toFixed(2) + '%');
  });

  setVariable('--scope-o', smooth(progress, 0.24, 0.32).toFixed(4));
  setVariable('--work-o', smooth(progress, 0.41, 0.49).toFixed(4));
  setVariable('--follow-o', smooth(progress, 0.58, 0.66).toFixed(4));
  setVariable('--final-o', smooth(progress, 0.76, 0.84).toFixed(4));
  setVariable('--thread-y', threadPosition(progress).toFixed(2) + 'px');

  let stageIndex = 0;
  stages.forEach((stage, index) => {
    if (progress >= stage.start) stageIndex = index;
  });
  setStageText(stageIndex);
};

const tick = () => {
  state.frame = 0;
  const delta = state.target - state.current;
  state.current += delta * 0.14;

  if (Math.abs(delta) < 0.00035) {
    state.current = state.target;
  }

  apply(state.current);

  if (state.current !== state.target) {
    state.frame = window.requestAnimationFrame(tick);
  }
};

const requestFrame = () => {
  if (!state.frame && !calmMotion()) {
    state.frame = window.requestAnimationFrame(tick);
  }
};

const applyMotionPreference = () => {
  body.dataset.motion = calmMotion() ? 'calm' : 'full';

  if (calmMotion()) {
    if (state.frame) window.cancelAnimationFrame(state.frame);
    state.frame = 0;
    state.current = state.target;
    setStageText(4);
    setVariable('--scope-o', '1');
    setVariable('--work-o', '1');
    setVariable('--follow-o', '1');
    setVariable('--final-o', '1');
    setVariable('--thread-y', '0px');
    updateHeader();
    return;
  }

  measure();
  requestFrame();
};

progressButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const index = Number(button.dataset.jump);
    const stage = stages[index];
    const destination = state.storyTop + state.travel * ((stage.start + stage.end) / 2);
    window.scrollTo({ top: destination, behavior: calmMotion() ? 'auto' : 'smooth' });
  });
});

window.addEventListener('scroll', updateTarget, { passive: true });
window.addEventListener('resize', measure);
reducedMotion.addEventListener('change', applyMotionPreference);

if ('ResizeObserver' in window) {
  new ResizeObserver(measure).observe(story);
}

document.fonts.ready.then(measure);
apply(0);
applyMotionPreference();
