import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js';

const root = document.querySelector('#historia .historia__wave');
const section = document.getElementById('historia');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const hasWebGL = () => {
  const canvas = document.createElement('canvas');
  return Boolean(canvas.getContext('webgl2') || canvas.getContext('webgl'));
};

if (root && section && hasWebGL()) {
  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: false, powerPreference: 'high-performance' });
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
  const clock = new THREE.Clock();
  const compact = window.matchMedia('(max-width: 780px)').matches;
  let points;
  let material;
  let frameId = 0;
  let isVisible = false;

  renderer.setClearColor(0x000000, 0);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, compact ? 1.25 : 1.5));
  root.appendChild(renderer.domElement);

  const vertexShader = /* glsl */`
    uniform float uTime;
    uniform float uPixelRatio;
    varying float vAlpha;

    void main() {
      vec3 p = position;
      float flow = uTime * 0.34;
      float curlA = sin(p.x * 0.72 + p.y * 0.28 + flow);
      float curlB = sin(p.x * 0.25 - p.y * 0.94 - flow * 0.72);
      float crest = curlA * 0.82 + curlB * 0.46;
      float lowerField = smoothstep(-6.8, 5.8, p.y);

      p.z += crest * 1.35 + sin(p.x * 0.18 + flow * 0.6) * 0.42;
      p.x += sin(p.y * 0.54 + flow * 0.82) * (0.16 + lowerField * 0.44);
      p.y += cos(p.x * 0.42 - flow * 0.56) * 0.22;

      vec4 mvPosition = modelViewMatrix * vec4(p, 1.0);
      float surfaceVariation = 0.5 + 0.5 * sin(p.x * 0.43 + p.y * 0.29 + uTime * 0.1);
      float diameter = mix(1.0, 2.2, surfaceVariation);
      gl_PointSize = diameter * uPixelRatio;
      gl_Position = projectionMatrix * mvPosition;
      vAlpha = 0.42 + lowerField * 0.24;
    }
  `;

  const fragmentShader = /* glsl */`
    varying float vAlpha;

    void main() {
      float distanceToCenter = length(gl_PointCoord - 0.5);
      float particle = 1.0 - smoothstep(0.08, 0.5, distanceToCenter);
      gl_FragColor = vec4(vec3(1.0), particle * vAlpha);
    }
  `;

  const buildField = (width, height) => {
    const aspect = width / height;
    const rows = compact ? 68 : Math.min(148, Math.max(92, Math.round(height / 7)));
    const columns = compact
      ? 90
      : Math.min(208, Math.max(128, Math.round(rows * aspect * 1.22)));
    const total = rows * columns;
    const positions = new Float32Array(total * 3);
    const waveHeight = 14;
    const waveWidth = waveHeight * aspect * 1.22;

    const cellWidth = waveWidth / (columns - 1);
    const cellHeight = waveHeight / (rows - 1);

    for (let row = 0; row < rows; row += 1) {
      for (let column = 0; column < columns; column += 1) {
        const index = row * columns + column;
        const stagger = row % 2 ? 0.5 : 0;
        const noiseX = Math.sin((column + 1.7) * 12.9898 + (row + 2.3) * 78.233) * 43758.5453;
        const noiseY = Math.sin((column + 5.1) * 39.3467 + (row + 1.1) * 11.135) * 24634.6345;
        const jitterX = (noiseX - Math.floor(noiseX) - 0.5) * cellWidth * 0.2;
        const jitterY = (noiseY - Math.floor(noiseY) - 0.5) * cellHeight * 0.2;
        const x = ((column + stagger) / (columns - 1) - 0.5) * waveWidth + jitterX;
        const y = (row / (rows - 1) - 0.5) * waveHeight + jitterY;
        const offset = index * 3;
        positions[offset] = x;
        positions[offset + 1] = y;
        positions[offset + 2] = Math.sin(x * 0.34 + y * 0.18) * 0.28;
      }
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    return geometry;
  };

  const resize = () => {
    const { width, height } = root.getBoundingClientRect();
    if (!width || !height) return;
    camera.aspect = width / height;
    camera.position.set(0, 0, 17);
    camera.lookAt(0, 0, 0);
    camera.updateProjectionMatrix();
    renderer.setSize(width, height, false);
    material.uniforms.uPixelRatio.value = renderer.getPixelRatio();

    const geometry = buildField(width, height);
    if (points) {
      points.geometry.dispose();
      scene.remove(points);
    }
    points = new THREE.Points(geometry, material);
    scene.add(points);
  };

  material = new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader,
    uniforms: {
      uTime: { value: 0 },
      uPixelRatio: { value: renderer.getPixelRatio() }
    },
    transparent: true,
    depthWrite: false,
    blending: THREE.NormalBlending
  });

  const render = () => {
    material.uniforms.uTime.value = clock.getElapsedTime();
    renderer.render(scene, camera);
  };

  const animate = () => {
    render();
    if (isVisible && !reduceMotion) frameId = requestAnimationFrame(animate);
  };

  const observer = new IntersectionObserver(([entry]) => {
    isVisible = entry.isIntersecting;
    if (isVisible && !reduceMotion && !frameId) frameId = requestAnimationFrame(animate);
    if (!isVisible && frameId) {
      cancelAnimationFrame(frameId);
      frameId = 0;
    }
  }, { threshold: 0.03 });

  new ResizeObserver(resize).observe(root);
  observer.observe(section);
  resize();
  render();
}
