import * as THREE from 'three';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';

function create(canvas,auto=false){
 const scene=new THREE.Scene(); scene.background=new THREE.Color(0x080a0e);
 const camera=new THREE.PerspectiveCamera(45,1,.01,1000); camera.position.set(3,2,5);
 const renderer=new THREE.WebGLRenderer({canvas,antialias:true}); renderer.setPixelRatio(Math.min(devicePixelRatio,2)); renderer.outputColorSpace=THREE.SRGBColorSpace; renderer.toneMapping=THREE.ACESFilmicToneMapping; renderer.toneMappingExposure=1.15;
 const controls=new OrbitControls(camera,canvas); controls.enableDamping=true; controls.autoRotate=auto; controls.autoRotateSpeed=.8; controls.minDistance=.2; controls.maxDistance=100;
 scene.add(new THREE.HemisphereLight(0xffffff,0x30343b,2)); const a=new THREE.DirectionalLight(0xffffff,3);a.position.set(4,6,5);scene.add(a);const b=new THREE.DirectionalLight(0x9ab8ff,1.5);b.position.set(-4,2,-3);scene.add(b);
 function resize(){const r=canvas.getBoundingClientRect();renderer.setSize(Math.max(1,r.width),Math.max(1,r.height),false);camera.aspect=r.width/r.height;camera.updateProjectionMatrix()} addEventListener('resize',resize);resize();
 (function loop(){requestAnimationFrame(loop);controls.update();renderer.render(scene,camera)})(); return {scene,camera,controls};
}
const hero=create(document.querySelector('#heroCanvas'),true), main=create(document.querySelector('#canvas'));
function placeholder(){const m=new THREE.Mesh(new THREE.IcosahedronGeometry(1.2,2),new THREE.MeshStandardMaterial({color:0xd9ff4a,metalness:.35,roughness:.3}));hero.scene.add(m)} placeholder();
const loader=new GLTFLoader(); let current;
function load(url){const status=document.querySelector('#status');status.style.display='grid';status.textContent='Carregando modelo.glb…';loader.load(url,g=>{if(current)main.scene.remove(current);current=g.scene;main.scene.add(current);const box=new THREE.Box3().setFromObject(current),size=box.getSize(new THREE.Vector3()),center=box.getCenter(new THREE.Vector3()),max=Math.max(size.x,size.y,size.z)||1;current.position.sub(center);current.scale.setScalar(3/max);main.camera.position.set(3.2,2.1,4.2);main.controls.target.set(0,0,0);main.controls.update();status.style.display='none';},undefined,e=>{console.error(e);status.textContent='Erro ao carregar o modelo. Verifique se models/modelo.glb existe e se a publicação foi atualizada.'});}
load('./models/modelo.glb');
document.querySelector('#file').addEventListener('change',e=>{const f=e.target.files[0];if(f)load(URL.createObjectURL(f))});
