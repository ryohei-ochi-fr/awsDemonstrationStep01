import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { ColladaLoader } from 'three/examples/jsm/loaders/ColladaLoader.js';

const router = require("express").Router();

// シーンの準備
const scene = new THREE.Scene();

// カメラの準備
const camera = new THREE.PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight,
  1,
  2000,
);
camera.position.z = 20;

// レンダラーの準備
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x7fbfff, 1.0);
document.body.appendChild(renderer.domElement);

// ライトの準備
const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
scene.add(ambientLight);
const directionalLight = new THREE.DirectionalLight(0xffffff);
directionalLight.position.set(-1, 1, 1).normalize();
scene.add(directionalLight);

// Colladaファイルの読み込み
let object;
const loader = new ColladaLoader();
loader.load('./models/collada/elf/elf.dae', function (collada) {
  // シーンへのモデルの追加
  scene.add(collada.scene);
});

// コントローラの準備
const controls = new OrbitControls(camera, document.body);

// アニメーションループの開始
function animate() {
  requestAnimationFrame(animate);

  // コントローラの更新
  controls.update();

  renderer.render(scene, camera);
}