import type { Register, ThemeSetArgs } from 'claude-code'

import { upcoming } from './events'
import { makeColors } from './make-colors.js'
import { SCENE } from './scene'

// Rockhouse main church palette (Brand Package, Google Drive):
// Navy #0B253A, Black #111111, Warm White #F7F6F2, Charcoal #34383B,
// Medium Gray #A7AAAC, Light Gray #E7E8E8. Supporting sans: Montserrat.
type Hex = `#${string}`
const NAVY: Hex = '#0b253a'
const WARM_WHITE: Hex = '#f7f6f2'
const DARK_BUBBLE: Hex = '#1d4466'

const { theme, problems } = makeColors({
  label: 'Rockhouse',
  roles: {
    accent: NAVY,
    danger: '#b3392f',
    success: '#4e7d3a',
    warning: '#d79b22',
    pro: '#35566d',
  },
  light: {
    gray: {
      anchors: {
        'surface-0': '#efeee9',
        'surface-1': WARM_WHITE,
        'surface-2': '#fbfaf8',
        'text-primary': '#111111',
        'text-secondary': '#34383b',
        'text-muted': '#5a5f63',
      },
    },
  },
  dark: {
    roles: { accent: '#6f9cc4' },
    gray: {
      anchors: {
        'surface-0': '#0a1d2d',
        'surface-1': '#0e2537',
        'surface-2': '#122b40',
        'surface-3': '#163149',
        'text-primary': WARM_WHITE,
        'text-secondary': '#d3d6d8',
        'text-muted': '#a7aaac',
      },
    },
  },
})

const colors = {
  ...theme,
  inputs: {
    ...theme.inputs,
    light: {
      ...theme.inputs?.light,
      'bg-user-message': NAVY,
      'text-user-message': WARM_WHITE,
    },
    dark: {
      ...theme.inputs?.dark,
      'bg-user-message': DARK_BUBBLE,
      'text-user-message': WARM_WHITE,
    },
  },
}

const BASE: ThemeSetArgs = {
  colors,
  backdrop: { scene: 'rockhouse-building' },
}

const LOOK: ThemeSetArgs = {
  ...BASE,
  style: {
    Text: { fontFamily: ['sans'] },
    Heading: { fontFamily: ['sans'], fontWeight: 'bold', letterSpacing: 0.5 },
    UserMessage: { radius: 14, paddingX: 14, paddingY: 10 },
  },
}

function statusLine(nowMs: number): string {
  const [next] = upcoming(nowMs, 1)
  return next === undefined
    ? 'Rockhouse · Built on the Rock'
    : `Rockhouse · ${next.event.name} ${next.countdown}`
}

export const register: Register = on => {
  on('session.start', async ($, e, next) => {
    const unpainted = problems.find(line => line.startsWith("Desktop won't paint"))
    if (unpainted !== undefined) {
      $.ui.log(unpainted)
    }

    let set
    try {
      set = await $.theme.set(LOOK)
    } catch (error) {
      $.ui.log(String(error))
      set = await $.theme.set(BASE)
    }

    if (!set.isDrawn) {
      $.ui.log(`Rockhouse look not drawn here: ${set.reason}`)
    }
    $.ui.status(statusLine(await $.clock.now()))

    await $.command.register({
      name: 'rockhouse',
      description: 'Show upcoming Rockhouse dates',
    })

    return next(e)
  })

  on('turn.complete', async ($, e, next) => {
    $.ui.status(statusLine(await $.clock.now()))
    return next(e)
  })

  on('command.run', { command: 'rockhouse' }, async $ => {
    const list = upcoming(await $.clock.now(), 10)
    if (list.length === 0) {
      return { text: 'No upcoming Rockhouse dates are listed. Add them in hooks/events.ts.' }
    }
    const lines = list.map(
      one => `- ${one.event.name}: ${one.when}${one.event.where ? ` (${one.event.where})` : ''}, ${one.countdown}`,
    )
    return { text: ['Upcoming at Rockhouse:', ...lines].join('\n') }
  })

  on('ui.render', { component: 'Backdrop' }, ($, e, next) => {
    if (e.props.scene !== 'rockhouse-building') {
      return next(e)
    }
    if (e.surface !== 'desktop' && e.surface !== 'mobile') {
      return next(e)
    }
    const { Svg } = $.ui.resolve(e)
    return <Svg source={SCENE} alt="A faint drawing of the Rockhouse church building" />
  })

  on('ui.render', { component: 'AbovePrompt' }, async ($, e, next) => {
    if (e.props.hasSurvey) {
      return next(e)
    }
    const list = upcoming(await $.clock.now(), 2)
    if (list.length === 0) {
      return next(e)
    }
    const { Box, Text } = $.ui.resolve(e)
    return (
      <Box flexDirection="row" gap={2} flexWrap="wrap">
        <Text weight="bold" color={e.surface === 'terminal' ? 'claude' : undefined}>
          ROCKHOUSE
        </Text>
        {list.map(one => (
          <Text>
            <Text weight="semibold">{one.event.name}</Text>
            <Text dimColor>
              {' '}
              {one.when} · {one.countdown}
            </Text>
          </Text>
        ))}
      </Box>
    )
  })
}
