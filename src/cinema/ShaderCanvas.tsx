'use client'

import { useEffect, useRef, type RefObject } from 'react'
import { useReducedMotion } from '@/lib/motion'
import { FRAGMENT, VERTEX, type ShaderName } from './shaders'
import s from './cinema.module.css'

type Props = {
  shader: ShaderName
  /** Pointer position over the scene, 0–1 from bottom-left. Written by the parent, read every frame. */
  pointer?: RefObject<[number, number]>
  /** [inner, outer] hex colours for `film` and `mem`. Changing them dissolves from the old pair. */
  colors?: [string, string]
}

const rgb = (hex: string) => {
  const h = hex.replace('#', '')
  return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16) / 255) as [number, number, number]
}

const UNIFORMS = ['uRes', 'uTime', 'uMouse', 'uScroll', 'uA1', 'uB1', 'uA2', 'uB2', 'uMix'] as const

/**
 * A full-bleed WebGL background. It renders only while on screen and the tab
 * is visible, caps the pixel ratio, and with reduced motion draws one still
 * frame. If WebGL is unavailable, software-only or too slow on this device,
 * the CSS background behind it shows instead.
 */
export function ShaderCanvas({ shader, pointer, colors }: Props) {
  const ref = useRef<HTMLCanvasElement>(null)
  const reduced = useReducedMotion()
  const latest = useRef(colors)
  const redraw = useRef<() => void>(() => {})
  latest.current = colors

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    let gl: WebGLRenderingContext | null = null
    try {
      // Refuse software-rendered WebGL: without a GPU these shaders would run on the CPU and stall the page.
      gl = canvas.getContext('webgl', { antialias: false, alpha: false, powerPreference: 'low-power', failIfMajorPerformanceCaveat: true })
    } catch {
      gl = null
    }
    if (!gl) {
      canvas.style.visibility = 'hidden'
      return
    }
    // Some browsers hand out a software renderer without flagging it; recognise the common ones by name.
    const info = gl.getExtension('WEBGL_debug_renderer_info')
    const renderer = info ? String(gl.getParameter(info.UNMASKED_RENDERER_WEBGL)) : ''
    if (/swiftshader|llvmpipe|software|basic render/i.test(renderer)) {
      canvas.style.visibility = 'hidden'
      return
    }
    // A canvas hands out one context for life, so it is reused if this effect runs again and never force-lost.
    const g = gl

    const compile = (type: number, src: string) => {
      const sh = g.createShader(type)!
      g.shaderSource(sh, src)
      g.compileShader(sh)
      return g.getShaderParameter(sh, g.COMPILE_STATUS) ? sh : null
    }
    const vs = compile(g.VERTEX_SHADER, VERTEX)
    const fs = compile(g.FRAGMENT_SHADER, FRAGMENT[shader])
    const program = g.createProgram()!
    if (vs && fs) {
      g.attachShader(program, vs)
      g.attachShader(program, fs)
      g.linkProgram(program)
    }
    if (!vs || !fs || !g.getProgramParameter(program, g.LINK_STATUS)) {
      canvas.style.visibility = 'hidden'
      return
    }
    g.bindBuffer(g.ARRAY_BUFFER, g.createBuffer())
    g.bufferData(g.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), g.STATIC_DRAW)
    const loc = g.getAttribLocation(program, 'p')
    g.enableVertexAttribArray(loc)
    g.vertexAttribPointer(loc, 2, g.FLOAT, false, 0, 0)
    g.useProgram(program)
    const u = Object.fromEntries(UNIFORMS.map((k) => [k, g.getUniformLocation(program, k)])) as Record<(typeof UNIFORMS)[number], WebGLUniformLocation | null>

    // Colour dissolve state.
    let from = latest.current
    let to = latest.current
    let t0 = -10
    // Phones get a lower pixel ratio: the shaders are fill-rate bound.
    const dpr = Math.min(window.devicePixelRatio || 1, window.innerWidth < 800 ? 1 : 1.5)

    const draw = (t: number) => {
      const w = Math.max(1, Math.round(canvas.clientWidth * dpr))
      const h = Math.max(1, Math.round(canvas.clientHeight * dpr))
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w
        canvas.height = h
      }
      g.viewport(0, 0, w, h)
      g.uniform2f(u.uRes, w, h)
      g.uniform1f(u.uTime, t)
      const m = pointer?.current
      if (m) g.uniform2f(u.uMouse, m[0], m[1])
      if (shader === 'hero') {
        const r = canvas.getBoundingClientRect()
        g.uniform1f(u.uScroll, Math.min(1, Math.max(0, -r.top / Math.max(1, r.height))))
      }
      const next = latest.current
      if (next && to && from) {
        if (next[0] !== to[0] || next[1] !== to[1]) {
          from = to
          to = next
          t0 = t
        }
        const a1 = rgb(from[0]), b1 = rgb(from[1]), a2 = rgb(to[0]), b2 = rgb(to[1])
        g.uniform3f(u.uA1, ...a1)
        g.uniform3f(u.uA2, ...a2)
        g.uniform3f(u.uB1, ...b1)
        g.uniform3f(u.uB2, ...b2)
        g.uniform1f(u.uMix, reduced ? 1 : Math.min(1, (t - t0) / 0.9))
      }
      g.drawArrays(g.TRIANGLES, 0, 3)
    }

    if (reduced) {
      draw(2)
      redraw.current = () => draw(2)
      return () => {
        redraw.current = () => {}
      }
    }

    let visible = false
    let raf = 0
    let last = 0
    let slow = 0
    let stopped = false
    const loop = (ms: number) => {
      if (stopped) return
      raf = requestAnimationFrame(loop)
      if (document.hidden) return
      // Watchdog: if the device cannot keep up (8 frames in a row slower than 24fps), fall back to the CSS background.
      slow = last && ms - last > 42 ? slow + 1 : 0
      last = ms
      if (slow >= 8) {
        stopped = true
        cancelAnimationFrame(raf)
        canvas.style.visibility = 'hidden'
        return
      }
      draw(ms / 1000)
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting === visible) return
        visible = entry.isIntersecting
        last = 0
        slow = 0
        if (visible && !stopped) raf = requestAnimationFrame(loop)
        else cancelAnimationFrame(raf)
      },
      { rootMargin: '120px' },
    )
    io.observe(canvas)

    return () => {
      io.disconnect()
      cancelAnimationFrame(raf)
    }
  }, [shader, pointer, reduced])

  // With reduced motion nothing loops, so repaint the still frame when the colours change.
  useEffect(() => {
    if (reduced) redraw.current()
  }, [reduced, colors?.[0], colors?.[1]])

  return <canvas ref={ref} className={s.gl} aria-hidden="true" />
}
