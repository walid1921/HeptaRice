import { useMemo } from 'react'
import { Line } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js'
import { calcRatio, calcWater } from '../lib/ratio.js'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
)

const MIN = 100
const MAX = 1500
const STEP = 10

function roundedRect(ctx, x, y, w, h, r) {
  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.lineTo(x + w - r, y)
  ctx.quadraticCurveTo(x + w, y, x + w, y + r)
  ctx.lineTo(x + w, y + h - r)
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h)
  ctx.lineTo(x + r, y + h)
  ctx.quadraticCurveTo(x, y + h, x, y + h - r)
  ctx.lineTo(x, y + r)
  ctx.quadraticCurveTo(x, y, x + r, y)
  ctx.closePath()
}

const sliderLinePlugin = {
  id: 'sliderLine',
  afterDatasetsDraw(chart, _args, opts) {
    const rice = opts?.rice
    if (rice == null) return
    const { ctx, chartArea, scales } = chart
    const x = scales.x.getPixelForValue(rice)
    if (x < chartArea.left || x > chartArea.right) return

    // vertical dashed guide
    ctx.save()
    ctx.beginPath()
    ctx.setLineDash([5, 5])
    ctx.lineWidth = 1
    ctx.strokeStyle = 'rgba(226, 232, 240, 0.35)'
    ctx.moveTo(x, chartArea.top + 4)
    ctx.lineTo(x, chartArea.bottom)
    ctx.stroke()
    ctx.setLineDash([])

    // intersection markers on each dataset
    const water = calcWater(rice)
    const ratio = calcRatio(rice)
    const yWater = scales.yWater.getPixelForValue(water)
    const yRatio = scales.yRatio.getPixelForValue(ratio)

    const drawDot = (px, py, fill) => {
      ctx.beginPath()
      ctx.arc(px, py, 5, 0, Math.PI * 2)
      ctx.fillStyle = '#0b0f14'
      ctx.fill()
      ctx.beginPath()
      ctx.arc(px, py, 4, 0, Math.PI * 2)
      ctx.fillStyle = fill
      ctx.fill()
    }
    drawDot(x, yWater, '#38bdf8')
    drawDot(x, yRatio, '#4ade80')

    // pill label at top with the rice value
    const label = `${rice}g`
    ctx.font = '600 11px ui-sans-serif, system-ui, -apple-system'
    const padX = 8
    const padY = 4
    const textW = ctx.measureText(label).width
    const pillW = textW + padX * 2
    const pillH = 20
    let pillX = x - pillW / 2
    const pillY = chartArea.top - pillH - 2
    if (pillX < chartArea.left) pillX = chartArea.left
    if (pillX + pillW > chartArea.right) pillX = chartArea.right - pillW

    roundedRect(ctx, pillX, pillY, pillW, pillH, 10)
    ctx.fillStyle = 'rgba(15, 23, 42, 0.95)'
    ctx.fill()
    ctx.strokeStyle = 'rgba(148, 163, 184, 0.35)'
    ctx.lineWidth = 1
    ctx.stroke()

    ctx.fillStyle = '#f8fafc'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(label, pillX + pillW / 2, pillY + pillH / 2 + 0.5)

    ctx.restore()
  },
}

ChartJS.register(sliderLinePlugin)

const makeWaterGradient = (ctx, area) => {
  if (!area) return 'rgba(56, 189, 248, 0.18)'
  const g = ctx.createLinearGradient(0, area.top, 0, area.bottom)
  g.addColorStop(0, 'rgba(56, 189, 248, 0.35)')
  g.addColorStop(1, 'rgba(56, 189, 248, 0.02)')
  return g
}

export default function RatioChart({ rice }) {
  const { labels, water, ratios } = useMemo(() => {
    const labels = []
    const water = []
    const ratios = []
    for (let r = MIN; r <= MAX; r += STEP) {
      labels.push(r)
      water.push(calcWater(r))
      ratios.push(Number(calcRatio(r).toFixed(4)))
    }
    return { labels, water, ratios }
  }, [])

  const data = {
    labels,
    datasets: [
      {
        label: 'Water',
        data: water,
        yAxisID: 'yWater',
        borderColor: '#38bdf8',
        backgroundColor: (ctx) => makeWaterGradient(ctx.chart.ctx, ctx.chart.chartArea),
        fill: true,
        tension: 0.25,
        pointRadius: 0,
        pointHoverRadius: 4,
        borderWidth: 2.5,
      },
      {
        label: 'Ratio',
        data: ratios,
        yAxisID: 'yRatio',
        borderColor: '#4ade80',
        backgroundColor: 'transparent',
        borderDash: [6, 4],
        tension: 0,
        pointRadius: 0,
        pointHoverRadius: 4,
        borderWidth: 2,
      },
    ],
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: { mode: 'index', intersect: false },
    layout: { padding: { top: 22, right: 6, left: 0, bottom: 0 } },
    plugins: {
      legend: {
        position: 'top',
        align: 'end',
        labels: {
          color: '#cbd5e1',
          usePointStyle: true,
          pointStyle: 'circle',
          boxWidth: 6,
          boxHeight: 6,
          padding: 12,
          font: { size: 11 },
        },
      },
      tooltip: {
        backgroundColor: 'rgba(15, 23, 42, 0.95)',
        borderColor: 'rgba(148, 163, 184, 0.2)',
        borderWidth: 1,
        titleColor: '#f8fafc',
        bodyColor: '#cbd5e1',
        padding: 10,
        callbacks: {
          title: (items) => `${items[0].label}g rice`,
          label: (ctx) =>
            ctx.dataset.yAxisID === 'yWater'
              ? `Water: ${ctx.parsed.y}g`
              : `Ratio: 1:${ctx.parsed.y.toFixed(3)}`,
        },
      },
      sliderLine: { rice },
    },
    scales: {
      x: {
        type: 'linear',
        min: MIN,
        max: MAX,
        border: { display: false },
        ticks: {
          color: '#94a3b8',
          maxRotation: 0,
          autoSkip: true,
          maxTicksLimit: 5,
          font: { size: 10 },
          padding: 4,
          callback: (v) => `${v}`,
        },
        grid: { color: 'rgba(148, 163, 184, 0.06)' },
      },
      yWater: {
        type: 'linear',
        position: 'left',
        border: { display: false },
        ticks: {
          color: '#38bdf8',
          font: { size: 10 },
          maxTicksLimit: 5,
          padding: 4,
          callback: (v) => `${v}`,
        },
        grid: { color: 'rgba(148, 163, 184, 0.06)' },
      },
      yRatio: {
        type: 'linear',
        position: 'right',
        border: { display: false },
        ticks: {
          color: '#4ade80',
          font: { size: 10 },
          maxTicksLimit: 5,
          padding: 4,
          callback: (v) => v.toFixed(1),
        },
        grid: { drawOnChartArea: false },
        min: 1.4,
        max: 2.0,
      },
    },
  }

  return <Line data={data} options={options} />
}
