"use client";

import { useEffect, useRef } from "react";

// Subtle animated ocean/dark shader on a canvas element
export default function ShaderBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const gl = canvas.getContext("webgl");
    if (!gl) return;

    const vert = `
      attribute vec2 a_position;
      void main() {
        gl_Position = vec4(a_position, 0.0, 1.0);
      }
    `;

    const frag = `
      precision mediump float;
      uniform float u_time;
      uniform vec2  u_resolution;

      // cheap noise
      float hash(vec2 p) {
        return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
      }
      float noise(vec2 p) {
        vec2 i = floor(p), f = fract(p);
        vec2 u = f * f * (3.0 - 2.0 * f);
        return mix(mix(hash(i), hash(i+vec2(1,0)), u.x),
                   mix(hash(i+vec2(0,1)), hash(i+vec2(1,1)), u.x), u.y);
      }
      float fbm(vec2 p) {
        float v = 0.0, a = 0.5;
        for (int i = 0; i < 5; i++) {
          v += a * noise(p);
          p *= 2.0;
          a *= 0.5;
        }
        return v;
      }

      void main() {
        vec2 uv = gl_FragCoord.xy / u_resolution;
        uv.x *= u_resolution.x / u_resolution.y;

        float t = u_time * 0.06;

        // Slowly shifting FBM noise
        vec2 q = vec2(fbm(uv + t * 0.4), fbm(uv + vec2(1.0)));
        vec2 r = vec2(fbm(uv + q + vec2(1.7, 9.2) + t * 0.15),
                      fbm(uv + q + vec2(8.3, 2.8) + t * 0.12));
        float f = fbm(uv + r);

        // Brand palette: deep navy → dark blue → hint of royal
        vec3 col1 = vec3(0.004, 0.055, 0.075);  // #010E13 deep teal-black
        vec3 col2 = vec3(0.020, 0.180, 0.247);  // #052E3F dark teal  
        vec3 col3 = vec3(0.039, 0.361, 0.447);  // #0A5C72 deep teal
        vec3 col4 = vec3(0.094, 0.627, 0.753);  // #18A0C0 teal hint

        vec3 color = mix(col1, col2, clamp(f * 2.0, 0.0, 1.0));
        color = mix(color, col3, clamp(f * f * 4.0, 0.0, 0.4));
        color = mix(color, col4, clamp(pow(f, 3.0) * 5.0, 0.0, 0.15));

        // Vignette — darken edges
        vec2 uvv = (gl_FragCoord.xy / u_resolution) * 2.0 - 1.0;
        float vign = 1.0 - dot(uvv * 0.6, uvv * 0.6);
        color *= clamp(vign, 0.2, 1.0);

        gl_FragColor = vec4(color, 1.0);
      }
    `;

    function compileShader(type: number, src: string) {
      const shader = gl!.createShader(type)!;
      gl!.shaderSource(shader, src);
      gl!.compileShader(shader);
      return shader;
    }

    const program = gl.createProgram()!;
    gl.attachShader(program, compileShader(gl.VERTEX_SHADER, vert));
    gl.attachShader(program, compileShader(gl.FRAGMENT_SHADER, frag));
    gl.linkProgram(program);
    gl.useProgram(program);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
      gl.STATIC_DRAW
    );

    const pos = gl.getAttribLocation(program, "a_position");
    gl.enableVertexAttribArray(pos);
    gl.vertexAttribPointer(pos, 2, gl.FLOAT, false, 0, 0);

    const uTime = gl.getUniformLocation(program, "u_time");
    const uRes  = gl.getUniformLocation(program, "u_resolution");

    let animFrame = 0;
    let start = performance.now();
    let pausedAt = 0;
    let isVisible = true;

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    function resize() {
      if (!canvas) return;
      canvas.width  = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      gl!.viewport(0, 0, canvas.width, canvas.height);
    }

    function drawFrame() {
      if (!canvas) return;
      gl!.uniform1f(uTime, (performance.now() - start) / 1000);
      gl!.uniform2f(uRes, canvas.width, canvas.height);
      gl!.drawArrays(gl!.TRIANGLE_STRIP, 0, 4);
    }

    function render() {
      drawFrame();
      animFrame = requestAnimationFrame(render);
    }

    function play() {
      if (animFrame || reducedMotion) return;
      if (pausedAt) {
        start += performance.now() - pausedAt; // resume without a time jump
        pausedAt = 0;
      }
      animFrame = requestAnimationFrame(render);
    }

    function pause() {
      if (!animFrame) return;
      cancelAnimationFrame(animFrame);
      animFrame = 0;
      pausedAt = performance.now();
    }

    // Only animate while the canvas is on screen and the tab is visible.
    function update() {
      if (isVisible && !document.hidden) play();
      else pause();
    }

    resize();
    window.addEventListener("resize", resize);

    const io = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
        update();
      },
      { threshold: 0 }
    );
    io.observe(canvas);
    document.addEventListener("visibilitychange", update);

    if (reducedMotion) drawFrame(); // single static frame
    else update();

    return () => {
      cancelAnimationFrame(animFrame);
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", update);
      io.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{ display: "block" }}
    />
  );
}
