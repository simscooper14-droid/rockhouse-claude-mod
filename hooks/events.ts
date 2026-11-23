// Upcoming Rockhouse dates. Times are Big Spring local time (Central).
// Edit this list to change what the band and status line count down to.
export type RockhouseEvent = {
  name: string
  // Local date and time: [year, month (1-12), day, hour (24h), minute]
  at: readonly [number, number, number, number, number]
  where?: string
}

export const EVENTS: readonly RockhouseEvent[] = [
  { name: 'Thanksgiving Drive Thru', at: [2026, 11, 25, 11, 0], where: "Tate's Place" },
  { name: 'Launch Sunday', at: [2026, 12, 6, 10, 30], where: 'free t-shirts' },
  { name: 'Christmas Candlelight', at: [2026, 12, 23, 18, 0] },
  { name: 'New series: This Is What the Church Looks Like', at: [2027, 1, 10, 10, 30] },
]

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

// Central time: UTC-5 from the second Sunday of March to the first Sunday
// of November, UTC-6 otherwise.
function centralOffsetHours(utcMs: number): number {
  const year = new Date(utcMs).getUTCFullYear()
  const nthSunday = (month: number, n: number) => {
    const first = new Date(Date.UTC(year, month, 1)).getUTCDay()
    return 1 + ((7 - first) % 7) + 7 * (n - 1)
  }
  const dstStart = Date.UTC(year, 2, nthSunday(2, 2), 8)
  const dstEnd = Date.UTC(year, 10, nthSunday(10, 1), 7)
  return utcMs >= dstStart && utcMs < dstEnd ? -5 : -6
}

function localToUtc([y, mo, d, h, mi]: RockhouseEvent['at']): number {
  const guess = Date.UTC(y, mo - 1, d, h, mi)
  return guess - centralOffsetHours(guess + 6 * 3600_000) * 3600_000
}

function localDayNumber(utcMs: number): number {
  return Math.floor((utcMs + centralOffsetHours(utcMs) * 3600_000) / 86_400_000)
}

export type Upcoming = { event: RockhouseEvent; when: string; countdown: string }

function describe(event: RockhouseEvent, nowMs: number): Upcoming {
  const [y, mo, d, h, mi] = event.at
  const weekday = DAYS[new Date(Date.UTC(y, mo - 1, d)).getUTCDay()]
  const hour12 = ((h + 11) % 12) + 1
  const time = `${hour12}:${String(mi).padStart(2, '0')} ${h < 12 ? 'AM' : 'PM'}`
  const days = localDayNumber(localToUtc(event.at)) - localDayNumber(nowMs)
  const countdown = days === 0 ? 'today' : days === 1 ? 'tomorrow' : `in ${days} days`
  return { event, when: `${weekday}, ${MONTHS[mo - 1]} ${d} at ${time}`, countdown }
}

// Events that have not started yet (kept until 3 hours after start), soonest first.
export function upcoming(nowMs: number, count: number): Upcoming[] {
  return EVENTS.filter(event => localToUtc(event.at) + 3 * 3600_000 > nowMs)
    .slice(0, count)
    .map(event => describe(event, nowMs))
}

// "Sun 3:00 PM" in Central time, for a UTC timestamp.
export function centralShort(utcMs: number): string {
  const local = new Date(utcMs + centralOffsetHours(utcMs) * 3600_000)
  const h = local.getUTCHours()
  const mi = local.getUTCMinutes()
  const hour12 = ((h + 11) % 12) + 1
  return `${DAYS[local.getUTCDay()]} ${hour12}:${String(mi).padStart(2, '0')} ${h < 12 ? 'AM' : 'PM'}`
}
