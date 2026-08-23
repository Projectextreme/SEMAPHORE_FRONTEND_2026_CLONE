export const dolphinVertex = `
varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vPosition;

#include <skinning_pars_vertex>

void main() {
    #include <skinbase_vertex>
    #include <begin_vertex>
    #include <skinning_vertex>
    #include <project_vertex>

    vec4 modelPosition = modelMatrix * vec4(transformed, 1.0);
    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;

    gl_Position = projectedPosition;

    vUv = uv;
    vec4 modelNormal = modelMatrix * vec4(normal, 0.0);
    vNormal = modelNormal.xyz;
    vPosition = modelPosition.xyz;
}
`;

export const dolphinFragment = `
uniform float uTime;
uniform vec3 uBaseColor;

varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vPosition;

void main() {
    vec3 normal = normalize(vNormal);
    if(!gl_FrontFacing) {
        normal *= -1.0;
    }

    vec3 viewDirection = normalize(vPosition - cameraPosition);
    float fresnel = dot(viewDirection, normal) + 1.0;
    fresnel = pow(fresnel, 2.5);

    gl_FragColor = vec4(uBaseColor, fresnel);

    #include <colorspace_fragment>
}
`;

export const sparkleVertex = `
uniform float uTime;
uniform float uSize;
uniform float uPixelRatio;

attribute float aRandom;
attribute float aSize;

varying float vRandom;

void main() {
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);
    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;

    gl_Position = projectedPosition;

    float sizeVariation = aSize * (0.5 + 0.5 * sin(uTime * 2.0 + aRandom * 6.28));
    gl_PointSize = uSize * sizeVariation * uPixelRatio;
    gl_PointSize *= (2.0 / -viewPosition.z);
    gl_PointSize = max(gl_PointSize, 2.0);

    vRandom = aRandom;
}
`;

export const sparkleFragment = `
uniform float uTime;
uniform vec3 uColor1;
uniform vec3 uColor2;

varying float vRandom;

void main() {
    float distanceToCenter = length(gl_PointCoord - vec2(0.5));

    float strength = 0.05 / distanceToCenter - 0.1;
    strength = clamp(strength, 0.0, 1.0);

    float colorMix = sin(vRandom * 6.28 + uTime) * 0.5 + 0.5;
    vec3 color = mix(uColor1, uColor2, colorMix);

    float twinkle = sin(uTime * 3.0 + vRandom * 20.0) * 0.3 + 0.7;

    gl_FragColor = vec4(color, strength * twinkle);

    #include <colorspace_fragment>
}
`;

export const seabedVertex = `
uniform float uTime;
uniform float uPixelRatio;
uniform float uSize;
uniform float uNoiseScale;
uniform float uNoiseHeight;
uniform float uWaveSpeed;
uniform float uWaveAmplitude;
uniform float uScrollSpeed;
uniform float uScrollOffset;

attribute float aRandom;
attribute vec2 aGridCoord;

varying float vHeight;
varying float vRandom;
varying vec3 vPosition;
varying float vFogDepth;

vec3 mod289(vec3 x) {
  return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec4 mod289(vec4 x) {
  return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec4 permute(vec4 x) {
  return mod289(((x * 34.0) + 1.0) * x);
}

vec4 taylorInvSqrt(vec4 r) {
  return 1.79284291400159 - 0.85373472095314 * r;
}

vec3 fade(vec3 t) {
  return t * t * t * (t * (t * 6.0 - 15.0) + 10.0);
}

float cnoise(vec3 P) {
  vec3 Pi0 = floor(P);
  vec3 Pi1 = Pi0 + vec3(1.0);
  Pi0 = mod289(Pi0);
  Pi1 = mod289(Pi1);
  vec3 Pf0 = fract(P);
  vec3 Pf1 = Pf0 - vec3(1.0);
  vec4 ix = vec4(Pi0.x, Pi1.x, Pi0.x, Pi1.x);
  vec4 iy = vec4(Pi0.yy, Pi1.yy);
  vec4 iz0 = Pi0.zzzz;
  vec4 iz1 = Pi1.zzzz;

  vec4 ixy = permute(permute(ix) + iy);
  vec4 ixy0 = permute(ixy + iz0);
  vec4 ixy1 = permute(ixy + iz1);

  vec4 gx0 = ixy0 * (1.0 / 7.0);
  vec4 gy0 = fract(floor(gx0) * (1.0 / 7.0)) - 0.5;
  gx0 = fract(gx0);
  vec4 gz0 = vec4(0.5) - abs(gx0) - abs(gy0);
  vec4 sz0 = step(gz0, vec4(0.0));
  gx0 -= sz0 * (step(0.0, gx0) - 0.5);
  gy0 -= sz0 * (step(0.0, gy0) - 0.5);

  vec4 gx1 = ixy1 * (1.0 / 7.0);
  vec4 gy1 = fract(floor(gx1) * (1.0 / 7.0)) - 0.5;
  gx1 = fract(gx1);
  vec4 gz1 = vec4(0.5) - abs(gx1) - abs(gy1);
  vec4 sz1 = step(gz1, vec4(0.0));
  gx1 -= sz1 * (step(0.0, gx1) - 0.5);
  gy1 -= sz1 * (step(0.0, gy1) - 0.5);

  vec3 g000 = vec3(gx0.x, gy0.x, gz0.x);
  vec3 g100 = vec3(gx0.y, gy0.y, gz0.y);
  vec3 g010 = vec3(gx0.z, gy0.z, gz0.z);
  vec3 g110 = vec3(gx0.w, gy0.w, gz0.w);
  vec3 g001 = vec3(gx1.x, gy1.x, gz1.x);
  vec3 g101 = vec3(gx1.y, gy1.y, gz1.y);
  vec3 g011 = vec3(gx1.z, gy1.z, gz1.z);
  vec3 g111 = vec3(gx1.w, gy1.w, gz1.w);

  vec4 norm0 = taylorInvSqrt(vec4(dot(g000, g000), dot(g010, g010), dot(g100, g100), dot(g110, g110)));
  g000 *= norm0.x;
  g010 *= norm0.y;
  g100 *= norm0.z;
  g110 *= norm0.w;
  vec4 norm1 = taylorInvSqrt(vec4(dot(g001, g001), dot(g011, g011), dot(g101, g101), dot(g111, g111)));
  g001 *= norm1.x;
  g011 *= norm1.y;
  g101 *= norm1.z;
  g111 *= norm1.w;

  float n000 = dot(g000, Pf0);
  float n100 = dot(g100, vec3(Pf1.x, Pf0.yz));
  float n010 = dot(g010, vec3(Pf0.x, Pf1.y, Pf0.z));
  float n110 = dot(g110, vec3(Pf1.xy, Pf0.z));
  float n001 = dot(g001, vec3(Pf0.xy, Pf1.z));
  float n101 = dot(g101, vec3(Pf1.x, Pf0.y, Pf1.z));
  float n011 = dot(g011, vec3(Pf0.x, Pf1.yz));
  float n111 = dot(g111, Pf1);

  vec3 fade_xyz = fade(Pf0);
  vec4 n_z = mix(vec4(n000, n100, n010, n110), vec4(n001, n101, n011, n111), fade_xyz.z);
  vec2 n_yz = mix(n_z.xy, n_z.zw, fade_xyz.y);
  float n_xyz = mix(n_yz.x, n_yz.y, fade_xyz.x);
  return 2.2 * n_xyz;
}

float fbm(vec3 p) {
  float value = 0.0;
  float amplitude = 0.5;
  float frequency = 1.0;
  
  for(int i = 0; i < 4; i++) {
    value += amplitude * cnoise(p * frequency);
    frequency *= 2.0;
    amplitude *= 0.5;
  }
  
  return value;
}

void main() {
  vec3 pos = position;
  float scrollOffset = uScrollOffset;
  
  vec3 noiseCoord = vec3(
    pos.x * uNoiseScale,
    0.0,
    (pos.z + scrollOffset) * uNoiseScale
  );
  
  float noise = fbm(noiseCoord);
  float wave = sin(pos.x * 0.3 + uTime * uWaveSpeed) * 
               cos((pos.z + scrollOffset) * 0.3 + uTime * uWaveSpeed) * 
               uWaveAmplitude;
  
  float height = noise * uNoiseHeight + wave;
  pos.y += height;
  
  vHeight = height;
  vRandom = aRandom;
  vPosition = pos;
  
  vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
  vFogDepth = -mvPosition.z;
  gl_Position = projectionMatrix * mvPosition;
  
  float distanceScale = 1.0 / -mvPosition.z;
  gl_PointSize = uSize * uPixelRatio * distanceScale * (0.8 + aRandom * 0.4);
}
`;

export const seabedFragment = `
uniform vec3 uColor1;
uniform vec3 uColor2;
uniform vec3 uColor3;
uniform vec3 uSandColor;
uniform vec3 uRockColor;
uniform float uGlowIntensity;
uniform float uTime;
uniform vec3 uFogColor;
uniform float uFogNear;
uniform float uFogFar;

varying float vHeight;
varying float vRandom;
varying vec3 vPosition;
varying float vFogDepth;

void main() {
  vec2 center = gl_PointCoord - vec2(0.5);
  float dist = length(center);
  
  if(dist > 0.5) {
    discard;
  }
  
  float alpha = 1.0 - smoothstep(0.0, 0.5, dist);
  alpha = pow(alpha, 1.5);
  
  float heightNorm = (vHeight + 8.0) / 16.0;
  heightNorm = clamp(heightNorm, 0.0, 1.0);
  
  float terrainNoise = fract(sin(dot(vPosition.xz, vec2(12.9898, 78.233))) * 43758.5453);
  float isRocky = step(0.6, heightNorm) * (0.7 + terrainNoise * 0.3);
  
  vec3 deepColor = uColor1;
  vec3 sandColor = uSandColor;
  vec3 rockColor = uRockColor;
  vec3 peakColor = uColor3;
  
  vec3 color;

  if(heightNorm < 0.2) {
    color = mix(deepColor, sandColor, heightNorm * 5.0);
  } else if(heightNorm < 0.5) {
    vec3 baseColor = mix(sandColor, rockColor, isRocky);
    color = mix(deepColor, baseColor, (heightNorm - 0.2) * 3.33);
  } else if(heightNorm < 0.8) {
    vec3 baseColor = mix(sandColor, rockColor, isRocky);
    color = mix(baseColor, peakColor, (heightNorm - 0.5) * 3.33);
  } else {
    color = mix(rockColor, peakColor, (heightNorm - 0.8) * 5.0);
  }
  
  float positionVariation = fract(sin(dot(vPosition.xz * 0.1, vec2(12.9898, 78.233))) * 43758.5453);
  color = mix(color, color * 1.2, positionVariation * 0.1);
  
  float peakGlow = smoothstep(0.7, 1.0, heightNorm);
  float pulse = sin(uTime * 1.5 + vRandom * 6.28) * 0.3 + 0.7;
  color += peakColor * peakGlow * pulse * uGlowIntensity * 0.3;
  
  float sparkle = step(0.995, vRandom + sin(uTime * 2.0 + vPosition.x * 0.1) * 0.01);
  color += vec3(0.8, 0.9, 1.0) * sparkle * 0.4 * isRocky;
  
  float gridX = fract(vPosition.x * 0.2);
  float gridZ = fract(vPosition.z * 0.2);
  float grid = step(0.98, gridX) + step(0.98, gridZ);
  color += vec3(0.1, 0.3, 0.5) * grid * 0.1;
  
  alpha *= (0.7 + uGlowIntensity * 0.3);
  
  float fogFactor = smoothstep(uFogNear, uFogFar, vFogDepth);
  vec3 finalColor = mix(color, uFogColor, fogFactor);
  float finalAlpha = alpha * (1.0 - fogFactor * 0.7);

  gl_FragColor = vec4(finalColor, finalAlpha);
}
`;

export const flowFieldVertex = `
attribute vec3 velocity;
attribute float size;
attribute float alpha;
attribute float particleType;

varying float vAlpha;
varying float vParticleType;

void main() {
  vAlpha = alpha;
  vParticleType = particleType;

  vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
  gl_PointSize = size * (90.0 / -mvPosition.z);
  gl_Position = projectionMatrix * mvPosition;
}
`;

export const flowFieldFragment = `
uniform vec3 uColor;
uniform float uTime;

varying float vAlpha;
varying float vParticleType;

void main() {
  vec2 center = gl_PointCoord - vec2(0.5);
  float dist = length(center);

  if(dist > 0.5) {
    discard;
  }

  float glow = smoothstep(0.5, 0.0, dist);
  float alpha = glow * vAlpha * 0.25;

  float shimmer = sin(uTime * 2.0 + vParticleType * 100.0) * 0.15 + 0.85;
  alpha *= shimmer;

  gl_FragColor = vec4(uColor, alpha);
}
`;

export const wormholeVertex = `
varying vec2 vUv;
varying vec3 vPosition;
varying float vFogDepth;

void main() {
  vUv = uv;
  vPosition = position;
  vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
  vFogDepth = -mvPosition.z;
  gl_Position = projectionMatrix * mvPosition;
}
`;

export const wormholeFragment = `
uniform float uTime;
uniform vec3 uColor1;
uniform vec3 uColor2;
uniform vec3 uColor3;
uniform vec3 fogColor;
uniform float fogNear;
uniform float fogFar;

varying vec2 vUv;
varying vec3 vPosition;
varying float vFogDepth;

float noise(vec2 p) {
  return sin(p.x * 10.0 - uTime * 0.5) * sin(p.y * 10.0 - uTime * 0.3);
}

float caustics(vec2 uv, float time) {
  vec2 p = uv * 8.0;
  float c = 0.0;
  c += sin(p.x * 2.0 - time * 1.5 + sin(p.y * 3.0 - time * 0.8));
  c += sin(p.y * 3.0 - time * 1.2 + sin(p.x * 2.5 - time * 0.5));
  c += sin((p.x + p.y) * 1.5 - time * 1.0);
  c += sin(length(p - vec2(sin(time * 0.3) * 2.0, cos(time * 0.4) * 2.0)) * 3.0 + time * 2.0);
  return c * 0.25 + 0.5;
}

void main() {
  vec2 uv = vUv;
  float wave1 = sin(uv.x * 10.0 - uTime * 0.8) * 0.02;
  float wave2 = cos(uv.y * 8.0 - uTime * 0.6) * 0.02;
  vec2 distortedUv = uv + vec2(wave1, wave2);
  vec2 center = vec2(0.5, 0.5);
  float dist = length(distortedUv - center);
  float causticsPattern = caustics(distortedUv, uTime);
  float rings = sin((dist * 15.0 + uTime * 1.5)) * 0.5 + 0.5;
  float currents = sin((uv.x * 20.0 - uTime * 2.0 + noise(uv * 3.0))) * 0.5 + 0.5;
  float pattern = causticsPattern * 0.6 + rings * 0.2 + currents * 0.2;
  vec3 color = mix(uColor1, uColor2, pattern);
  float brightCaustics = pow(causticsPattern, 2.0);
  color = mix(color, uColor3, brightCaustics * 0.5);
  float depthFade = smoothstep(0.0, 1.0, vUv.y);
  color = mix(color * 0.3, color, depthFade);
  float centerGlow = 1.0 - smoothstep(0.0, 0.5, dist);
  color += uColor3 * centerGlow * 0.3;
  float edgeDarken = smoothstep(0.4, 0.5, dist);
  color *= 1.0 - edgeDarken * 0.5;
  float fade = smoothstep(0.0, 0.15, vUv.y) * smoothstep(1.0, 0.85, vUv.y);
  float shimmer = sin(-uTime * 3.0 + dist * 20.0) * 0.1 + 0.9;

  vec3 finalColor = color * shimmer;
  float alpha = 0.7 * fade;

  float fogFactor = smoothstep(fogNear, fogFar, vFogDepth);
  finalColor = mix(finalColor, fogColor, fogFactor);

  gl_FragColor = vec4(finalColor, alpha);
}
`;

export const godRayVertex = `
varying vec3 vWorldPosition;
varying vec2 vUv;

void main() {
  vUv = uv;
  vec4 worldPos = modelMatrix * vec4(position, 1.0);
  vWorldPosition = worldPos.xyz;
  gl_Position = projectionMatrix * viewMatrix * worldPos;
}
`;

export const godRayFragment = `
uniform float uTime;
uniform vec3 uColor1;
uniform vec3 uColor2;

varying vec3 vWorldPosition;
varying vec2 vUv;

float noise(vec2 p) {
  return sin(p.x * 14.0 + uTime * 1.2) * cos(p.y * 18.0 - uTime * 0.8) * 0.5 + 0.5;
}

void main() {
  float rayPattern = noise(vec2(vUv.x * 5.0, vUv.y * 1.5));
  float rayPattern2 = noise(vec2(vUv.x * 9.0 + 1.5, vUv.y * 3.0 - uTime * 0.4));
  float combinedRays = pow(rayPattern * 0.6 + rayPattern2 * 0.4, 1.5);

  float verticalFade = smoothstep(0.0, 0.2, vUv.y) * (1.0 - smoothstep(0.75, 1.0, vUv.y));
  float horizontalEdge = smoothstep(0.0, 0.25, vUv.x) * (1.0 - smoothstep(0.75, 1.0, vUv.x));

  float intensity = combinedRays * verticalFade * horizontalEdge;
  vec3 color = mix(uColor1, uColor2, vUv.y * 0.7 + 0.3);

  gl_FragColor = vec4(color * 2.0, intensity * 0.65);
}
`;

export const waterCausticsVertex = `
varying vec2 vUv;
varying vec3 vWorldPosition;

void main() {
  vUv = uv;
  vec4 worldPos = modelMatrix * vec4(position, 1.0);
  vWorldPosition = worldPos.xyz;
  gl_Position = projectionMatrix * viewMatrix * worldPos;
}
`;

export const waterCausticsFragment = `
uniform float uTime;
uniform vec3 uColor1;
uniform vec3 uColor2;

varying vec2 vUv;
varying vec3 vWorldPosition;

float caustics(vec2 uv, float time) {
  vec2 p = uv * 12.0;
  float c = 0.0;
  c += sin(p.x * 2.5 - time * 1.8 + sin(p.y * 3.5 - time * 1.0));
  c += sin(p.y * 3.5 - time * 1.4 + sin(p.x * 2.8 - time * 0.6));
  c += sin((p.x + p.y) * 2.0 - time * 1.2);
  c += sin(length(p - vec2(sin(time * 0.4) * 3.0, cos(time * 0.5) * 3.0)) * 4.0 + time * 2.5);
  return pow(c * 0.25 + 0.5, 2.2);
}

void main() {
  vec2 uv = vUv * 6.0;
  float c1 = caustics(uv, uTime);
  float c2 = caustics(uv * 1.3 + vec2(0.5, 0.5), uTime * 1.2);
  float pattern = pow(c1 * 0.6 + c2 * 0.4, 1.8);
  
  vec3 color = mix(uColor1, uColor2, pattern);
  float alpha = smoothstep(0.1, 0.9, pattern) * 0.75;
  
  gl_FragColor = vec4(color * 1.8, alpha);
}
`;

export const bubbleVertex = `
uniform float uTime;
uniform float uPixelRatio;

attribute float aSize;
attribute float aSpeed;
attribute float aOffset;
attribute vec3 aInitialPos;

varying float vLife;

void main() {
  vec3 pos = aInitialPos;
  
  float heightSpan = 80.0;
  float yTravel = mod((uTime * aSpeed * 10.0 + aOffset), heightSpan);
  pos.y = aInitialPos.y + yTravel;

  pos.x += sin(uTime * 1.5 + aOffset) * 1.2 + cos(uTime * 0.8 + pos.y * 0.1) * 0.8;
  pos.z += cos(uTime * 1.2 + aOffset) * 1.2 + sin(uTime * 0.7 + pos.y * 0.1) * 0.8;

  vLife = yTravel / heightSpan;

  vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
  gl_PointSize = aSize * uPixelRatio * (40.0 / -mvPosition.z);
  gl_PointSize = clamp(gl_PointSize, 2.0, 28.0);

  gl_Position = projectionMatrix * mvPosition;
}
`;

export const bubbleFragment = `
uniform vec3 uColor;

varying float vLife;

void main() {
  vec2 st = gl_PointCoord - vec2(0.5);
  float r = length(st);

  if (r > 0.5) discard;

  float ring = smoothstep(0.32, 0.48, r) * (1.0 - smoothstep(0.48, 0.5, r));
  float highlight = smoothstep(0.12, 0.0, length(st - vec2(-0.15, 0.15)));
  float core = (1.0 - smoothstep(0.0, 0.5, r)) * 0.2;

  float fade = sin(vLife * 3.14159);
  float alpha = (ring * 0.85 + highlight * 0.95 + core) * fade;

  gl_FragColor = vec4(uColor + vec3(highlight * 0.4), alpha * 0.75);
}
`;

export const portalVortexVertex = `
varying vec2 vUv;
varying vec3 vPosition;

void main() {
  vUv = uv;
  vPosition = position;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

export const portalVortexFragment = `
uniform float uTime;
uniform vec3 uColor1;
uniform vec3 uColor2;
varying vec2 vUv;

void main() {
  vec2 st = vUv - vec2(0.5);
  float dist = length(st);
  float angle = atan(st.y, st.x);
  
  float spiral = sin(dist * 32.0 - angle * 5.0 - uTime * 4.5);
  float pulse = sin(dist * 20.0 - uTime * 2.5) * 0.5 + 0.5;
  
  vec3 color = mix(uColor1, uColor2, spiral * 0.5 + pulse * 0.5);
  float alpha = smoothstep(0.5, 0.02, dist) * (0.8 + spiral * 0.2);
  
  gl_FragColor = vec4(color, alpha);
}
`;
