# Rockhouse for Claude

A Claude mod in the Rockhouse Christian Church look, built from the main church Brand Package (Rockhouse Navy, Rockhouse Black, Warm White, Charcoal and the grays; Montserrat-style sans type).

What it does:

- **Theme** (Claude desktop and mobile apps): warm white pages by day and a deep Rockhouse Navy by night, navy message bubbles, and a faint line drawing of the Rockhouse building (steeple, cross, stone base) in the top-right corner.
- **Countdown band** above the prompt: the next two Rockhouse dates with how many days are left, such as "Launch Sunday · Sun, Dec 6 at 10:30 AM · in 13 days".
- **Status line**: the next date at a glance, such as "Rockhouse · Launch Sunday in 13 days".
- **Weekly usage meter**: your Claude plan's weekly (seven-day) usage, in the status line ("Week 42% used") and the band (with when it resets, Central time). It shows once Claude has reported a reading, after the first reply of a session, and only on a subscription plan.
- **`/rockhouse`** command: lists every upcoming date.

## Install

At the prompt of a Claude Code session:

```
/plugin install rockhouse --marketplace simscooper14-droid/rockhouse-claude-mod
```

Answer `y` to add the marketplace, then pick a scope.

From a shell instead:

```
claude plugin marketplace add simscooper14-droid/rockhouse-claude-mod
claude plugin install rockhouse@rockhouse --scope user
```

## Updating the dates

The dates live in `hooks/events.ts`, in Big Spring (Central) time. Add, change or remove lines there, then push. Each date drops off three hours after it starts.

## Files

- `hooks/register.tsx`: the theme, band, status line and command
- `hooks/events.ts`: the upcoming dates
- `hooks/scene.ts`: the backdrop drawing
- `hooks/make-colors.js`: Claude's color helper (copied unchanged)
