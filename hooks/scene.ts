// A still backdrop: the page color for each mode, and a faint line drawing
// of the Rockhouse building (steeple, gable roof, cross, stone base) in the
// top-right corner, away from the words and the message box.
export const SCENE = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 1000" preserveAspectRatio="xMidYMid slice">
<style>
.page { fill: #efeee9 }
.mark { fill: #0b253a; opacity: 0.07 }
@media (prefers-color-scheme: dark) {
  .page { fill: #0a1d2d }
  .mark { fill: #f7f6f2; opacity: 0.06 }
}
</style>
<rect class="page" width="1600" height="1000"/>
<svg x="0" y="0" width="1600" height="1000" viewBox="0 0 200 200" preserveAspectRatio="xMaxYMin meet">
<g class="mark" transform="translate(118 10) scale(0.38)">
<path d="M100 4 L104 58 L96 58 Z"/>
<path d="M92 58 H108 V64 H92 Z"/>
<path d="M4 100 L100 60 L196 100 L190 106 L100 69 L10 106 Z"/>
<path fill-rule="evenodd" d="M26 101 L100 71 L174 101 V150 H26 Z M97 82 H103 V95 H114 V100 H103 V130 H97 V100 H86 V95 H97 Z"/>
<path d="M24 154 H52 V166 H24 Z M56 154 H92 V166 H56 Z M96 154 H130 V166 H96 Z M134 154 H176 V166 H134 Z"/>
<path d="M24 170 H44 V182 H24 Z M48 170 H84 V182 H48 Z M88 170 H112 V182 H88 Z M116 170 H150 V182 H116 Z M154 170 H176 V182 H154 Z"/>
<path d="M24 186 H58 V196 H24 Z M62 186 H100 V196 H62 Z M104 186 H140 V196 H104 Z M144 186 H176 V196 H144 Z"/>
</g>
</svg>
</svg>`
