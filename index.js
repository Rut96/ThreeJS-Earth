import { OrbitControls } from "./src/OrbitControls.js";
import * as THREE from "three";
import getStarFiled from "./src/getStarfield.js";
import { getFresnelMat } from "./src/getFresnelMat.js";

const w = window.innerWidth;
const h = window.innerHeight;
const scene = new THREE.Scene();
const fov = 75, aspect = w / h, near = 0.1, far = 1000;
const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
camera.position.z = 5;
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(w, h);
document.body.appendChild(renderer.domElement);

renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.outputColorSpace = THREE.LinearSRGBColorSpace;

const earthGroup = new THREE.Group();
earthGroup.rotation.z = -24 * Math.PI / 180; // 23.4 -> earth axial tilt
scene.add(earthGroup)
new OrbitControls(camera, renderer.domElement);
const detail = 12;
const loader = new THREE.TextureLoader();
const geo = new THREE.IcosahedronGeometry(1, detail);

// earth mesh
const mat = new THREE.MeshPhongMaterial({
    map: loader.load("./assets/textures/earthmap1k.jpg"),
    specularMap: loader.load("./assets/textures/earthspec1k.jpg"),
    bumpMap: loader.load("./assets/textures/earthbump1k.jpg"),
    bumpScale: 0.04,
});
const earthMesh = new THREE.Mesh(geo, mat);
earthGroup.add(earthMesh);

// lights mesh
const lightsMat = new THREE.MeshBasicMaterial({
    map: loader.load("./assets/textures/earthlights1k.jpg"),
    blending: THREE.AdditiveBlending
});
const lightsMesh = new THREE.Mesh(geo, lightsMat);
earthGroup.add(lightsMesh);

// clouds mesh
const cloudsMat = new THREE.MeshStandardMaterial({
    map: loader.load("./assets/textures/earthcloudmap.jpg"),
    transparent: true,
    opacity: 0.8,
    blending: THREE.AdditiveBlending,
    alphaMap: loader.load('./assets/textures/earthcloudmaptrans.jpg'),

});
const cloudsMesh = new THREE.Mesh(geo, cloudsMat);
cloudsMesh.scale.setScalar(1.003);
earthGroup.add(cloudsMesh);

// glowing
const fresnelMat = getFresnelMat();
const fresnelMesh = new THREE.Mesh(geo, fresnelMat);
fresnelMesh.scale.setScalar(1.01);
earthGroup.add(fresnelMesh);

// stars
const stars = getStarFiled({ numStars: 2000 });
scene.add(stars);

// 'sun' light
const sunLight = new THREE.DirectionalLight(0xffffff);
sunLight.position.set(-2, 0.5, 1.5);
scene.add(sunLight);

function animate() {
    requestAnimationFrame(animate);

    earthMesh.rotation.y += 0.002;
    lightsMesh.rotation.y += 0.002;
    cloudsMesh.rotation.y += 0.0025;
    fresnelMesh.rotation.y += 0.002;
    renderer.render(scene, camera);
}


function handleWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}
window.addEventListener('resize', handleWindowResize, false);

animate();
