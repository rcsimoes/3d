import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js';
import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.180.0/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'https://cdn.jsdelivr.net/npm/three@0.180.0/examples/jsm/loaders/GLTFLoader.js';

function setup(canvas, small=false){
  const scene=new THREE.Scene();
  scene.background=new THREE.Color(small?0x111318:0x08090b);
  const camera=new THREE.PerspectiveCamera(45,1,.01,100);
  camera.position.set(3,2,5);
  const renderer=new THREE.WebGLRenderer({canvas,antialias:true,alpha:false});
  renderer.setPixelRatio(Math.min(devicePixelRatio,2));
  renderer.outputColorSpace=THREE.SRGBColorSpace;
  renderer.toneMapping=THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure=1.15;
  const controls=new OrbitControls(camera,canvas);
  controls.enableDamping=true; controls.autoRotate=small; controls.autoRotateSpeed=.8;
  controls.minDistance=.5; controls.maxDistance=20;
  scene.add(new THREE.HemisphereLight(0xffffff,0x303540,2.2));
  const key=new THREE.DirectionalLight(0xffffff,3); key.position.set(4,6,5); scene.add(key);
  const fill=new THREE.DirectionalLight(0x99bbff,1.4); fill.position.set(-4,2,-3); scene.add(fill);

  const group=new THREE.Group(); scene.add(group);
  const material=new THREE.MeshStandardMaterial({color:0xd9ff4a,metalness:.35,roughness:.28});
  const geo=new THREE.IcosahedronGeometry(1.35,2);
  const obj=new THREE.Mesh(geo,material); group.add(obj);

  function resize(){
    const r=canvas.getBoundingClientRect(); const w=Math.max(1,r.width),h=Math.max(1,r.height);
    renderer.setSize(w,h,false); camera.aspect=w/h; camera.updateProjectionMatrix();
  }
  addEventListener('resize',resize); resize();
  function frame(){requestAnimationFrame(frame); controls.update(); renderer.render(scene,camera)} frame();

  return {scene,camera,renderer,controls,group,obj};
}
const hero=setup(document.querySelector('#hero-canvas'),true);
const main=setup(document.querySelector('#scene'),false);
const loader=new GLTFLoader();

function loadGLTF(url){
  document.querySelector('#loading').style.display='grid';
  loader.load(url,g=>{
    while(main.group.children.length) main.group.remove(main.group.children[0]);
    const model=g.scene; main.group.add(model);
    const box=new THREE.Box3().setFromObject(model), size=box.getSize(new THREE.Vector3()), center=box.getCenter(new THREE.Vector3());
    model.position.sub(center);
    const max=Math.max(size.x,size.y,size.z)||1;
    const s=3/max; model.scale.setScalar(s);
    main.camera.position.set(3.2,2.1,4.2); main.controls.target.set(0,0,0); main.controls.update();
    document.querySelector('#loading').style.display='none';
  },undefined,e=>{
    document.querySelector('#loading').textContent='Não foi possível carregar o modelo. Verifique o arquivo.';
    console.error(e);
  });
}
loadGLTF('models/modelo.glb');

document.querySelector('#modelInput').addEventListener('change',e=>{
  const file=e.target.files[0]; if(!file)return;
  loadGLTF(URL.createObjectURL(file));
});
