import { useEffect, useRef } from 'react';
import './Balatro.css';

export default function Balatro({
  spinRotation = -2,
  spinSpeed = 7,
  color1 = '#f7b8d7',
  color2 = '#ffffff',
  color3 = '#162325',
  contrast = 3.5,
  lighting = 0.4,
  spinAmount = 0.25,
  pixelFilter = 745,
}) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
    if (!gl) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    function resize() {
      const rect = canvas.parentElement.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      canvas.style.width = rect.width + 'px';
      canvas.style.height = rect.height + 'px';
      gl.viewport(0, 0, canvas.width, canvas.height);
    }
    resize();
    window.addEventListener('resize', resize);

    function hexToVec3(hex) {
      const r = parseInt(hex.slice(1, 3), 16) / 255;
      const g = parseInt(hex.slice(3, 5), 16) / 255;
      const b = parseInt(hex.slice(5, 7), 16) / 255;
      return [r, g, b];
    }

    const vertexShaderSource = `
      attribute vec2 a_position;
      void main() {
        gl_Position = vec4(a_position, 0.0, 1.0);
      }
    `;

    const fragmentShaderSource = `
      precision highp float;
      
      uniform float u_time;
      uniform vec2 u_resolution;
      uniform float u_spin_rotation;
      uniform float u_spin_speed;
      uniform vec3 u_color1;
      uniform vec3 u_color2;
      uniform vec3 u_color3;
      uniform float u_contrast;
      uniform float u_lighting;
      uniform float u_spin_amount;
      uniform float u_pixel_filter;
      
      #define SPIN_EASE 0.5
      #define PI 3.14159265359
      
      void main() {
        float pixel_size = length(u_resolution.xy) / u_pixel_filter;
        vec2 uv = (floor(gl_FragCoord.xy / pixel_size) * pixel_size - 0.5 * u_resolution.xy) / length(u_resolution.xy);
        
        float uv_len = length(uv);
        
        float speed = (u_spin_rotation * SPIN_EASE * 0.2 + 0.2) * u_time + 302.2;
        float new_pixel_angle = atan(uv.y, uv.x) + speed - SPIN_EASE * 20.0 * (1.0 * u_spin_amount * uv_len + (1.0 - 1.0 * u_spin_amount));
        
        vec2 mid = (u_resolution.xy / length(u_resolution.xy)) / 2.0;
        uv = vec2((uv_len * cos(new_pixel_angle) + mid.x), (uv_len * sin(new_pixel_angle) + mid.y)) - mid;
        
        uv *= 30.0;
        speed = u_time * u_spin_speed;
        
        vec2 uv2 = vec2(uv.x + uv.y);
        
        for(int i = 0; i < 5; i++) {
          uv2 += sin(max(uv.x, uv.y)) + uv;
          uv += 0.5 * vec2(
            cos(5.1123314 + 0.353 * uv2.y + speed * 0.131121),
            sin(uv2.x - 0.113 * speed)
          );
          uv -= 1.0 * cos(uv.x + uv.y) - 1.0 * sin(uv.x * 0.711 - uv.y);
        }
        
        float contrast_mod = (0.25 * u_contrast + 0.5 * u_spin_amount + 1.2);
        float paint_res = min(2.0, max(0.0, length(uv) * (0.035) * contrast_mod));
        float c1p = max(0.0, 1.0 - contrast_mod * abs(1.0 - paint_res));
        float c2p = max(0.0, 1.0 - contrast_mod * abs(paint_res));
        float c3p = 1.0 - min(1.0, c1p + c2p);
        
        float lights = 0.5 + 0.5 * sin(speed * 0.02);
        
        vec3 color = u_lighting * (
          (0.3 + 0.5 * lights) * (
            c1p * u_color1 +
            c2p * u_color2 +
            (c3p * u_color3 * (1.0 + lights * 1.5))
          )
        ) + (1.0 - u_lighting) * (
          c1p * u_color1 +
          c2p * u_color2 +
          c3p * u_color3
        );
        
        gl_FragColor = vec4(color, 1.0);
      }
    `;

    function createShader(type, source) {
      const shader = gl.createShader(type);
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error('Shader error:', gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    }

    const vs = createShader(gl.VERTEX_SHADER, vertexShaderSource);
    const fs = createShader(gl.FRAGMENT_SHADER, fragmentShaderSource);
    if (!vs || !fs) return;

    const program = gl.createProgram();
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error('Program link error:', gl.getProgramInfoLog(program));
      return;
    }

    const vertices = new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]);
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    const posLoc = gl.getAttribLocation(program, 'a_position');
    gl.enableVertexAttribArray(posLoc);
    gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

    gl.useProgram(program);

    const uTime = gl.getUniformLocation(program, 'u_time');
    const uResolution = gl.getUniformLocation(program, 'u_resolution');
    const uSpinRotation = gl.getUniformLocation(program, 'u_spin_rotation');
    const uSpinSpeed = gl.getUniformLocation(program, 'u_spin_speed');
    const uColor1 = gl.getUniformLocation(program, 'u_color1');
    const uColor2 = gl.getUniformLocation(program, 'u_color2');
    const uColor3 = gl.getUniformLocation(program, 'u_color3');
    const uContrast = gl.getUniformLocation(program, 'u_contrast');
    const uLighting = gl.getUniformLocation(program, 'u_lighting');
    const uSpinAmount = gl.getUniformLocation(program, 'u_spin_amount');
    const uPixelFilter = gl.getUniformLocation(program, 'u_pixel_filter');

    const c1 = hexToVec3(color1);
    const c2 = hexToVec3(color2);
    const c3 = hexToVec3(color3);

    gl.uniform1f(uSpinRotation, spinRotation);
    gl.uniform1f(uSpinSpeed, spinSpeed);
    gl.uniform3f(uColor1, c1[0], c1[1], c1[2]);
    gl.uniform3f(uColor2, c2[0], c2[1], c2[2]);
    gl.uniform3f(uColor3, c3[0], c3[1], c3[2]);
    gl.uniform1f(uContrast, contrast);
    gl.uniform1f(uLighting, lighting);
    gl.uniform1f(uSpinAmount, spinAmount);
    gl.uniform1f(uPixelFilter, pixelFilter);

    let raf;
    const startTime = performance.now();

    function render() {
      const t = (performance.now() - startTime) / 1000;
      gl.uniform1f(uTime, t);
      gl.uniform2f(uResolution, canvas.width, canvas.height);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      raf = requestAnimationFrame(render);
    }
    render();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      gl.deleteProgram(program);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
      gl.deleteBuffer(buffer);
    };
  }, [spinRotation, spinSpeed, color1, color2, color3, contrast, lighting, spinAmount, pixelFilter]);

  return <canvas ref={canvasRef} className="balatro-canvas" />;
}
