import * as THREE from 'three';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';
const data=JSON.parse(document.getElementById('world-data').textContent);
const scene=new THREE.Scene(),camera=new THREE.PerspectiveCamera(40,innerWidth/innerHeight,.1,200);camera.position.set(0,.5,8.4);
let renderer;try{renderer=new THREE.WebGLRenderer({antialias:true});}catch(e){document.querySelector('#loading').textContent='Activa WebGL o la aceleración gráfica en tu navegador para ver Verdal.';throw e;}
renderer.setSize(innerWidth,innerHeight);renderer.setPixelRatio(Math.min(devicePixelRatio,2));renderer.setClearColor(0x030b10);renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.1;document.body.prepend(renderer.domElement);
const controls=new OrbitControls(camera,renderer.domElement);controls.enableDamping=true;controls.enablePan=false;controls.minDistance=2.9;controls.maxDistance=13;
function texture(svg){return new Promise((resolve,reject)=>{const img=new Image();img.onload=()=>{const t=new THREE.Texture(img);t.colorSpace=THREE.SRGBColorSpace;t.anisotropy=renderer.capabilities.getMaxAnisotropy();t.needsUpdate=true;resolve(t)};img.onerror=reject;img.src=(svg.startsWith('data:')||!svg.trim().startsWith('<'))?svg:'data:image/svg+xml;charset=utf-8,'+encodeURIComponent(svg);});}
const [map,cloudMap]=await Promise.all([texture(data.map),texture(data.clouds)]);
cloudMap.colorSpace=THREE.NoColorSpace;
const globe=new THREE.Group();scene.add(globe);
const waterTime={value:0};
const surface=new THREE.MeshPhysicalMaterial({map,roughness:.85,metalness:0,bumpMap:map,bumpScale:.0018,clearcoat:1,clearcoatRoughness:.25,ior:1.333});
surface.onBeforeCompile=shader=>{
shader.uniforms.waterTime=waterTime;
shader.vertexShader='varying vec3 surfaceLocal;\n'+shader.vertexShader;
shader.vertexShader=shader.vertexShader.replace('#include <begin_vertex>','#include <begin_vertex>\nsurfaceLocal=position;');
shader.fragmentShader='uniform float waterTime; varying vec3 surfaceLocal;\n'+shader.fragmentShader;
shader.fragmentShader=shader.fragmentShader.replace('#include <roughnessmap_fragment>',`#include <roughnessmap_fragment>
vec3 rawSurface=texture2D(map,vMapUv).rgb;
float waterMask=smoothstep(.002,.022,rawSurface.b-rawSurface.r)*smoothstep(-.002,.016,rawSurface.b-rawSurface.g*.82);
roughnessFactor=mix(.92,.24,waterMask);
// El agua profunda no toma el detalle pintado del océano como roca
vec3 deepWater=vec3(.006,.025,.047);
diffuseColor.rgb=mix(diffuseColor.rgb,mix(deepWater,rawSurface,.42),waterMask*.64);
`);
shader.fragmentShader=shader.fragmentShader.replace('#include <normal_fragment_maps>',`vec3 smoothSurfaceNormal=normal;
#include <normal_fragment_maps>
vec3 wavePoint=normalize(surfaceLocal);
float ripple=(sin(dot(wavePoint,vec3(243.,151.,97.))+waterTime*.6)+.5*sin(dot(wavePoint,vec3(-177.,291.,131.))-waterTime*.4))*.000055;
vec3 waterNormal=perturbNormalArb(-vViewPosition,smoothSurfaceNormal,vec2(dFdx(ripple),dFdy(ripple)),faceDirection);
normal=normalize(mix(normal,waterNormal,waterMask));`);
shader.fragmentShader=shader.fragmentShader.replace('#include <lights_physical_fragment>','#include <lights_physical_fragment>\nmaterial.clearcoat=waterMask*.8;');
};
const ground=new THREE.Mesh(new THREE.SphereGeometry(2,192,128),surface);globe.add(ground);
const cloud=new THREE.Mesh(new THREE.SphereGeometry(2.04,128,80),new THREE.ShaderMaterial({
transparent:true,depthWrite:false,uniforms:{cloudTexture:{value:cloudMap}},
vertexShader:`varying vec2 cloudUV; varying vec3 cloudNormal; void main(){cloudUV=uv;cloudNormal=normalize(mat3(modelMatrix)*normal);gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`,
fragmentShader:`uniform sampler2D cloudTexture; varying vec2 cloudUV; varying vec3 cloudNormal; void main(){vec4 texel=texture2D(cloudTexture,cloudUV);float density=texel.a*dot(texel.rgb,vec3(.2126,.7152,.0722));float opacity=smoothstep(.015,.63,density)*.9;if(opacity<.008)discard;float lit=max(dot(normalize(cloudNormal),normalize(vec3(-4.,4.,6.))),0.);vec3 color=vec3(.91,.96,1.)*(.23+lit*.95);gl_FragColor=vec4(color,opacity);
#include <tonemapping_fragment>
#include <colorspace_fragment>
}`
}));globe.add(cloud);
const air=new THREE.Mesh(new THREE.SphereGeometry(2.06,80,48),new THREE.ShaderMaterial({transparent:true,depthWrite:false,blending:THREE.AdditiveBlending,vertexShader:'varying vec3 n;varying vec3 w;void main(){n=normalize(mat3(modelMatrix)*normal);w=(modelMatrix*vec4(position,1.)).xyz;gl_Position=projectionMatrix*viewMatrix*vec4(w,1.);}',fragmentShader:'varying vec3 n;varying vec3 w;void main(){float f=pow(1.-max(dot(normalize(n),normalize(cameraPosition-w)),0.),3.);gl_FragColor=vec4(.19,.55,.75,f*.28);}'}));globe.add(air);
scene.add(new THREE.AmbientLight(0xa5c5d1,1.2));const sun=new THREE.DirectionalLight(0xfff0cf,3.3);sun.position.set(-4,4,6);scene.add(sun);const fill=new THREE.DirectionalLight(0x348aa4,.5);fill.position.set(4,-1,-4);scene.add(fill);
const fixedStars=[[-9,5,-20],[12,8,-30],[5,-5,-22],[-11,-7,-25],[1,7,-25],[17,1,-28],[-18,0,-29],[-6,10,-30],[9,12,-33],[-2,-10,-32],[21,6,-35],[-19,14,-40],[14,-13,-36],[-25,-10,-42],[3,14,-40],[-9,-17,-44],[26,18,-50],[-30,4,-45],[33,-7,-50],[7,-20,-50],[-17,23,-55],[22,-24,-60],[1,26,-60],[31,29,-65],[-36,-25,-66],[-40,17,-68],[16,36,-70],[39,0,-70],[-4,38,-72],[-27,-38,-75],[48,21,-80],[-51,8,-82],[2,-39,-80],[20,-43,-85],[49,-32,-90],[-39,40,-90],[35,44,-95],[-58,-21,-95]];
const starG=new THREE.BufferGeometry();starG.setAttribute('position',new THREE.Float32BufferAttribute(fixedStars.flat(),3));scene.add(new THREE.Points(starG,new THREE.PointsMaterial({color:0xbbd6e3,size:.07,transparent:true,opacity:.7})));
const markers=new THREE.Group();globe.add(markers);const points=[];
function vec(x,y){const phi=x/2048*Math.PI*2,theta=y/1024*Math.PI;return new THREE.Vector3(-Math.cos(phi)*Math.sin(theta),Math.cos(theta),Math.sin(phi)*Math.sin(theta));}
for(let i=0;i<data.regions.length;i++){const r=data.regions[i],m=new THREE.Mesh(new THREE.SphereGeometry(.018,12,8),new THREE.MeshBasicMaterial({color:0xffe6a8}));m.position.copy(vec(r[6],r[7])).multiplyScalar(2.069);m.userData.region=i;markers.add(m);points.push(m);}
function focusRegion(r){
// Detener el movimiento residual de la órbita antes de fijar la posición
const damping=controls.enableDamping;controls.enableDamping=false;controls.update();controls.enableDamping=damping;
const viewDirection=camera.position.clone().sub(controls.target).normalize();
globe.quaternion.setFromUnitVectors(vec(r[6],r[7]),viewDirection);
globe.updateMatrixWorld(true);
}
function select(i,focus=true){const r=data.regions[i];document.getElementById('region').value=i;document.getElementById('region-title').textContent=r[0];document.getElementById('region-meta').textContent=r[1]+' · '+r[2]+' · '+r[3];document.getElementById('region-desc').textContent=r[5];document.getElementById('cities').textContent=r[4];if(focus){focusRegion(r);playing=false;document.getElementById('play').textContent='Girar';}points.forEach((p,j)=>p.material.color.setHex(i===j?0xffffff:0xcab875));}
const selectEl=document.getElementById('region');data.regions.forEach((r,i)=>{const o=document.createElement('option');o.value=i;o.textContent=r[0];selectEl.append(o)});selectEl.onchange=()=>select(Number(selectEl.value));let playing=true;select(0,false);globe.quaternion.setFromUnitVectors(vec(990,490),new THREE.Vector3(0,0,1));
document.getElementById('play').onclick=e=>{playing=!playing;e.target.textContent=playing?'Pausar':'Girar'};document.getElementById('clouds').onchange=e=>cloud.visible=e.target.checked;document.getElementById('markers').onchange=e=>markers.visible=e.target.checked;document.getElementById('reset').onclick=()=>{camera.position.set(0,.5,8.4);controls.target.set(0,0,0);globe.quaternion.setFromUnitVectors(vec(990,490),new THREE.Vector3(0,0,1));controls.update();};
const raycaster=new THREE.Raycaster(),pointer=new THREE.Vector2();let down=[0,0];renderer.domElement.addEventListener('pointerdown',e=>down=[e.clientX,e.clientY]);renderer.domElement.addEventListener('pointerup',e=>{if(Math.hypot(e.clientX-down[0],e.clientY-down[1])>5||!markers.visible)return;pointer.set(e.clientX/innerWidth*2-1,-e.clientY/innerHeight*2+1);raycaster.setFromCamera(pointer,camera);const hit=raycaster.intersectObjects([ground,...points]);if(hit[0]?.object.userData.region!==undefined)select(hit[0].object.userData.region,true);});
const clock=new THREE.Clock();renderer.setAnimationLoop(()=>{let dt=Math.min(clock.getDelta(),.05);if(playing){globe.rotateY(dt*.035);waterTime.value+=dt;}controls.update();renderer.render(scene,camera)});document.getElementById('loading').remove();addEventListener('resize',()=>{camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight);});
