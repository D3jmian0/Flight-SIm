import * as THREE from 'three';

const mount = document.querySelector('#game');
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xc5d9d4);
scene.fog = new THREE.Fog(0xc5d9d4, 650, 2600);
const camera = new THREE.PerspectiveCamera(58, innerWidth / innerHeight, 0.1, 5000);
camera.position.set(0, 9, 23);
const renderer = new THREE.WebGLRenderer({antialias:true});
renderer.setPixelRatio(Math.min(devicePixelRatio, 1.7));
renderer.setSize(innerWidth, innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.15;
mount.appendChild(renderer.domElement);

const hemi = new THREE.HemisphereLight(0xe8f5ff, 0x879b72, 1.5); scene.add(hemi);
const sunLight = new THREE.DirectionalLight(0xffe0b2, 2.2);
sunLight.position.set(-300,450,-250); sunLight.castShadow=true;
sunLight.shadow.mapSize.set(2048,2048); sunLight.shadow.camera.left=-500; sunLight.shadow.camera.right=500; sunLight.shadow.camera.top=500; sunLight.shadow.camera.bottom=-500;
scene.add(sunLight);

const mat=(color,roughness=1)=>new THREE.MeshStandardMaterial({color,roughness});
const groundMat=mat(0x9eb58b), grassMat=mat(0x88a77e), runwayMat=mat(0x777f7a), whiteMat=mat(0xf2edda), darkMat=mat(0x46544e), woodMat=mat(0xb9a17c), roofMat=mat(0x71877d);
const ground=new THREE.Mesh(new THREE.PlaneGeometry(5000,5000),groundMat); ground.rotation.x=-Math.PI/2; ground.position.y=-1; ground.receiveShadow=true; scene.add(ground);

// Gentle terrain patches
for(let i=0;i<34;i++){
  const x=(Math.random()-.5)*2100,z=(Math.random()-.5)*2100;
  const patch=new THREE.Mesh(new THREE.CircleGeometry(35+Math.random()*90,12),mat(i%2?0x9bb487:0x8eaa80));
  patch.rotation.x=-Math.PI/2; patch.position.set(x,-.94,z); scene.add(patch);
}
// Runway, aligned along Z
const runway=new THREE.Mesh(new THREE.BoxGeometry(38,.25,520),runwayMat); runway.position.set(0,-.72,0); runway.receiveShadow=true; runway.castShadow=true; scene.add(runway);
const shoulder=new THREE.Mesh(new THREE.BoxGeometry(52,.12,540),mat(0xb1b59b)); shoulder.position.set(0,-.82,0); scene.add(shoulder); scene.remove(runway); scene.add(runway);
for(let z=-235;z<=235;z+=40){const stripe=new THREE.Mesh(new THREE.BoxGeometry(1,.03,20),whiteMat);stripe.position.set(0,-.57,z);scene.add(stripe)}
for(const x of [-18.5,18.5]){const edge=new THREE.Mesh(new THREE.BoxGeometry(.7,.03,520),whiteMat);edge.position.set(x,-.56,0);scene.add(edge)}
// Hangar and little terminal
function building(x,z,w,d,h,color=0xd7d0b9){
 const g=new THREE.Group();const body=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),mat(color));body.position.y=h/2;body.castShadow=true;body.receiveShadow=true;g.add(body);
 const roof=new THREE.Mesh(new THREE.ConeGeometry(w*.78, h*.42,4),roofMat);roof.rotation.y=Math.PI/4;roof.scale.z=d/w;roof.position.y=h+h*.18;roof.castShadow=true;g.add(roof);
 g.position.set(x,-.9,z);scene.add(g);return g;
}
building(-95,45,90,72,28,0xd9d4c1); building(100,80,55,45,16,0xe6dfcc);
const hangarDoor=new THREE.Mesh(new THREE.BoxGeometry(50,19,.8),mat(0x82988d));hangarDoor.position.set(-95,8.6,8.8);scene.add(hangarDoor);
// Lake
const lake=new THREE.Mesh(new THREE.CircleGeometry(190,64),new THREE.MeshStandardMaterial({color:0x78aeb0,roughness:.25,metalness:.08}));lake.rotation.x=-Math.PI/2;lake.position.set(520,-.88,-500);lake.scale.set(1.3,1,1);scene.add(lake);
// Trees, low-poly clusters
function tree(x,z,s=1){
 const g=new THREE.Group();const trunk=new THREE.Mesh(new THREE.CylinderGeometry(1.2*s,1.8*s,9*s,5),mat(0x806b50));trunk.position.y=4.5*s;g.add(trunk);
 for(let j=0;j<3;j++){const crown=new THREE.Mesh(new THREE.ConeGeometry((8-j*1.4)*s,15*s,6),mat([0x6f9475,0x7f9f78,0x91a982][j]));crown.position.y=(11+j*6)*s; crown.castShadow=true;g.add(crown)}
 g.position.set(x,-.9,z);scene.add(g);
}
for(let i=0;i<250;i++){
 let x=(Math.random()-.5)*2200,z=(Math.random()-.5)*2200;
 if(Math.abs(x)<150&&Math.abs(z)<330)continue;
 if((x-520)**2/((250)**2)+(z+500)**2/((250)**2)<1)continue;
 tree(x,z,.55+Math.random()*.9);
}
// Clouds
const cloudGroup=new THREE.Group();scene.add(cloudGroup);
for(let i=0;i<36;i++){
 const c=new THREE.Group();const n=4+Math.floor(Math.random()*4);
 for(let j=0;j<n;j++){const puff=new THREE.Mesh(new THREE.SphereGeometry(18+Math.random()*15,10,8),new THREE.MeshStandardMaterial({color:0xffffff,roughness:1,transparent:true,opacity:.82}));puff.position.set((Math.random()-.5)*48,Math.random()*15,(Math.random()-.5)*35);c.add(puff)}
 c.position.set((Math.random()-.5)*1900,220+Math.random()*170,(Math.random()-.5)*1900);c.userData.baseX=c.position.x;cloudGroup.add(c);
}

// Build a friendly single-engine high-wing plane
const plane=new THREE.Group();scene.add(plane);
const fuselageMat=mat(0xf0eee1), accentMat=mat(0xd28e67), glassMat=new THREE.MeshStandardMaterial({color:0x7da6a8,metalness:.25,roughness:.18});
function mesh(geo,material,pos=[0,0,0],rot=[0,0,0],parent=plane){
 const m=new THREE.Mesh(geo,material);m.position.set(...pos);m.rotation.set(...rot);m.castShadow=true;m.receiveShadow=true;parent.add(m);return m;
}
mesh(new THREE.CapsuleGeometry(1.05,8,6,12),fuselageMat,[0,0,0],[Math.PI/2,0,0]);
// nose and tail
mesh(new THREE.ConeGeometry(1.05,3.2,12),accentMat,[0,0,-6.2],[Math.PI/2,0,0]);
mesh(new THREE.BoxGeometry(8,.22,2.1),fuselageMat,[0,0,4.2]);
mesh(new THREE.BoxGeometry(2.6,.18,1.3),accentMat,[0,0,4.25]);
mesh(new THREE.BoxGeometry(2.1,.18,2.3),fuselageMat,[0,0,2.7]);
mesh(new THREE.BoxGeometry(15,.35,3.2),fuselageMat,[0,1.1,-.3]);
mesh(new THREE.BoxGeometry(15,.12,.35),accentMat,[0,1.3,-.3]);
mesh(new THREE.BoxGeometry(3.2,.45,1.7),fuselageMat,[0,-.3,0]);
mesh(new THREE.BoxGeometry(1.8,1.6,1.6),glassMat,[0,1.05,-2.5],[.15,0,0]);
// landing gear
for(const x of [-3.4,3.4]){mesh(new THREE.CylinderGeometry(.12,.12,1.4,8),darkMat,[x,-1.1,-1.2],[0,0,.15]);mesh(new THREE.TorusGeometry(.55,.18,8,14),darkMat,[x,-1.9,-1.2],[Math.PI/2,0,0])}
mesh(new THREE.CylinderGeometry(.12,.12,1.4,8),darkMat,[0,-1.1,4.8]);
const propGroup=new THREE.Group();propGroup.position.set(0,0,-7.5);plane.add(propGroup);
mesh(new THREE.BoxGeometry(.22,5.5,.16),darkMat,[0,0,0],[0,0,0],propGroup);
mesh(new THREE.SphereGeometry(.35,12,8),accentMat,[0,0,0],[0,0,0],propGroup);
// paint stripe
mesh(new THREE.BoxGeometry(2.12,.18,5.8),accentMat,[0,.05,-.3]);

const keys={};addEventListener('keydown',e=>{keys[e.code]=true;if(e.code==='KeyR')resetPlane()});
addEventListener('keyup',e=>keys[e.code]=false);
let pointerDown=false,lastX=0,lastY=0,cameraYaw=0,cameraPitch=.18;
renderer.domElement.addEventListener('pointerdown',e=>{pointerDown=true;lastX=e.clientX;lastY=e.clientY;renderer.domElement.setPointerCapture(e.pointerId)});
renderer.domElement.addEventListener('pointerup',()=>pointerDown=false);
renderer.domElement.addEventListener('pointermove',e=>{if(!pointerDown)return;cameraYaw-=(e.clientX-lastX)*.004;cameraPitch=THREE.MathUtils.clamp(cameraPitch+(e.clientY-lastY)*.003,-.05,.8);lastX=e.clientX;lastY=e.clientY});
let speed=0, throttle=.28, pitch=0, roll=0, yaw=0, verticalSpeed=0, heading=0, fuel=80;
let wind=12,windDir=270,gust=1,payload=50,clouds=25,sun=75,hour=17.5;
const clock=new THREE.Clock();
function resetPlane(){plane.position.set(0,1,190);plane.rotation.set(0,Math.PI,0);speed=0;throttle=.28;pitch=roll=yaw=verticalSpeed=0;heading=0;toast('Gotowy do lotu – zwiększ gaz ✈')}
function toast(msg){const t=document.querySelector('#toast');t.textContent=msg;t.classList.add('show');clearTimeout(toast.timer);toast.timer=setTimeout(()=>t.classList.remove('show'),2300)}
resetPlane();

function updateLighting(){
 const t=hour/24*Math.PI*2-Math.PI/2;
 const daylight=Math.max(.12,Math.sin(t)*.85+.2)*(sun/100+.15);
 const warm=hour<6||hour>18;
 sunLight.position.set(Math.cos(t)*500,Math.max(70,Math.sin(t)*500),-260);
 sunLight.intensity=daylight*2.5;
 sunLight.color.set(warm?0xffc28e:0xffedcf);
 hemi.intensity=.45+daylight*.9;
 const sky=new THREE.Color().setHSL(.53,.28,.48+daylight*.13);
 scene.background=sky;scene.fog.color.copy(sky);
 cloudGroup.children.forEach(c=>c.children.forEach(p=>p.material.opacity=.35+(clouds/100)*.58));
}
function updateUI(){
 document.querySelector('#speed').textContent=Math.round(speed*3.6);
 document.querySelector('#altitude').textContent=Math.max(0,Math.round(plane.position.y));
 document.querySelector('#heading').textContent=String((Math.round((heading*180/Math.PI+360)%360))).padStart(3,'0');
}
function animate(){
 requestAnimationFrame(animate);const dt=Math.min(clock.getDelta(),.04);
 const windRad=windDir*Math.PI/180;
 const gustFactor=gust===0?0:gust===1?.12:.28;
 const windX=Math.sin(windRad)*wind/3.6;
 const windZ=Math.cos(windRad)*wind/3.6;
 if(keys.ShiftLeft||keys.ShiftRight)throttle=Math.min(1,throttle+dt*.22);
 if(keys.ControlLeft||keys.ControlRight)throttle=Math.max(0,throttle-dt*.22);
 const massFactor=1+payload/700;
 const targetSpeed=throttle*62/massFactor;
 speed=THREE.MathUtils.damp(speed,targetSpeed,throttle>.1?1.0:1.8,dt);
 const steering=(keys.KeyA||keys.ArrowLeft?1:0)-(keys.KeyD||keys.ArrowRight?1:0);
 const pitchInput=(keys.KeyW||keys.ArrowUp?1:0)-(keys.KeyS||keys.ArrowDown?1:0);
 const rudder=(keys.KeyE?1:0)-(keys.KeyQ?1:0);
 roll=THREE.MathUtils.damp(roll,steering*.62,2.3,dt);
 pitch=THREE.MathUtils.damp(pitch,pitchInput*.28,1.7,dt);
 yaw+=(-steering*.34+rudder*.55)*dt*(.25+speed/40);
 heading=(Math.PI-yaw+Math.PI*2)%(Math.PI*2);
 const lift=Math.max(0,(speed-20)*.052)/massFactor;
 const windLift=Math.sin(windRad-yaw)*wind/180;
 verticalSpeed+=(lift+pitch*speed*.09+windLift-0.28)*dt;
 verticalSpeed*=Math.pow(.985,dt*60);
 if(keys.Space) speed=Math.max(0,speed-dt*20);
 plane.position.x+=Math.sin(yaw)*speed*dt+windX*dt*.18;
 plane.position.z-=Math.cos(yaw)*speed*dt+windZ*dt*.18;
 plane.position.y+=verticalSpeed*dt;
 if(plane.position.y<1){plane.position.y=1;verticalSpeed=Math.max(0,verticalSpeed);if(speed<10)throttle=Math.max(throttle,0)}
 // light, responsive turbulence
 const turbulence=Math.sin(clock.elapsedTime*2.1)*gustFactor*(wind/60);
 plane.rotation.set(pitch+turbulence*.08, yaw, -roll+turbulence*.18,'YXZ');
 propGroup.rotation.z+=dt*(12+throttle*85);
 // Chase camera, orbitable with pointer
 const behind=new THREE.Vector3(Math.sin(yaw+cameraYaw)*25,8+cameraPitch*18,Math.cos(yaw+cameraYaw)*25);
 const desired=plane.position.clone().add(new THREE.Vector3(behind.x,behind.y,behind.z));
 camera.position.lerp(desired,1-Math.exp(-3*dt));
 const look=plane.position.clone().add(new THREE.Vector3(0,1,-8));
 camera.lookAt(look);
 cloudGroup.children.forEach(c=>{c.position.x+=dt*(.7+wind/20);if(c.position.x>1100)c.position.x=-1100});
 updateUI();renderer.render(scene,camera);
}
animate();
addEventListener('resize',()=>{camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight)});

// UI
const panel=document.querySelector('#panel');
document.querySelector('#panel-toggle').onclick=()=>panel.classList.add('open');
document.querySelector('#close-panel').onclick=()=>panel.classList.remove('open');
document.querySelector('#reset').onclick=resetPlane;
const bind=(id,fn)=>document.querySelector('#'+id).addEventListener('input',e=>fn(+e.target.value));
bind('wind',v=>{wind=v;document.querySelector('#wind-value').textContent=v+' km/h'});
bind('wind-dir',v=>{windDir=v;document.querySelector('#wind-dir-value').textContent=v+'°'});
bind('gust',v=>{gust=v;document.querySelector('#gust-value').textContent=['Wyłączone','Lekkie','Mocne'][v]});
bind('payload',v=>{payload=v;document.querySelector('#payload-value').textContent=v+' kg'});
bind('fuel',v=>{fuel=v;document.querySelector('#fuel-value').textContent=v+'%'});
bind('time',v=>{hour=v;const h=Math.floor(v),m=Math.round((v-h)*60);document.querySelector('#time-value').textContent=String(h).padStart(2,'0')+':'+String(m).padStart(2,'0');updateLighting()});
bind('clouds',v=>{clouds=v;document.querySelector('#cloud-value').textContent=v+'%';updateLighting()});
bind('sun',v=>{sun=v;document.querySelector('#sun-value').textContent=v+'%';updateLighting()});
updateLighting();

// Gentle procedural ambient music (no external audio files)
let audioCtx=null,musicOn=false,oscillators=[];
function startMusic(){
 audioCtx=new (window.AudioContext||window.webkitAudioContext)();
 const master=audioCtx.createGain();master.gain.value=.055;master.connect(audioCtx.destination);
 const notes=[130.81,164.81,196,261.63];
 notes.forEach((freq,i)=>{const o=audioCtx.createOscillator(),g=audioCtx.createGain(),filter=audioCtx.createBiquadFilter();o.type='sine';o.frequency.value=freq;g.gain.value=i===0?.5:.16;filter.type='lowpass';filter.frequency.value=550;o.connect(filter);filter.connect(g);g.connect(master);o.start();oscillators.push(o)});
 const lfo=audioCtx.createOscillator(),lg=audioCtx.createGain();lfo.frequency.value=.12;lg.gain.value=.018;lfo.connect(lg);lg.connect(master.gain);lfo.start();oscillators.push(lfo);
}
document.querySelector('#music').onclick=async()=>{const b=document.querySelector('#music');if(!musicOn){startMusic();musicOn=true;b.textContent='♫ Wycisz lo-fi';toast('Spokojnego lotu 🎧')}else{oscillators.forEach(o=>o.stop());oscillators=[];audioCtx.close();musicOn=false;b.textContent='♫ Włącz lo-fi'}};
