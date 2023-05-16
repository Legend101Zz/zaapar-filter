import * as THREE from "three";
import ZapparWebGLSnapshot from "@zappar/sharing";
const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(75, 360 / 720, 0.1, 1000);
camera.position.z = 5;

const renderer = new THREE.WebGLRenderer();
renderer.setSize(360, 720);
document.body.appendChild(renderer.domElement);

const logo = new Image();
logo.src = "logo.png";
logo.onload = function () {
  // Create a new canvas element
  const canvas = document.createElement("canvas");
  canvas.width = logo.width;
  canvas.height = logo.height;

  // Draw the image onto the canvas
  const ctx: any = canvas.getContext("2d");
  ctx.drawImage(logo, 0, 0);

  // Create a new texture from the canvas
  const texture = new THREE.CanvasTexture(canvas);

  // Create a new material with the texture
  const material = new THREE.SpriteMaterial({ map: texture });

  // Create a new sprite with the geometry and material
  const sprite = new THREE.Sprite(material);

  // Set the position of the sprite to the top right corner
  sprite.position.set(1.5, 3.2, 0);
  sprite.scale.set(logo.width / logo.height, 1, 1);

  // Add the sprite to the scene
  scene.add(sprite);
};

const slogan = new Image();
slogan.src = "slogan.png";
slogan.onload = function () {
  // Create a new canvas element
  const canvas = document.createElement("canvas");
  canvas.width = slogan.width;
  canvas.height = slogan.height;

  // Draw the image onto the canvas
  const ctx: any = canvas.getContext("2d");
  ctx.drawImage(slogan, 0, 0);

  // Create a new texture from the canvas
  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;

  // Create a new material with the texture
  const material = new THREE.SpriteMaterial({ map: texture });

  // Create a new sprite with the geometry and material
  const sprite = new THREE.Sprite(material);

  // Set the position of the sprite to the top right corner
  sprite.position.set(1.3, -3, 0);
  sprite.scale.set((slogan.width / slogan.height) * 1.5, 1.5, 1);

  // Add the sprite to the scene
  scene.add(sprite);
};

const btn = new Image();
btn.src = "snapshot.png";
btn.onload = function () {
  // Create a new canvas element
  const canvas = document.createElement("canvas");
  canvas.width = btn.width;
  canvas.height = btn.height;

  // Draw the image onto the canvas
  const ctx: any = canvas.getContext("2d");
  ctx.drawImage(btn, 0, 0);

  // Create a new texture from the canvas
  const texture = new THREE.CanvasTexture(canvas);

  // Create a new material with the texture
  const material = new THREE.SpriteMaterial({ map: texture });

  // Create a new sprite with the geometry and material
  const sprite = new THREE.Sprite(material);

  // Set the position of the sprite to the top right corner
  sprite.position.set(-1.4, -3.4, 0);
  sprite.scale.set((btn.width / btn.height) * 0.5, 0.5, 1);

  // Add the sprite to the scene
  scene.add(sprite);
};

const gradient = new Image();
gradient.src = "gradient.png";
gradient.onload = function () {
  // Create a new canvas element
  const canvas = document.createElement("canvas");
  canvas.width = gradient.width;
  canvas.height = gradient.height;

  // Draw the image onto the canvas
  const ctx: any = canvas.getContext("2d");
  ctx.drawImage(gradient, 0, 0);

  // Create a new texture from the canvas
  const texture = new THREE.CanvasTexture(canvas);

  // Create a new material with the texture
  const material = new THREE.SpriteMaterial({ map: texture, opacity: 0.5 });

  // Create a new sprite with material
  const sprite = new THREE.Sprite(material);

  // Set the position of the sprite to the top right corner
  sprite.position.set(0, 0, 0);
  sprite.scale.set((gradient.width / gradient.height) * 6, 8, 1);

  // Add the sprite to the scene
  scene.add(sprite);
};
// Get a reference to the 'Snapshot' button so we can attach a 'click' listener
const placeButton =
  document.getElementById("snapshot") || document.createElement("div");

placeButton.addEventListener("click", () => {
  // Get canvas from dom
  const canvas =
    document.querySelector("canvas") || document.createElement("canvas");

  // Convert canvas data to url
  const url = canvas.toDataURL("image/jpeg", 0.8);

  // Take snapshot
  ZapparWebGLSnapshot({
    data: url,
  });
});

let cube;
const loader = new THREE.TextureLoader();
loader.load("metal003.png", (texture) => {
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(2, 2);

  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const material = new THREE.MeshLambertMaterial({ map: texture });
  cube = new THREE.Mesh(geometry, material);
  scene.add(cube);

  draw();
});

const light = new THREE.AmbientLight("rgb(255,255,255)");
scene.add(light);

const spotLight = new THREE.SpotLight("rgb(255,255,255)");
spotLight.position.set(100, 1000, 1000);
spotLight.castShadow = true;
scene.add(spotLight);

function draw() {
  cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;
  renderer.render(scene, camera);

  requestAnimationFrame(draw);
}
