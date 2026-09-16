// ---------- Fondo de estrellas 2D (mapa) ----------
const starsCanvas = document.getElementById('bgstars');
const bctx = starsCanvas.getContext('2d');
function resizeBg(){ starsCanvas.width = innerWidth; starsCanvas.height = innerHeight; }
resizeBg(); addEventListener('resize', resizeBg);
const bgStars = Array.from({length:180}, () => ({
  x: Math.random()*innerWidth, y: Math.random()*innerHeight,
  r: Math.random()*1.3+0.2, a: Math.random(), speed: Math.random()*0.4+0.05
}));
function drawBg(){
  bctx.fillStyle = '#03060a';
  bctx.fillRect(0,0,starsCanvas.width,starsCanvas.height);
  for(const s of bgStars){
    s.a += 0.004*s.speed;
    const alpha = 0.35 + Math.sin(s.a*10)*0.35;
    bctx.beginPath();
    bctx.fillStyle = `rgba(150,190,255,${Math.max(0.08,alpha)})`;
    bctx.arc(s.x,s.y,s.r,0,Math.PI*2);
    bctx.fill();
  }
  requestAnimationFrame(drawBg);
}
drawBg();

// ---------- Vista de mapa: estrellas del atlas ----------
const mapView = document.getElementById('mapView');
const systemView = document.getElementById('systemView');
const starMapEl = document.getElementById('starMap');
const backBtn = document.getElementById('backBtn');
const sysTitle = document.getElementById('sysTitle');
const sysSubtitle = document.getElementById('sysSubtitle');
const infoPanel = document.getElementById('infoPanel');

Object.entries(SYSTEMS).forEach(([key, sys]) => {
  const node = document.createElement('div');
  node.className = 'star-node';
  node.style.left = sys.mapPos.x + '%';
  node.style.top = sys.mapPos.y + '%';
  const colorHex = '#' + sys.starColor.toString(16).padStart(6,'0');
  node.style.setProperty('--sc', colorHex);
  node.innerHTML = `<div class="star-glow"></div><div class="star-label">${sys.name}</div>`;
  node.addEventListener('click', () => openSystem(key));
  starMapEl.appendChild(node);
});

let currentSystemKey = null;

function openSystem(key){
  currentSystemKey = key;
  mapView.classList.add('hidden');
  systemView.classList.remove('hidden');
  loadSystem(SYSTEMS[key]);
}
backBtn.addEventListener('click', () => {
  systemView.classList.add('hidden');
  mapView.classList.remove('hidden');
  infoPanel.classList.remove('show');
});

// Si venimos de una ficha de planeta con "Volver al sistema", abrimos ese sistema
const initialParams = new URLSearchParams(location.search);
const initialSystem = initialParams.get('system');
if (initialSystem && SYSTEMS[initialSystem]) {
  openSystem(initialSystem);
}

// ---------- Vista de sistema: Three.js ----------
let scene, camera, renderer, raycaster, mouse;
let planetGroup, sunGroup, orbitLines = [];
let hovered = null;
const clock = new THREE.Clock();

// --- Cámara orbital propia (sin dependencias externas) ---
const camState = { radius: 16, theta: 0.9, phi: 1.15, target: new THREE.Vector3(0,0,0) };
let dragging = false, lastX = 0, lastY = 0;

function updateCameraFromState(){
  const { radius, theta, phi, target } = camState;
  camera.position.set(
    target.x + radius*Math.sin(phi)*Math.sin(theta),
    target.y + radius*Math.cos(phi),
    target.z + radius*Math.sin(phi)*Math.cos(theta)
  );
  camera.lookAt(target);
}

function initThree(){
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(48, innerWidth/innerHeight, 0.05, 500);
  renderer = new THREE.WebGLRenderer({antialias:true, alpha:true});
  renderer.setPixelRatio(Math.min(devicePixelRatio,2));
  renderer.setSize(innerWidth, innerHeight);
  document.getElementById('sysCanvasWrap').appendChild(renderer.domElement);
  raycaster = new THREE.Raycaster();
  mouse = new THREE.Vector2();

  scene.add(new THREE.AmbientLight(0x556677, 0.5));

  const starsGeo = new THREE.BufferGeometry();
  const cnt = 1800; const positions = new Float32Array(cnt*3);
  for(let i=0;i<cnt;i++){
    const r = 120+Math.random()*200, th=Math.random()*Math.PI*2, ph=Math.acos(Math.random()*2-1);
    positions[i*3]=r*Math.sin(ph)*Math.cos(th);
    positions[i*3+1]=r*Math.sin(ph)*Math.sin(th);
    positions[i*3+2]=r*Math.cos(ph);
  }
  starsGeo.setAttribute('position', new THREE.BufferAttribute(positions,3));
  scene.add(new THREE.Points(starsGeo, new THREE.PointsMaterial({color:0xaab8d0,size:0.5,transparent:true,opacity:0.7})));

  const dom = renderer.domElement;
  dom.addEventListener('mousedown', e => { dragging = true; lastX = e.clientX; lastY = e.clientY; });
  window.addEventListener('mouseup', () => dragging = false);
  window.addEventListener('mousemove', e => {
    if(dragging){
      const dx = e.clientX - lastX, dy = e.clientY - lastY;
      camState.theta -= dx*0.006;
      camState.phi = Math.max(0.25, Math.min(Math.PI-0.25, camState.phi - dy*0.006));
      lastX = e.clientX; lastY = e.clientY;
      updateCameraFromState();
    }
    onMouseMove(e);
  });
  dom.addEventListener('wheel', e => {
    e.preventDefault();
    camState.radius = Math.max(3, Math.min(60, camState.radius + e.deltaY*0.012));
    updateCameraFromState();
  }, {passive:false});
  dom.addEventListener('touchstart', e => { dragging = true; lastX = e.touches[0].clientX; lastY = e.touches[0].clientY; });
  window.addEventListener('touchend', () => dragging = false);
  window.addEventListener('touchmove', e => {
    if(!dragging) return;
    const dx = e.touches[0].clientX - lastX, dy = e.touches[0].clientY - lastY;
    camState.theta -= dx*0.006;
    camState.phi = Math.max(0.25, Math.min(Math.PI-0.25, camState.phi - dy*0.006));
    lastX = e.touches[0].clientX; lastY = e.touches[0].clientY;
    updateCameraFromState();
  });

  dom.addEventListener('click', onClick);
  addEventListener('resize', onResize);
  animate();
}

function onResize(){
  camera.aspect = innerWidth/innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(innerWidth, innerHeight);
}

function clearSystem(){
  if(planetGroup) scene.remove(planetGroup);
  if(sunGroup) scene.remove(sunGroup);
  orbitLines.forEach(l=>scene.remove(l));
  orbitLines = [];
}

// --- Material holográfico de borde (fresnel rim glow), aditivo, en el color del cuerpo ---
function makeRimMaterial(color){
  return new THREE.ShaderMaterial({
    uniforms: { glowColor: { value: new THREE.Color(color) } },
    vertexShader: `
      varying vec3 vNormal;
      varying vec3 vViewDir;
      void main(){
        vNormal = normalize(normalMatrix * normal);
        vec4 mv = modelViewMatrix * vec4(position,1.0);
        vViewDir = normalize(-mv.xyz);
        gl_Position = projectionMatrix * mv;
      }`,
    fragmentShader: `
      varying vec3 vNormal;
      varying vec3 vViewDir;
      uniform vec3 glowColor;
      void main(){
        float rim = pow(1.0 - max(dot(normalize(vNormal), normalize(vViewDir)), 0.0), 2.4);
        gl_FragColor = vec4(glowColor, rim*0.9);
      }`,
    transparent: true,
    blending: THREE.AdditiveBlending,
    side: THREE.FrontSide,
    depthWrite: false
  });
}

// --- Anillo de órbita "de cristal": línea fina, aditiva ---
function makeOrbitRing(radius, color){
  const segments = 160;
  const positions = new Float32Array((segments+1)*3);
  for(let i=0;i<=segments;i++){
    const a = (i/segments)*Math.PI*2;
    positions[i*3] = Math.cos(a)*radius;
    positions[i*3+1] = 0;
    positions[i*3+2] = Math.sin(a)*radius;
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(positions,3));
  const mat = new THREE.LineBasicMaterial({ color, transparent:true, opacity:0.35, blending:THREE.AdditiveBlending });
  return new THREE.LineLoop(geo, mat);
}

function loadSystem(sys){
  if(!scene) initThree();
  clearSystem();
  sysTitle.textContent = sys.name;
  sysSubtitle.textContent = `${sys.starName} — ${sys.starType}`;
  infoPanel.classList.remove('show');

  sunGroup = new THREE.Group();
  scene.add(sunGroup);
  const sunCore = new THREE.Mesh(new THREE.SphereGeometry(0.85,48,32), new THREE.MeshBasicMaterial({ color: sys.starColor }));
  sunGroup.add(sunCore);
  [1.05, 1.3, 1.65, 2.2].forEach((s, i) => {
    const shell = new THREE.Mesh(
      new THREE.SphereGeometry(0.85*s, 32, 24),
      new THREE.MeshBasicMaterial({ color: sys.starColor, transparent:true, opacity: 0.16/(i+1), blending: THREE.AdditiveBlending, depthWrite:false })
    );
    sunGroup.add(shell);
  });
  const sunLight = new THREE.PointLight(sys.starColor, 3.4, 0, 0);
  sunGroup.add(sunLight);

  planetGroup = new THREE.Group();
  scene.add(planetGroup);

  sys.bodies.forEach((b, i) => {
    if (b.isBelt) {
      const mesh = new THREE.Mesh(
        new THREE.TorusGeometry(b.orbit, 0.06, 8, 96),
        new THREE.MeshBasicMaterial({ color:b.color, transparent:true, opacity:0.3, blending:THREE.AdditiveBlending })
      );
      mesh.rotation.x = Math.PI/2;
      planetGroup.add(mesh);
      return;
    }

    const bodyGroup = new THREE.Group();
    let hitMesh;

    if (b.debris) {
      // Planeta destruido: cúmulo de fragmentos irregulares
      const chunkCount = 11;
      for (let c = 0; c < chunkCount; c++) {
        const chunkSize = b.size * (0.32 + Math.random()*0.34);
        const chunk = new THREE.Mesh(
          new THREE.IcosahedronGeometry(chunkSize, 0),
          new THREE.MeshPhysicalMaterial({
            color: b.color, roughness: 0.45, metalness: 0.15,
            transparent: true, opacity: 0.72,
            clearcoat: 0.6, clearcoatRoughness: 0.35
          })
        );
        const dir = new THREE.Vector3(Math.random()-0.5, Math.random()-0.5, Math.random()-0.5).normalize();
        chunk.position.copy(dir.multiplyScalar(Math.random()*b.size*0.68));
        chunk.rotation.set(Math.random()*Math.PI, Math.random()*Math.PI, Math.random()*Math.PI);
        bodyGroup.add(chunk);
      }
      const rim = new THREE.Mesh(new THREE.SphereGeometry(b.size*1.12, 24, 16), makeRimMaterial(b.color));
      bodyGroup.add(rim);
      hitMesh = new THREE.Mesh(
        new THREE.SphereGeometry(b.size*1.1, 12, 8),
        new THREE.MeshBasicMaterial({ visible: false })
      );
      bodyGroup.add(hitMesh);
    } else {
      const core = new THREE.Mesh(
        new THREE.SphereGeometry(b.size, 32, 24),
        new THREE.MeshPhysicalMaterial({
          color: b.color, roughness: 0.15, metalness: 0.05,
          transparent: true, opacity: 0.55,
          clearcoat: 1, clearcoatRoughness: 0.1
        })
      );
      bodyGroup.add(core);

      // Núcleo interior sólido
      const inner = new THREE.Mesh(
        new THREE.SphereGeometry(b.size*0.55, 20, 16),
        new THREE.MeshBasicMaterial({ color:b.color, transparent:true, opacity:0.85 })
      );
      bodyGroup.add(inner);

      const rim = new THREE.Mesh(new THREE.SphereGeometry(b.size*1.1, 32, 24), makeRimMaterial(b.color));
      bodyGroup.add(rim);
      hitMesh = core;
    }

    const wire = new THREE.Mesh(
      new THREE.IcosahedronGeometry(b.size*1.28, 1),
      new THREE.MeshBasicMaterial({ color:0x8fd8ff, wireframe:true, transparent:true, opacity:0.22 })
    );
    wire.rotation.set(Math.random()*Math.PI, Math.random()*Math.PI, 0);
    bodyGroup.add(wire);
    bodyGroup.userData = { wire, body: b, baseOrbit: b.orbit, angle: Math.random()*Math.PI*2, speed: b.speed, parentIndex: b.parentIndex, hitMesh };
    hitMesh.userData.owner = bodyGroup;
    planetGroup.add(bodyGroup);

    if (b.parentIndex === undefined) {
      const ring = makeOrbitRing(b.orbit, 0x5fb0ff);
      scene.add(ring);
      orbitLines.push(ring);
    }
  });

  camState.radius = Math.max(15, sys.bodies.reduce((m,b)=>Math.max(m,b.orbit),4)*1.5);
  camState.theta = 0.9; camState.phi = 1.15;
  camState.target.set(0,0,0);
  updateCameraFromState();
}

function getPlanetHitMeshes(){
  return planetGroup ? planetGroup.children.filter(g => g.userData && g.userData.hitMesh).map(g => g.userData.hitMesh) : [];
}

function onMouseMove(e){
  mouse.x = (e.clientX/innerWidth)*2-1;
  mouse.y = -(e.clientY/innerHeight)*2+1;
  raycaster.setFromCamera(mouse, camera);
  const hits = raycaster.intersectObjects(getPlanetHitMeshes());
  if(hits.length){
    const owner = hits[0].object.userData.owner;
    if(hovered !== owner){
      hovered = owner;
      renderer.domElement.style.cursor = 'pointer';
      showInfoPanel(owner.userData.body);
    }
  } else if(hovered){
    // el cartel mantiene la última ficha mostrada
    hovered = null;
    renderer.domElement.style.cursor = 'default';
  }
}

function onClick(){
  if(hovered && hovered.userData.body.detail){
    window.location.href = hovered.userData.body.detail + '?system=' + currentSystemKey;
  }
}

function showInfoPanel(body){
  const rows = [];
  if(body.type) rows.push(['Tipo', body.type]);
  if(body.pop) rows.push(['Población', body.pop]);
  if(body.economia) rows.push(['Economía', body.economia]);
  if(body.peculiaridad) rows.push(['Peculiaridad', body.peculiaridad]);
  if(body.enfermedades) rows.push(['Enfermedades', body.enfermedades]);
  if(body.recurso) rows.push(['Recurso exportable', body.recurso]);

  infoPanel.innerHTML = `
    <div class="info-close" id="infoClose">✕</div>
    <h2>${body.name}</h2>
    ${rows.map(([k,v]) => `<div class="info-row"><span class="k">${k}</span><span class="v">${v}</span></div>`).join('')}
    ${body.detail ? `<div class="info-hint">Clic sobre el cuerpo para explorar su superficie →</div>` : ''}
  `;
  infoPanel.classList.add('show');
  document.getElementById('infoClose').onclick = () => infoPanel.classList.remove('show');
}

function animate(){
  requestAnimationFrame(animate);
  const dt = Math.min(clock.getDelta(), 0.05);
  if(planetGroup){
    const groups = planetGroup.children.filter(g => g.userData && g.userData.body);
    groups.forEach(g => {
      const d = g.userData;
      if(d.parentIndex === undefined){
        d.angle += dt*d.speed;
        g.position.set(Math.cos(d.angle)*d.baseOrbit, 0, Math.sin(d.angle)*d.baseOrbit);
      }
      g.userData.wire.rotation.y += dt*0.25;
      g.userData.wire.rotation.x += dt*0.1;
    });
    groups.forEach(g => {
      const d = g.userData;
      if(d.parentIndex !== undefined){
        d.angle += dt*d.speed;
        const parent = groups[d.parentIndex];
        if(parent){
          g.position.set(
            parent.position.x + Math.cos(d.angle)*d.baseOrbit,
            0,
            parent.position.z + Math.sin(d.angle)*d.baseOrbit
          );
        }
      }
    });
  }
  if(sunGroup){
    sunGroup.children.forEach((c,i) => { if(i>0) c.rotation.y += dt*0.05*i; });
  }
  if(renderer) renderer.render(scene, camera);
}
