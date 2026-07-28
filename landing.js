const root = document.documentElement;
const body = document.body;
const story = document.querySelector('.story');
const header = document.querySelector('[data-header]');
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
  { start: 0.07, end: 0.24, label: 'Ask in Slack', status: 'message received' },
  { start: 0.24, end: 0.41, label: 'Private DM', status: 'moved to private DM' },
  { start: 0.41, end: 0.58, label: 'Find your agent', status: 'Alice matched' },
  { start: 0.58, end: 0.76, label: 'Work on your machine', status: 'agent working' },
  { start: 0.76, end: 1, label: 'Review before sharing', status: 'answer ready' },
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

const measure = () => {
  const rect = story.getBoundingClientRect();
  state.storyTop = window.scrollY + rect.top;
  state.travel = Math.max(1, story.offsetHeight - window.innerHeight);
  updateTarget();
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

const setStageText = (stage) => {
  if (stage === state.stage) return;
  state.stage = stage;
  body.dataset.stage = String(stage);

  const current = stages[stage];
  document.querySelector('.progress-label').textContent = current.label;
  document.querySelector('.status-copy').textContent = current.status;
};

const packetPosition = (progress) => {
  if (progress < 0.42) {
    const amount = smooth(progress, 0.08, 0.4);
    return {
      x: mix(29, 50.5, amount),
      y: 47,
      mobileY: mix(20, 46, amount),
      rotation: mix(-10, 8, amount),
    };
  }

  if (progress < 0.75) {
    const amount = smooth(progress, 0.43, 0.72);
    return {
      x: mix(50.5, 69, amount),
      y: mix(47, 31, amount),
      mobileY: mix(46, 70, amount),
      rotation: mix(8, 18, amount),
    };
  }

  const amount = smooth(progress, 0.76, 0.96);
  return {
    x: mix(69, 29, amount),
    y: mix(31, 47, amount),
    mobileY: mix(70, 91, amount),
    rotation: mix(18, 188, amount),
  };
};

const apply = (progress) => {
  const heroOut = smooth(progress, 0.018, 0.095);
  setVariable('--hero-o', (1 - heroOut).toFixed(4));
  setVariable('--hero-y', `${(-heroOut * 28).toFixed(2)}px`);
  setVariable('--steps-o', smooth(progress, 0.055, 0.095).toFixed(4));
  setVariable('--rail-o', smooth(progress, 0.035, 0.095).toFixed(4));

  stages.forEach((stage, index) => {
    const opacity = bandOpacity(progress, stage.start, stage.end);
    const entering = smooth(progress, stage.start, stage.start + 0.04);
    const leaving = stage.end === 1 ? 0 : smooth(progress, stage.end - 0.04, stage.end);
    setVariable(`--s${index + 1}-o`, opacity.toFixed(4));
    setVariable(`--s${index + 1}-y`, `${(18 * (1 - entering) - leaving * 12).toFixed(2)}px`);

    const fill = clamp((progress - stage.start) / (stage.end - stage.start)) * 100;
    setVariable(`--rf${index + 1}`, `${fill.toFixed(2)}%`);
  });

  const draft = smooth(progress, 0.79, 0.86);
  const privateThread = smooth(progress, 0.22, 0.32) * (1 - smooth(progress, 0.72, 0.78));
  const owner = smooth(progress, 0.4, 0.47);
  const bob = smooth(progress, 0.43, 0.49);
  const running = smooth(progress, 0.57, 0.68);

  setVariable('--dm-o', privateThread.toFixed(4));
  setVariable('--owner-o', owner.toFixed(4));
  setVariable('--bob-o', bob.toFixed(4));
  setVariable('--run-o', running.toFixed(4));
  setVariable('--draft-o', draft.toFixed(4));
  setVariable('--packet-o', (0.28 + smooth(progress, 0.025, 0.09) * 0.72).toFixed(4));

  const packet = packetPosition(progress);
  setVariable('--packet-x', packet.x.toFixed(3));
  setVariable('--packet-y', packet.y.toFixed(3));
  setVariable('--mpacket-y', packet.mobileY.toFixed(3));
  setVariable('--packet-r', `${packet.rotation.toFixed(2)}deg`);

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
    setVariable('--owner-o', '1');
    setVariable('--bob-o', '1');
    setVariable('--run-o', '1');
    setVariable('--draft-o', '1');
    setVariable('--header-rule', window.scrollY > 12 ? '1' : '0');
    return;
  }

  measure();
  requestFrame();
};

document.querySelectorAll('[data-jump]').forEach((button) => {
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
