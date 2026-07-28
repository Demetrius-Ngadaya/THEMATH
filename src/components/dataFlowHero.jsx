"use client"

import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'

export default function DataFlowHero() {
    const canvasRef = useRef(null)
    const containerRef = useRef(null)

    useEffect(() => {
        const canvas = canvasRef.current
        const container = containerRef.current
        if (!canvas || !container) return

        const ctx = canvas.getContext('2d')
        let W, H, DPR
        let animationId

        const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
        if (prefersReduced) return

        function resize() {
            DPR = Math.min(window.devicePixelRatio || 1, 2)
            const rect = container.getBoundingClientRect()
            W = canvas.width = rect.width * DPR
            H = canvas.height = rect.height * DPR
            canvas.style.width = rect.width + 'px'
            canvas.style.height = rect.height + 'px'
            ctx.setTransform(DPR, 0, 0, DPR, 0, 0)
        }

        window.addEventListener('resize', resize)
        resize()

        const mouse = { x: -9999, y: -9999, active: false }

        const handleMouseMove = (e) => {
            const rect = container.getBoundingClientRect()
            mouse.x = e.clientX - rect.left
            mouse.y = e.clientY - rect.top
            mouse.active = true
        }

        const handleMouseLeave = () => {
            mouse.active = false
        }

        container.addEventListener('mousemove', handleMouseMove)
        container.addEventListener('mouseleave', handleMouseLeave)

        function rand(a, b) { return Math.random() * (b - a) + a }

        const palette = ['#00e5ff', '#3b82f6', '#8b5cf6', '#ec4899']

        // Nodes
        const NODE_COUNT = Math.round((window.innerWidth * window.innerHeight) / 26000)
        const LINK_DIST = 140, MOUSE_DIST = 180

        class Node {
            constructor() {
                const rect = container.getBoundingClientRect()
                this.x = rand(0, rect.width)
                this.y = rand(0, rect.height)
                this.vx = rand(-0.15, 0.15)
                this.vy = rand(-0.15, 0.15)
                this.r = rand(1, 2.4)
                this.color = palette[Math.floor(Math.random() * palette.length)]
                this.pulse = rand(0, Math.PI * 2)
            }
            step() {
                const rect = container.getBoundingClientRect()
                this.x += this.vx
                this.y += this.vy
                if (this.x < -20) this.x = rect.width + 20
                if (this.x > rect.width + 20) this.x = -20
                if (this.y < -20) this.y = rect.height + 20
                if (this.y > rect.height + 20) this.y = -20
                this.pulse += 0.02
            }
        }

        let nodes = Array.from({ length: NODE_COUNT }, () => new Node())

        // Graph paths
        class GraphPath {
            constructor(seedY, color, speed, amp, thickness, opacity) {
                Object.assign(this, { seedY, color, speed, amp, thickness, opacity })
                this.offset = rand(0, 1000)
                this.points = 8
            }
            draw(t) {
                const rect = container.getBoundingClientRect()
                const w = rect.width
                const h = rect.height
                ctx.beginPath()
                ctx.moveTo(-20, this.seedY * h)
                const step = (w + 40) / this.points
                for (let i = 0; i <= this.points; i++) {
                    const x = -20 + i * step
                    const y = this.seedY * h +
                        Math.sin(t * this.speed + i * 1.3 + this.offset) * this.amp +
                        Math.sin(t * this.speed * 0.5 + i * 0.6 + this.offset) * this.amp * 0.4
                    ctx.lineTo(x, y)
                }
                ctx.strokeStyle = this.color
                ctx.lineWidth = this.thickness
                ctx.globalAlpha = this.opacity
                ctx.shadowBlur = 9
                ctx.shadowColor = this.color
                ctx.stroke()
                ctx.shadowBlur = 0
                ctx.globalAlpha = 1
            }
        }

        const graphPaths = [
            new GraphPath(0.20, '#00e5ff', 0.6, 24, 1.3, 0.16),
            new GraphPath(0.40, '#3b82f6', 0.4, 30, 1.1, 0.12),
            new GraphPath(0.86, '#00e5ff', 0.35, 16, 1, 0.09),
            new GraphPath(0.63, '#8b5cf6', 0.32, 46, 2.6, 0.38),
            new GraphPath(0.70, '#00e5ff', 0.30, 40, 2.4, 0.30),
        ]

        // Bar clusters
        class BarCluster {
            constructor() { this.reset(true) }
            reset(initial) {
                const rect = container.getBoundingClientRect()
                this.x = initial ? rand(0, rect.width) : rect.width + 60
                this.y = rand(rect.height * 0.15, rect.height * 0.85)
                this.bars = Array.from({ length: 5 }, () => rand(8, 34))
                this.speed = rand(0.08, 0.2)
                this.color = palette[Math.floor(Math.random() * palette.length)]
                this.opacity = rand(0.07, 0.16)
                this.scale = rand(0.6, 1.1)
            }
            step() {
                this.x -= this.speed
                if (this.x < -80) this.reset(false)
            }
            draw() {
                ctx.save()
                ctx.translate(this.x, this.y)
                ctx.scale(this.scale, this.scale)
                ctx.globalAlpha = this.opacity
                this.bars.forEach((h, i) => {
                    ctx.fillStyle = this.color
                    ctx.shadowBlur = 6
                    ctx.shadowColor = this.color
                    ctx.fillRect(i * 8, -h, 5, h)
                })
                ctx.restore()
                ctx.globalAlpha = 1
                ctx.shadowBlur = 0
            }
        }

        const barClusters = Array.from({ length: 4 }, () => new BarCluster())

        // Binary stream
        const binaryCols = []

        function buildBinaryCols() {
            binaryCols.length = 0
            const rect = container.getBoundingClientRect()
            if (rect.width < 800) return
            const colCount = 6
            for (let i = 0; i < colCount; i++) {
                const chars = Array.from({ length: 26 }, () => Math.random() > 0.5 ? '1' : '0')
                binaryCols.push({ x: 18 + i * 24, chars, offset: rand(0, 400), speed: rand(18, 32) })
            }
        }

        buildBinaryCols()
        window.addEventListener('resize', buildBinaryCols)

        function drawBinary(t) {
            const rect = container.getBoundingClientRect()
            if (rect.width < 800) return
            ctx.font = '11px monospace'
            binaryCols.forEach(col => {
                col.offset -= 0.35 + (col.speed % 1)
                const h = rect.height * 0.42
                for (let i = 0; i < col.chars.length; i++) {
                    let y = ((i * 18 + col.offset) % (h + 40)) - 20
                    if (y < -20 || y > h + 20) continue
                    const distFromMid = Math.abs(y - h / 2) / (h / 2)
                    ctx.globalAlpha = Math.max(0, 0.22 - distFromMid * 0.15)
                    ctx.fillStyle = '#00e5ff'
                    ctx.fillText(col.chars[i], col.x, y)
                }
            })
            ctx.globalAlpha = 1
        }

        // World map
        let mapBox = { x: 0, y: 0, w: 0, h: 0 }
        let worldDots = []
        const continents = [
            { cx: 0.55, cy: 0.24, rx: 0.36, ry: 0.16 },
            { cx: 0.53, cy: 0.55, rx: 0.12, ry: 0.27 },
            { cx: 0.17, cy: 0.26, rx: 0.15, ry: 0.19 },
            { cx: 0.27, cy: 0.64, rx: 0.08, ry: 0.21 },
            { cx: 0.83, cy: 0.72, rx: 0.075, ry: 0.06 }
        ]

        function buildWorldMap() {
            const rect = container.getBoundingClientRect()
            if (rect.width < 1000) { worldDots = []; return }
            mapBox = { x: rect.width - 300, y: 90, w: 260, h: 150 }
            worldDots = []
            continents.forEach(c => {
                const count = Math.round(c.rx * c.ry * 2200)
                for (let i = 0; i < count; i++) {
                    const a = rand(0, Math.PI * 2), r = Math.sqrt(Math.random())
                    const nx = c.cx + Math.cos(a) * c.rx * r
                    const ny = c.cy + Math.sin(a) * c.ry * r
                    worldDots.push({ x: mapBox.x + nx * mapBox.w, y: mapBox.y + ny * mapBox.h })
                }
            })
        }

        buildWorldMap()
        window.addEventListener('resize', buildWorldMap)

        const arcs = [
            { a: 0, b: 1, speed: 0.25 },
            { a: 2, b: 1, speed: 0.18 },
            { a: 3, b: 0, speed: 0.21 }
        ]

        const arcAnchors = [
            () => ({ x: mapBox.x + mapBox.w * 0.2, y: mapBox.y + mapBox.h * 0.28 }),
            () => ({ x: mapBox.x + mapBox.w * 0.55, y: mapBox.y + mapBox.h * 0.35 }),
            () => ({ x: mapBox.x + mapBox.w * 0.82, y: mapBox.y + mapBox.h * 0.7 }),
            () => ({ x: mapBox.x + mapBox.w * 0.3, y: mapBox.y + mapBox.h * 0.68 }),
        ]

        function drawWorldMap(t) {
            const rect = container.getBoundingClientRect()
            if (rect.width < 1000 || !worldDots.length) return
            ctx.fillStyle = '#00e5ff'
            worldDots.forEach(d => { ctx.globalAlpha = 0.5; ctx.fillRect(d.x, d.y, 1.4, 1.4) })
            ctx.globalAlpha = 1

            ctx.strokeStyle = 'rgba(0,229,255,0.18)'
            ctx.lineWidth = 1
            ctx.beginPath()
            ctx.ellipse(mapBox.x + mapBox.w / 2, mapBox.y + mapBox.h / 2, mapBox.w * 0.58, mapBox.h * 0.62, 0, 0, Math.PI * 2)
            ctx.stroke()

            arcs.forEach(arc => {
                const p0 = arcAnchors[arc.a](), p1 = arcAnchors[arc.b]()
                const mx = (p0.x + p1.x) / 2, my = Math.min(p0.y, p1.y) - 40
                ctx.strokeStyle = 'rgba(139,92,246,0.35)'
                ctx.lineWidth = 1
                ctx.beginPath()
                ctx.moveTo(p0.x, p0.y)
                ctx.quadraticCurveTo(mx, my, p1.x, p1.y)
                ctx.stroke()
                const tt = (t * arc.speed) % 1
                const qx = (1 - tt) * (1 - tt) * p0.x + 2 * (1 - tt) * tt * mx + tt * tt * p1.x
                const qy = (1 - tt) * (1 - tt) * p0.y + 2 * (1 - tt) * tt * my + tt * tt * p1.y
                ctx.beginPath()
                ctx.arc(qx, qy, 2.2, 0, Math.PI * 2)
                ctx.fillStyle = '#fff'
                ctx.shadowBlur = 8
                ctx.shadowColor = '#00e5ff'
                ctx.fill()
                ctx.shadowBlur = 0
            })

            ctx.font = '10px monospace'
            ctx.fillStyle = 'rgba(180,210,240,0.55)'
            ctx.fillText('LAT: -6.7924°', mapBox.x + mapBox.w - 4 - 72, mapBox.y - 14)
            ctx.fillText('LON: 39.2083°', mapBox.x + mapBox.w - 4 - 74, mapBox.y - 2)
        }

        // Card overlay elements (invisible but present for the visual feel)
        function drawCards() {
            // We'll skip drawing actual cards since they're in the HTML overlay
            // but we want to keep the canvas background alive
        }

        // Main render loop
        let t = 0

        function render() {
            const rect = container.getBoundingClientRect()
            t += 0.016
            ctx.clearRect(0, 0, rect.width, rect.height)

            graphPaths.forEach(p => p.draw(t))
            drawWorldMap(t)
            drawBinary(t)
            barClusters.forEach(b => { b.step(); b.draw() })

            nodes.forEach(n => n.step())
            for (let i = 0; i < nodes.length; i++) {
                for (let j = i + 1; j < nodes.length; j++) {
                    const a = nodes[i], b = nodes[j]
                    const dx = a.x - b.x, dy = a.y - b.y, dist = Math.sqrt(dx * dx + dy * dy)
                    if (dist < LINK_DIST) {
                        ctx.strokeStyle = a.color
                        ctx.globalAlpha = (1 - dist / LINK_DIST) * 0.35
                        ctx.lineWidth = 0.6
                        ctx.beginPath()
                        ctx.moveTo(a.x, a.y)
                        ctx.lineTo(b.x, b.y)
                        ctx.stroke()
                    }
                }
                if (mouse.active) {
                    const dx = nodes[i].x - mouse.x, dy = nodes[i].y - mouse.y, dist = Math.sqrt(dx * dx + dy * dy)
                    if (dist < MOUSE_DIST) {
                        ctx.strokeStyle = '#00e5ff'
                        ctx.globalAlpha = (1 - dist / MOUSE_DIST) * 0.5
                        ctx.lineWidth = 0.8
                        ctx.beginPath()
                        ctx.moveTo(nodes[i].x, nodes[i].y)
                        ctx.lineTo(mouse.x, mouse.y)
                        ctx.stroke()
                    }
                }
            }
            ctx.globalAlpha = 1

            nodes.forEach(n => {
                const pr = n.r + Math.sin(n.pulse) * 0.6
                ctx.beginPath()
                ctx.arc(n.x, n.y, Math.max(pr, 0.6), 0, Math.PI * 2)
                ctx.fillStyle = n.color
                ctx.shadowBlur = 10
                ctx.shadowColor = n.color
                ctx.fill()
                ctx.shadowBlur = 0
            })

            if (mouse.active) {
                ctx.beginPath()
                ctx.arc(mouse.x, mouse.y, 3, 0, Math.PI * 2)
                ctx.fillStyle = '#fff'
                ctx.shadowBlur = 14
                ctx.shadowColor = '#00e5ff'
                ctx.fill()
                ctx.shadowBlur = 0
            }

            animationId = requestAnimationFrame(render)
        }

        render()

        const handleResize = () => {
            const rect = container.getBoundingClientRect()
            nodes = Array.from({ length: Math.round((rect.width * rect.height) / 26000) }, () => new Node())
            resize()
            buildWorldMap()
            buildBinaryCols()
        }

        window.addEventListener('resize', handleResize)

        return () => {
            window.removeEventListener('resize', resize)
            window.removeEventListener('resize', handleResize)
            window.removeEventListener('resize', buildWorldMap)
            window.removeEventListener('resize', buildBinaryCols)
            container.removeEventListener('mousemove', handleMouseMove)
            container.removeEventListener('mouseleave', handleMouseLeave)
            if (animationId) cancelAnimationFrame(animationId)
        }
    }, [])

    return (
        <div className="relative w-full h-[600px] lg:h-[700px] overflow-hidden bg-[#05070d]">
            {/* Background container with gradient */}
            <div
                ref={containerRef}
                className="absolute inset-0"
                style={{
                    background: `
                radial-gradient(ellipse 120% 80% at 50% -10%, rgba(59,130,246,0.16), transparent 60%),
                radial-gradient(ellipse 100% 60% at 95% 100%, rgba(139,92,246,0.14), transparent 60%),
                radial-gradient(ellipse 60% 50% at 0% 100%, rgba(236,72,153,0.08), transparent 60%),
                #05070d
              `
                }}
            >
                <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

                {/* Vignette overlay */}
                <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_74%_58%_at_50%_46%,transparent_25%,rgba(5,7,13,0.6)_100%)]" />

                {/* Overlay Cards - Time Series */}
                <div className="absolute top-[96px] left-[24px] z-10 pointer-events-none animate-float-slow">
                    <div className="bg-[rgba(10,14,26,0.82)] border border-[rgba(255,255,255,0.09)] rounded-xl p-3 backdrop-blur-[14px] shadow-xl w-[280px]">
                        <div className="flex items-center gap-1.5 text-[10px] font-semibold text-[#7fe3f0] uppercase tracking-[0.08em] mb-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#00e5ff] shadow-[0_0_6px_#00e5ff] animate-pulse-dot" />
                            Time Series Forecast
                        </div>
                        <svg className="w-full h-20" viewBox="0 0 260 84" preserveAspectRatio="none">
                            <polyline className="fill-none stroke-[#00e5ff] stroke-2 drop-shadow-[0_0_4px_rgba(0,229,255,0.7)] [stroke-dasharray:520] [stroke-dashoffset:520] animate-draw-line"
                                points="0,58 20,52 40,60 60,38 80,48 100,26 120,42 140,18 160,32 180,10 200,24" />
                            <polyline className="fill-none stroke-[#8b5cf6] stroke-2 stroke-dash-[5_4] opacity-85 drop-shadow-[0_0_3px_rgba(139,92,246,0.6)]"
                                points="180,10 200,24 220,16 240,28 258,14" />
                        </svg>
                        <div className="flex justify-between text-[8px] text-[#8fa3c4] mt-1">
                            <span>Jan</span><span>Jun</span><span>Dec</span>
                        </div>
                    </div>
                </div>

                {/* Correlation Matrix */}
                <div className="absolute top-[82px] right-[280px] z-10 pointer-events-none animate-float-slow" style={{ animationDelay: '0.8s' }}>
                    <div className="bg-[rgba(10,14,26,0.82)] border border-[rgba(255,255,255,0.09)] rounded-xl p-3 backdrop-blur-[14px] shadow-xl w-[200px]">
                        <div className="flex items-center gap-1.5 text-[10px] font-semibold text-[#7fe3f0] uppercase tracking-[0.08em] mb-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#8b5cf6] shadow-[0_0_6px_#8b5cf6] animate-pulse-dot" />
                            Correlation Matrix
                        </div>
                        <div className="grid grid-cols-6 gap-0.5">
                            {[
                                [1, .7, .4, .2, .1, .05],
                                [.7, 1, .6, .3, .15, .1],
                                [.4, .6, 1, .5, .25, .12],
                                [.2, .3, .5, 1, .55, .3],
                                [.1, .15, .25, .55, 1, .6],
                                [.05, .1, .12, .3, .6, 1]
                            ].map((row, i) =>
                                row.map((v, j) => {
                                    const useViolet = (i + j) % 2 === 0
                                    const base = useViolet ? [139, 92, 246] : [0, 229, 255]
                                    return (
                                        <div
                                            key={`${i}-${j}`}
                                            className="aspect-square rounded-[2px] animate-cell-pulse"
                                            style={{
                                                background: `rgba(${base[0]},${base[1]},${base[2]},${0.15 + v * 0.65})`,
                                                animationDelay: `${(i * 6 + j) * 0.12}s`
                                            }}
                                        />
                                    )
                                })
                            )}
                        </div>
                    </div>
                </div>

                {/* Scatter Plot */}
                <div className="absolute top-[330px] right-[24px] z-10 pointer-events-none animate-float-slow" style={{ animationDelay: '1.6s' }}>
                    <div className="bg-[rgba(10,14,26,0.82)] border border-[rgba(255,255,255,0.09)] rounded-xl p-3 backdrop-blur-[14px] shadow-xl w-[210px]">
                        <div className="flex items-center gap-1.5 text-[10px] font-semibold text-[#7fe3f0] uppercase tracking-[0.08em] mb-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#00e5ff] shadow-[0_0_6px_#00e5ff] animate-pulse-dot" />
                            Scatter Plot
                        </div>
                        <svg className="w-full h-[110px]" viewBox="0 0 210 110">
                            <line x1="8" y1="96" x2="200" y2="14" className="stroke-[#3b82f6] stroke-[1.4] opacity-80" />
                            {Array.from({ length: 26 }, (_, i) => {
                                const t = i / 25
                                const x = 8 + t * 192 + (Math.random() * 16 - 8)
                                const y = 96 - t * 82 + (Math.random() * 18 - 9)
                                return (
                                    <circle
                                        key={i}
                                        cx={x}
                                        cy={y}
                                        r="2.6"
                                        fill={i % 3 === 0 ? '#8b5cf6' : '#00e5ff'}
                                        opacity="0.85"
                                        className="animate-dot-float"
                                        style={{ animationDelay: `${Math.random() * 3}s` }}
                                    />
                                )
                            })}
                        </svg>
                    </div>
                </div>

                {/* Distribution */}
                <div className="absolute bottom-[78px] left-[24px] z-10 pointer-events-none animate-float-slow" style={{ animationDelay: '2.2s' }}>
                    <div className="bg-[rgba(10,14,26,0.82)] border border-[rgba(255,255,255,0.09)] rounded-xl p-3 backdrop-blur-[14px] shadow-xl w-[210px]">
                        <div className="flex items-center gap-1.5 text-[10px] font-semibold text-[#7fe3f0] uppercase tracking-[0.08em] mb-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#8b5cf6] shadow-[0_0_6px_#8b5cf6] animate-pulse-dot" />
                            Distribution
                        </div>
                        <svg className="w-full h-[90px]" viewBox="0 0 210 90">
                            {[8, 14, 22, 34, 48, 62, 74, 80, 70, 56, 40, 26, 16, 9, 6].map((h, i) => {
                                const bw = 210 / 15
                                return (
                                    <rect
                                        key={i}
                                        x={i * bw + 1}
                                        y={80 - h}
                                        width={bw - 2}
                                        height={h}
                                        className="fill-[#3b82f6] opacity-55 origin-bottom animate-bar-pulse"
                                        style={{ animationDelay: `${i * 0.15}s` }}
                                    />
                                )
                            })}
                            <path
                                d="M0,74 C 40,74 55,6 105,6 S 170,74 210,74"
                                className="fill-none stroke-[#00e5ff] stroke-[1.6] drop-shadow-[0_0_3px_rgba(0,229,255,0.6)]"
                            />
                        </svg>
                    </div>
                </div>

                {/* Model Performance */}
                <div className="absolute bottom-[78px] left-[264px] z-10 pointer-events-none animate-float-slow" style={{ animationDelay: '1.1s' }}>
                    <div className="bg-[rgba(10,14,26,0.82)] border border-[rgba(255,255,255,0.09)] rounded-xl p-3 backdrop-blur-[14px] shadow-xl w-[210px]">
                        <div className="flex items-center gap-1.5 text-[10px] font-semibold text-[#7fe3f0] uppercase tracking-[0.08em] mb-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#00e5ff] shadow-[0_0_6px_#00e5ff] animate-pulse-dot" />
                            Model Performance
                        </div>
                        <div className="flex items-center gap-2.5">
                            <div className="w-[76px] h-[76px] rounded-full flex-none bg-[conic-gradient(#00e5ff_0%_98.5%,rgba(255,255,255,0.08)_98.5%_100%)] flex items-center justify-center relative animate-glow-pulse">
                                <div className="absolute inset-[9px] rounded-full bg-[#0c1120]" />
                                <span className="relative z-10 font-bold text-[13px] text-white">98.5%</span>
                            </div>
                            <div className="text-[10px] leading-[1.9] text-[#8fa3c4]">
                                <div><span className="inline-block w-1.5 h-1.5 rounded-full bg-[#00e5ff] mr-1.5" />Accuracy<span className="val float-right ml-2.5 text-[#e7f0ff] font-semibold">98.5%</span></div>
                                <div><span className="inline-block w-1.5 h-1.5 rounded-full bg-[#3b82f6] mr-1.5" />Precision<span className="val float-right ml-2.5 text-[#e7f0ff] font-semibold">97.6%</span></div>
                                <div><span className="inline-block w-1.5 h-1.5 rounded-full bg-[#8b5cf6] mr-1.5" />Recall<span className="val float-right ml-2.5 text-[#e7f0ff] font-semibold">97.2%</span></div>
                                <div><span className="inline-block w-1.5 h-1.5 rounded-full bg-[#ec4899] mr-1.5" />F1 Score<span className="val float-right ml-2.5 text-[#e7f0ff] font-semibold">97.4%</span></div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Feature Importance */}
                <div className="absolute bottom-[78px] right-[280px] z-10 pointer-events-none animate-float-slow" style={{ animationDelay: '2.8s' }}>
                    <div className="bg-[rgba(10,14,26,0.82)] border border-[rgba(255,255,255,0.09)] rounded-xl p-3 backdrop-blur-[14px] shadow-xl w-[200px]">
                        <div className="flex items-center gap-1.5 text-[10px] font-semibold text-[#7fe3f0] uppercase tracking-[0.08em] mb-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#8b5cf6] shadow-[0_0_6px_#8b5cf6] animate-pulse-dot" />
                            Feature Importance
                        </div>
                        {[
                            ['X1', 0.92],
                            ['X2', 0.78],
                            ['X3', 0.63],
                            ['X4', 0.51],
                            ['X5', 0.34]
                        ].map(([label, val], i) => (
                            <div key={i} className="flex items-center gap-1.5 my-1.25 text-[9px] text-[#8fa3c4]">
                                <span style={{ width: '16px' }}>{label}</span>
                                <div className="flex-1 h-1.5 rounded-[3px] bg-[rgba(255,255,255,0.06)] overflow-hidden">
                                    <div
                                        className="h-full rounded-[3px] bg-gradient-to-r from-[#3b82f6] to-[#00e5ff] animate-feat-pulse"
                                        style={{ width: `${val * 100}%`, animationDelay: `${i * 0.3}s` }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* ROC Curve */}
                <div className="absolute bottom-[78px] right-[24px] z-10 pointer-events-none animate-float-slow" style={{ animationDelay: '0.4s' }}>
                    <div className="bg-[rgba(10,14,26,0.82)] border border-[rgba(255,255,255,0.09)] rounded-xl p-3 backdrop-blur-[14px] shadow-xl w-[200px]">
                        <div className="flex items-center gap-1.5 text-[10px] font-semibold text-[#7fe3f0] uppercase tracking-[0.08em] mb-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#00e5ff] shadow-[0_0_6px_#00e5ff] animate-pulse-dot" />
                            ROC Curve
                        </div>
                        <svg className="w-full h-[100px]" viewBox="0 0 200 100" preserveAspectRatio="none">
                            <line x1="0" y1="100" x2="200" y2="0" className="stroke-[rgba(255,255,255,0.18)] stroke-[1] stroke-dash-[3_3]" />
                            <path d="M0,100 C 20,40 60,10 200,2" className="fill-none stroke-[#8b5cf6] stroke-2 drop-shadow-[0_0_4px_rgba(139,92,246,0.7)]" id="rocPath" />
                            <circle r="3.4" fill="#fff" className="drop-shadow-[0_0_5px_#00e5ff]">
                                <animateMotion dur="3.5s" repeatCount="indefinite" rotate="auto">
                                    <mpath href="#rocPath" />
                                </animateMotion>
                            </circle>
                        </svg>
                        <div className="text-[10px] text-[#8fa3c4] mt-0.5 text-right">AUC = 0.96</div>
                    </div>
                </div>

                {/* Code Panel */}
                <div className="absolute top-[420px] right-[24px] z-10 pointer-events-none animate-float-slow" style={{ animationDelay: '1.9s' }}>
                    <div className="bg-[rgba(10,14,26,0.82)] border border-[rgba(255,255,255,0.09)] rounded-xl p-3 backdrop-blur-[14px] shadow-xl w-[250px] font-mono text-[10.5px] leading-[1.65] overflow-hidden relative">
                        <div className="flex items-center gap-1.5 text-[10px] font-semibold text-[#7fe3f0] uppercase tracking-[0.08em] mb-2 font-sans">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#00e5ff] shadow-[0_0_6px_#00e5ff] animate-pulse-dot" />
                            model.py
                        </div>
                        <div className="absolute left-0 right-0 h-[18px] bg-gradient-to-b from-transparent via-[rgba(0,229,255,0.10)] to-transparent animate-scan" />
                        <div><span className="text-[#8b5cf6]">import</span> pandas <span className="text-[#8b5cf6]">as</span> <span className="text-[#00e5ff]">pd</span></div>
                        <div><span className="text-[#8b5cf6]">import</span> numpy <span className="text-[#8b5cf6]">as</span> <span className="text-[#00e5ff]">np</span></div>
                        <div><span className="text-[#8b5cf6]">import</span> statsmodels.api <span className="text-[#8b5cf6]">as</span> <span className="text-[#00e5ff]">sm</span></div>
                        <div>&nbsp;</div>
                        <div className="text-[#8fa3c4]"># fit the model</div>
                        <div>df = pd.<span className="text-[#00e5ff]">read_csv</span>(<span className="text-[#f59e0b]">'data.csv'</span>)</div>
                        <div>model = sm.<span className="text-[#00e5ff]">OLS</span>(y, X).<span className="text-[#00e5ff]">fit</span>()</div>
                        <div><span className="text-[#00e5ff]">print</span>(model.summary())<span className="inline-block w-1.5 h-[11px] bg-[#00e5ff] align-middle animate-blink" /></div>
                    </div>
                </div>

                {/* Software Badges */}
                <div className="absolute top-[404px] left-[24px] z-10 pointer-events-none animate-float-slow" style={{ animationDelay: '0.6s' }}>
                    <div className="grid grid-cols-4 gap-2 w-[240px]">
                        {[
                            ['R', '#e5e7eb'],
                            ['Py', '#00e5ff'],
                            ['SPSS', '#ec4899'],
                            ['Stata', '#f59e0b'],
                            ['PLS', '#8b5cf6'],
                            ['✚', '#22c55e'],
                            ['▤', '#3b82f6'],
                            ['◍', '#00e5ff'],
                            ['Q', '#8b5cf6'],
                            ['SQL', '#3b82f6']
                        ].map(([label, color], i) => (
                            <div
                                key={i}
                                className="aspect-square rounded-[10px] bg-[rgba(10,14,26,0.82)] border border-[rgba(255,255,255,0.09)] flex items-center justify-center text-[10.5px] font-bold tracking-[0.02em] backdrop-blur-[10px] animate-badge-bob"
                                style={{ color, animationDelay: `${i * 0.25}s` }}
                            >
                                {label}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Equations */}
                <div className="absolute top-[118px] left-[346px] z-10 pointer-events-none" style={{ animation: 'none' }}>
                    <div className="font-serif italic">
                        <div className="text-[14px] text-[#bfe3ff] opacity-0 animate-eq-fade mb-2.5" style={{ animationDelay: '0s' }}>
                            Y = β<sub>0</sub> + β<sub>1</sub>X + ε
                        </div>
                        <div className="text-[12.5px] text-[#c9bfff] opacity-0 animate-eq-fade mb-2.5" style={{ animationDelay: '2.2s' }}>
                            R² = 0.94&nbsp;&nbsp;&nbsp;P &lt; 0.05
                        </div>
                        <div className="text-[12.5px] text-[#c9bfff] opacity-0 animate-eq-fade mb-2.5" style={{ animationDelay: '4.4s' }}>
                            χ², df = 24
                        </div>
                    </div>
                </div>

                {/* Hero Content - Overlaid on top of everything */}
                <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center px-4 pointer-events-none">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="max-w-3xl"
                    >
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.4 }}
                            className="text-[#00e5ff] text-xs sm:text-sm tracking-[0.3em] uppercase mb-4 opacity-85"
                        >
                            Data Analysis Services
                        </motion.p>
                        <motion.h1
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="text-3xl sm:text-5xl lg:text-6xl font-bold leading-[1.1] max-w-[16ch] mx-auto"
                            style={{
                                background: 'linear-gradient(120deg, #ffffff 20%, #00e5ff 55%, #8b5cf6 100%)',
                                WebkitBackgroundClip: 'text',
                                backgroundClip: 'text',
                                color: 'transparent'
                            }}
                        >
                            Your data, always in motion
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                            className="mt-4 text-[#9fb3d1] max-w-[42ch] mx-auto text-sm sm:text-base leading-relaxed"
                        >
                            Expert statistical consulting and research support for academic,
                            corporate, and organizational success
                        </motion.p>
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6 }}
                            className="mt-8 pointer-events-auto"
                        >
                            <motion.a
                                href="tel:+255717275661"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="inline-flex items-center gap-2 px-6 py-3 bg-white text-blue-600 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all"
                            >
                                Start Your Project with us + (255) 717 275 661
                            </motion.a>
                        </motion.div>
                    </motion.div>
                </div>
            </div>

            {/* Tailwind animations - injected via style since we need custom keyframes */}
            <style jsx>{`
                @keyframes float-slow {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-8px); }
                }
                .animate-float-slow {
                    animation: float-slow 7s ease-in-out infinite;
                }
                @keyframes pulse-dot {
                    0%, 100% { opacity: 1; transform: scale(1); }
                    50% { opacity: 0.4; transform: scale(0.7); }
                }
                .animate-pulse-dot {
                    animation: pulse-dot 1.8s ease-in-out infinite;
                }
                @keyframes draw-line {
                    0% { stroke-dashoffset: 520; }
                    55% { stroke-dashoffset: 0; }
                    100% { stroke-dashoffset: 0; }
                }
                .animate-draw-line {
                    animation: draw-line 5s ease-in-out infinite;
                }
                @keyframes cell-pulse {
                    0%, 100% { filter: brightness(1); }
                    50% { filter: brightness(1.35); }
                }
                .animate-cell-pulse {
                    animation: cell-pulse 4s ease-in-out infinite;
                }
                @keyframes dot-float {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-2.5px); }
                }
                .animate-dot-float {
                    animation: dot-float 3.6s ease-in-out infinite;
                }
                @keyframes bar-pulse {
                    0%, 100% { transform: scaleY(1); }
                    50% { transform: scaleY(1.12); }
                }
                .animate-bar-pulse {
                    animation: bar-pulse 3s ease-in-out infinite;
                }
                @keyframes glow-pulse {
                    0%, 100% { filter: drop-shadow(0 0 3px rgba(0,229,255,0.5)); }
                    50% { filter: drop-shadow(0 0 10px rgba(0,229,255,0.9)); }
                }
                .animate-glow-pulse {
                    animation: glow-pulse 3.4s ease-in-out infinite;
                }
                @keyframes feat-pulse {
                    0%, 100% { filter: brightness(1); }
                    50% { filter: brightness(1.3); }
                }
                .animate-feat-pulse {
                    animation: feat-pulse 3.2s ease-in-out infinite;
                }
                @keyframes badge-bob {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-5px); }
                }
                .animate-badge-bob {
                    animation: badge-bob 4s ease-in-out infinite;
                }
                @keyframes eq-fade {
                    0%, 100% { opacity: 0; transform: translateY(4px); }
                    15%, 40% { opacity: 0.65; transform: translateY(0); }
                    55% { opacity: 0; }
                }
                .animate-eq-fade {
                    animation: eq-fade 9s ease-in-out infinite;
                }
                @keyframes scan {
                    0% { top: -18px; }
                    100% { top: 100%; }
                }
                .animate-scan {
                    animation: scan 4.5s linear infinite;
                }
                @keyframes blink {
                    50% { opacity: 0; }
                }
                .animate-blink {
                    animation: blink 1s step-end infinite;
                }
                .val {
                    float: right;
                    margin-left: 10px;
                }
            `}</style>
        </div>
    )
}