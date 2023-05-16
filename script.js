// import { GLTFLoader } from "./node_modules/three/examples/jsm/loaders/GLTFLoader";
const faceMeshTexturePath = new URL("./gradient.png", import.meta.url).href;
const manager = new ZapparThree.LoadingManager();
const renderer = new THREE.WebGLRenderer({ alpha: true });
// renderer.setSize(768, 1024);
// renderer.setSize(500, 500);
// 768 × 1024
renderer.setSize(window.innerWidth, window.innerHeight);

const img = document.createElement("img");
const img2 = document.createElement("img");
const img3 = document.createElement("img");
const img4 = document.createElement("img");
img.src = "./slogan.png";
img2.src = "./gradient.png";
img3.src = "./logo.png";
img4.src = "./snapshot.png";

//slogan image here
img.style.width = renderer.domElement.width;
img.style.height = renderer.domElement.height;
img.style.right = 0;
img.style.bottom = 0;
img.style.position = "absolute";

//gradient here
img2.style.width = "100%";
img2.style.height = "100%";
img2.style.position = "absolute";
img2.style.backgroundSize = "cover";
img2.style.backgroundRepeat = "no-repeat";
renderer.domElement.style.position = "absolute";

//logo here

img3.style.width = renderer.domElement.width * 2;
img3.style.height = renderer.domElement.height * 2;
img3.style.backgroundSize = "10px";
img3.style.right = 0;
img3.style.top = 0;
img3.style.position = "absolute";

//button here
img4.style.width = "60px";
img4.style.height = "60px";
img4.style.left = 0;
img4.style.bottom = 0;
img4.style.position = "absolute";

// document.body.appendChild(renderer.domElement);

console.log("here");

document.body.appendChild(renderer.domElement);
document.body.appendChild(img2);
document.body.appendChild(img3);
document.body.appendChild(img4);
document.body.appendChild(img);
renderer.setAnimationLoop(render);

// Setup a Zappar camera instead of one of ThreeJS's cameras
const camera = new ZapparThree.Camera();

// The Zappar library needs your WebGL context, so pass it
ZapparThree.glContextSet(renderer.getContext());

// Create a ThreeJS Scene and set its background to be the camera background texture
const scene = new THREE.Scene();

// Request the necessary permission from the user
ZapparThree.permissionRequestUI().then((granted) => {
  if (granted)
    camera.start(true); // For face tracking let's use the user-facing camera
  else ZapparThree.permissionDeniedUI();
});

scene.background = camera.backgroundTexture;

// face tracking begins
const tracker = new ZapparThree.FaceTrackerLoader(manager).load();
const trackerGroup = new ZapparThree.FaceAnchorGroup(camera, tracker);
scene.add(trackerGroup);
// add some content
const box = new THREE.Mesh(
  new THREE.BoxBufferGeometry(),
  new THREE.MeshBasicMaterial({ color: 0x8080ff })
);
box.scale.set(0.1, 0.1, 0.1);
box.position.set(0, 1, 0);
trackerGroup.add(box);

const faceMesh = new ZapparThree.FaceMeshLoader(manager).load();
const faceBufferGeometry = new ZapparThree.FaceBufferGeometry(faceMesh);
const faceMeshObject = new THREE.Mesh(
  faceBufferGeometry,
  new THREE.MeshStandardMaterial({
    map: new THREE.TextureLoader(manager).load(faceMeshTexturePath),
    transparent: true,
  })
);
trackerGroup.add(faceMeshObject);
// face tacking ends

// Load the 3D model
// const loader = new THREE.GLTFLoader();
const loader = new THREE.GLTFLoader(manager);
console.log(loader);
// loader.load("./world_cup_trophy-2/pikachu.glb", function (gltf) {
//   const model = gltf.scene;
//   model.scale.set(1, 1, 1);
//   model.position.set(0, 0.1, 0);

//   // Add the 3D model to the scene
//   scene.add(model);
// });

loader.load(
  "./world_cup_trophy-2/Gate1.glb",
  function (gltf) {
    // scene.add(gltf.scene);
    const model = gltf.scene;
    model.scale.set(0.01, 0.01, 0.01);
    model.position.set(0, 0.1, 0);

    trackerGroup.add(model);
    // scene.add(model);
  },
  (xhr) => {
    console.log(
      (xhr.loaded / xhr.total) * 100 + "% loaded model loaded sucess"
    );
  },
  (error) => {
    console.log(error);
  }
);
// Set up the face tracking callback function
faceTracker.onVisible.bind(() => {
  const pose = faceTracker.pose(ZapparThree.DefaultFaceLandmark.NOSE_TIP);

  if (pose) {
    // Position the 3D model on the user's head
    const { position, rotation } = pose;
    model.position.set(position[0], position[1], position[2]);
    model.rotation.set(rotation[0], rotation[1], rotation[2]);
  }
});

// const logo = new Image();
// logo.src = "logo.png";
// logo.onload = function () {
//   // Create a new canvas element
//   const canvas = document.createElement("canvas");
//   canvas.width = logo.width;
//   canvas.height = logo.height;

//   // Draw the image onto the canvas
//   const ctx = canvas.getContext("2d");
//   ctx.drawImage(logo, 0, 0);

//   // Create a new texture from the canvas
//   const texture = new THREE.CanvasTexture(canvas);

//   // Create a new material with the texture
//   const material = new THREE.SpriteMaterial({ map: texture });

//   // Create a new sprite with the geometry and material
//   const sprite = new THREE.Sprite(material);

//   // Set the position of the sprite to the top right corner
//   sprite.position.set(1.5, 3.2, 0);
//   sprite.scale.set(logo.width / logo.height, 1, 1);

//   // Add the sprite to the scene
//   scene.add(sprite);
// };

// const slogan = new Image();
// slogan.src = "slogan.png";
// slogan.onload = function () {
//   // Create a new canvas element
//   const canvas = document.createElement("canvas");
//   canvas.width = slogan.width;
//   canvas.height = slogan.height;

//   // Draw the image onto the canvas
//   const ctx = canvas.getContext("2d");
//   ctx.drawImage(slogan, 0, 0);

//   // Create a new texture from the canvas
//   const texture = new THREE.CanvasTexture(canvas);
//   texture.needsUpdate = true;

//   // Create a new material with the texture
//   const material = new THREE.SpriteMaterial({ map: texture });

//   // Create a new sprite with the geometry and material
//   const sprite = new THREE.Sprite(material);

//   // Set the position of the sprite to the top right corner
//   sprite.position.set(1.3, -3.05, 0);
//   sprite.scale.set((slogan.width / slogan.height) * 1.5, 1.5, 1);

//   // Add the sprite to the scene
//   scene.add(sprite);
// };

// const btn = new Image();
// btn.src = "snapshot.png";
// btn.onload = function () {
//   // Create a new canvas element
//   const canvas = document.createElement("canvas");
//   canvas.width = btn.width;
//   canvas.height = btn.height;

//   // Draw the image onto the canvas
//   const ctx = canvas.getContext("2d");
//   ctx.drawImage(btn, 0, 0);

//   // Create a new texture from the canvas
//   const texture = new THREE.CanvasTexture(canvas);

//   // Create a new material with the texture
//   const material = new THREE.SpriteMaterial({ map: texture });

//   // Create a new sprite with the geometry and material
//   const sprite = new THREE.Sprite(material);

//   // Set the position of the sprite to the top right corner
//   sprite.position.set(-1.4, -3.4, 0);
//   sprite.scale.set((btn.width / btn.height) * 0.5, 0.5, 1);

//   // Add the sprite to the scene
//   scene.add(sprite);
// };

// const gradient = new Image();
// gradient.src = "gradient.png";
// gradient.onload = function () {
//   // Create a new canvas element
//   const canvas = document.createElement("canvas");
//   canvas.width = gradient.width;
//   canvas.height = gradient.height;

//   // Draw the image onto the canvas
//   const ctx = canvas.getContext("2d");
//   ctx.drawImage(gradient, 0, 0);

//   // Create a new texture from the canvas
//   const texture = new THREE.CanvasTexture(canvas);

//   // Create a new material with the texture
//   const material = new THREE.SpriteMaterial({ map: texture, opacity: 0.5 });

//   // Create a new sprite with material
//   const sprite = new THREE.Sprite(material);

//   // Set the position of the sprite to the top right corner
//   sprite.position.set(0, 0, 0);
//   sprite.scale.set((gradient.width / gradient.height) * 6, 8, 1);

//   // Add the sprite to the scene
//   scene.add(sprite);
// };

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

const light = new THREE.AmbientLight("rgb(255,255,255)");
scene.add(light);

const light2 = new THREE.HemisphereLight(0xfff0f0, 0x606066);
light.position.set(0, 1, 1);
scene.add(light2);

const spotLight = new THREE.SpotLight("rgb(255,255,255)");
spotLight.position.set(100, 1000, 1000);
spotLight.castShadow = true;
scene.add(spotLight);

function render() {
  camera.updateFrame(renderer);
  faceBufferGeometry.updateFromFaceAnchorGroup(trackerGroup);
  renderer.render(scene, camera);
}
