# symma-landing — agent guide

Static public site for [Symma](https://github.com/pgup-ai/symma). The page explains one idea:
someone can ask for help in Slack and reach the coding agent already running on their own machine,
with their own login and approved projects.

This file is the source of truth for product story, visual language, interaction patterns, and
validation in this repository.

## Product story

Write for a curious Slack user first and a protocol implementer second.

The page should explain this sequence in ordinary language:

1. Ask from an existing Slack conversation.
2. Continue the task in a private DM.
3. Symma finds the machine paired to that person.
4. The person's existing agent works in an approved project.
5. The person reviews the result and chooses whether to share it.

Keep these promises clear:

- One shared Slack app can serve many people, but each person reaches only their own agent.
- Provider credentials, project files, and agent execution stay on the connected machine.
- A Slack invocation is not permission to publish the answer. Work begins privately.
- A user chooses the machines, agents, and project folders Slack may expose.
- The hosted service relays the conversation and sees that relayed content; do not imply
  end-to-end secrecy that the architecture does not provide.

The agent connection works today. Personal Slack pairing and the polished Slack experience are
planned. Preserve that distinction anywhere setup or availability is discussed. Never publish an
install command, product control, or status claim that does not exist in the product.

## Information order

Keep the page progressive:

1. Outcome: use your own agent from Slack.
2. Five-step human story.
3. Personal ownership, credentials, and project boundaries.
4. Planned connection flow.
5. Trust boundaries.
6. Current packages and roadmap for technical readers.
7. GitHub call to action.

Do not lead with ACP, gateways, endpoints, signed envelopes, tenancy, or other implementation
language. Those details belong in the foundation section, supporting documentation, accessibility
labels where precision requires them, or the repository itself.

Prefer concrete nouns and actions: “your machine,” “your login,” “approved project,” “private DM,”
and “share to the thread.” Avoid vague claims, superlatives, faux quotes, breathless fragments, and
generic AI language such as “revolutionary,” “seamless,” or “unlock.”

## Visual direction

The site is dark, restrained, and utilitarian. It should feel like dependable infrastructure
explained clearly, not a generic AI landing-page template.

- Use the color tokens in `:root`. Violet is the only accent family.
- Keep the page background nearly black and distinguish surfaces with small value shifts and quiet
  borders.
- Do not add competing cyan, green, amber, or pink accents. Status differences should use wording,
  icons, weight, or opacity before another hue.
- The route diagram is the one deliberate grid surface. Keep its grid quiet and pair it with a
  restrained violet wash so it reads as a system map rather than generic decoration.
- Avoid global decorative grids, glowing blobs, oversized gradients, random particles, glass
  cards, floating badges, fake telemetry, version labels, and ornamental section numbers.
- Shadows and gradients may add restrained depth inside the route diagram; they must not become the
  page's visual identity.
- Prefer rules, aligned rows, and whitespace over repeated equal-sized feature cards.
- Keep border radii modest and consistent. Pill shapes are reserved for compact status or boundary
  labels.
- Reuse the wordmark geometry in the header and favicon. Do not introduce a second logo treatment.

## Typography

- `Onest` is the interface and editorial face.
- `IBM Plex Mono` is for package names, small route labels, state, and other genuinely technical
  metadata. Do not use monospace as decoration.
- Self-host font files under `assets/fonts/` with `font-display: swap`; do not add a runtime font
  request.
- Use sentence case. Keep headings compact, concrete, and free of trailing explanatory clauses.
- Desktop narrative body copy should normally be at least 16px. Mobile narrative copy must be at
  least 14px.
- Buttons and interactive labels must remain at least 13px on mobile.
- Diagram-only secondary annotations may reach 9px when the surrounding node has a larger primary
  label. Never use tiny type for an essential instruction, trust claim, or call to action.
- Check headline wrapping rather than only computed size. The hero should remain two lines at the
  reference desktop and mobile viewports.

## Layout and responsive patterns

- `.shell` owns the shared content width and horizontal gutters.
- The opening story is intentionally a sticky, five-stage explanation on wider screens.
- The desktop architecture diagram and the mobile route diagram are separate presentations of the
  same story. Preserve their semantic parity; do not squeeze the desktop diagram into a phone.
- The primary breakpoints are 1180px, 920px, and 560px. Treat 920px as the switch to the mobile
  narrative layout.
- Keep navigation on one line on desktop. On small screens, preserve the wordmark and primary GitHub
  action before adding more navigation.
- Do not allow horizontal scrolling. Test long labels and headings at 390px before shortening or
  hiding content.

## Motion

Motion exists to show a request moving from Slack to the correct personal agent and back to a
private answer.

- `landing.js` owns stage timing and writes animation state through CSS custom properties.
- Keep scroll handling passive and schedule visual updates through one `requestAnimationFrame`
  loop. Do not add per-frame layout reads or parallel animation loops.
- When changing a stage, update its copy, diagram state, progress rail, and mobile representation
  together.
- Forward and reverse scrolling must both resolve cleanly. No stale cards or overlapping labels may
  remain after a transition.
- Show “Scroll to follow the route” before the first transition, then fade it as the route begins.
  Hide it when reduced motion replaces the scroll-driven story.
- Preserve `prefers-reduced-motion` and the `?motion=calm` test override. Reduced motion must show a
  complete, understandable static story rather than hiding information.
- Avoid ambient motion that does not communicate routing, ownership, execution, or delivery.

## Accessibility and performance

- Preserve the skip link, semantic heading order, visible focus states, and descriptive labels.
- Decorative SVGs and motion artifacts are `aria-hidden`; explanatory diagrams have useful labels.
- Do not make color the only carrier of state.
- Keep the site dependency-free unless a real product need justifies otherwise.
- Prefer HTML and CSS over JavaScript for static presentation.
- Keep fonts and visual assets local, small, and explicitly licensed.

## File ownership

- `index.html` owns semantics, product copy, metadata, and section order.
- `styles.css` owns tokens, layout, responsive behavior, and animation presentation.
- `landing.js` owns the scroll-stage state machine and no general UI framework.
- `assets/fonts/` contains the self-hosted font files and their licenses.
- `favicon.svg` uses the same restrained brand geometry as the wordmark.

Search for an existing token, component class, or stage variable before adding a new one. Remove
obsolete markup and styles in the same change; do not leave compatibility aliases or dead visual
states without a caller.

## Validation

There is no build step or automated test suite. Before committing:

```bash
npx --yes prettier@3.9.6 --check index.html styles.css landing.js README.md AGENTS.md
node --check landing.js
git diff --check
python3 -m http.server 4173
```

Then inspect:

- 1280 × 800 desktop
- 390 × 844 mobile
- the first and final story stages
- forward and reverse stage transitions
- reduced motion using `?motion=calm`
- keyboard focus and progress buttons
- console warnings or errors
- horizontal overflow

Vercel deploys `main` to [symma.dev](https://symma.dev). Branches receive preview deployments.
