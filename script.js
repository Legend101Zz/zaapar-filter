let videoRecorder = null;
let recordFlag = false;
let frameCount; // request animation frame count
let videoPlayer = null;
let storedBlob = null;
let selectionType = "video"; // selection type is photo ro video
let cameraStream = null;
//document.createElement

function createScene() {
  const faceMeshTexturePath = new URL("./gradient.png", import.meta.url).href;
  const manager = new ZapparThree.LoadingManager();
  const renderer = new THREE.WebGLRenderer({ alpha: true });
  renderer.setSize(window.innerWidth, window.innerHeight);

  const img = document.createElement("img");
  const img2 = document.createElement("img");
  const img3 = document.createElement("img");
  const placeButton = document.createElement("button");
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
  // img4.style.width = "60px";
  // img4.style.height = "60px";
  // img4.style.left = 0;
  // img4.style.bottom = 0;
  // img4.style.position = "absolute";

  placeButton.style.width = "60px";
  placeButton.style.height = "60px";
  placeButton.style.left = 0;
  placeButton.style.bottom = 0;
  placeButton.style.position = "absolute";
  // icon not loading
  placeButton.style.backgroundImage = "url('./snapshot.png')";

  document.body.appendChild(renderer.domElement);
  document.body.appendChild(img2);
  document.body.appendChild(img3);
  // document.body.appendChild(img4);
  document.body.appendChild(img);
  document.body.appendChild(placeButton);

  // click snapshot -- clicking blank screen
  placeButton.onclick = function () {
    console.log("clicked");
    // Get canvas from dom
    const canvas = document.querySelector("canvas");

    // Convert canvas data to url
    const url = canvas.toDataURL("image/jpeg", 0.8);

    // Take snapshot
    ZapparSharing({
      data: url,
    });
  };

  // Setup a Zappar camera instead of one of ThreeJS's cameras
  const camera = new ZapparThree.Camera();

  camera.position.y = -4;
  console.log(camera);
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
  // const box = new THREE.Mesh(
  //   new THREE.BoxBufferGeometry(),
  //   new THREE.MeshBasicMaterial({ color: 0x8080ff })
  // );
  // box.scale.set(0.1, 0.1, 0.1);
  // box.position.set(0, 1, 0);
  // trackerGroup.add(box);

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
  const loader = new THREE.GLTFLoader(manager);
  loader.load(
    "./world_cup_trophy-2/Gate1.glb",
    function (gltf) {
      // scene.add(gltf.scene);
      const model = gltf.scene;
      model.scale.set(0.01, 0.01, 0.01);
      model.position.set(0, 1, 0);
      trackerGroup.add(model);
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
  let faceTracker = new ZapparThree.FaceTracker();
  // Set up the face tracking callback function
  faceTracker.onVisible.bind(() => {
    // const pose = faceTracker.pose(ZapparThree.DefaultFaceLandmark.NOSE_TIP);

    // if (pose) {
    //   // Position the 3D model on the user's head
    //   const { position, rotation } = pose;
    //   model.position.set(position[0], position[1], position[2]);
    //   model.rotation.set(rotation[0], rotation[1], rotation[2]);
    let faceLandmarkGroup = new ZapparThree.FaceLandmarkGroup(
      camera,
      faceTracker,
      ZapparThree.FaceLandmarkName.CHIN
    );
    scene.add(faceLandmarkGroup);
    const box = new THREE.Mesh(
      new THREE.BoxBufferGeometry(),
      new THREE.MeshBasicMaterial({ color: 0x8080ff })
    );
    box.scale.set(0.1, 0.1, 0.1);
    // Add in any 3D objects you'd like to track to this face
    faceLandmarkGroup.add(box);
  });

  //old code for getting image;

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

  /*==================== video Recorder setup ====================*/
  async function videoRecorderInit() {
    videoRecorder = await ZapparVideoRecorder.createCanvasVideoRecorder(
      canvas,
      {
        audio: false,
        maxFrameRate: 30,
        speed: 10,
        quality: 10,
      }
    );
    console.log("here");
    // When stop recording update text, and prompt a social share dialog.
    videoRecorder.onComplete.bind(async (result) => {
      storedBlob = result.blob;
      const objectURL = URL.createObjectURL(storedBlob);
      const temp = document.querySelector("#video--preview");
      temp.src = objectURL;
      temp.play();
      temp.style.display = "block";
      document.querySelector("#preview--view").style.display = "block";
    });
  }

  /*==================== Video recording start ====================*/
  function startRecording() {
    if (videoRecorder != null) {
      videoRecorder.start();
      videoRecorder.frameUpdate();
      recordFlag = true;
      setTimeout(function () {
        videoPlayer.play();
        console.log("recorder --> started");
      }, 100);
    }
  }

  /*==================== Video Recording stop ====================*/
  function stopRecording() {
    if (videoRecorder != null) {
      setTimeout(function () {
        videoRecorder.stop();
        recordFlag = false;
        window.cancelAnimationFrame(frameCount);
        frameCount = undefined;
        console.log("recorder --> Stopped");
      }, 800);
    }
  }
  /*============== Share or download the photo or video file ============*/
  function shareDownload(blob, mediaType, type) {
    let getfileArray = generateFilenameAndFileType();
    console.log(`file: ${getfileArray[1]}, fileType: ${getfileArray[0]}`);
    if (type == "download") {
      download(getfileArray[1], blob);
    } else if (type == "share") {
      share(getfileArray[1], getfileArray[0], blob);
    }
    // Generate Random
    function generateRandom() {
      return (
        Math.random().toString(36).substring(2, 15) +
        Math.random().toString(23).substring(2, 5)
      );
    }

    // Generate file name base on type
    function generateFilenameAndFileType() {
      let tempFileType = "";
      let tempFileName = "";
      if (mediaType == "photo") {
        tempFileType = "image/jpeg";
        tempFileName = `${generateRandom()}.png`;
      } else {
        tempFileType = "video/mp4";
        tempFileName = `${generateRandom()}.mp4`;
      }
      return new Array(tempFileType, tempFileName);
    }

    // Share image or video file
    function share(fileName, fileType, inblob) {
      const file = new File([inblob], fileName, { type: fileType });
      const files = [file];
      if (navigator.canShare && navigator.canShare({ files: files })) {
        navigator
          .share({
            files: files,
          })
          .then(() => console.log("Share was successful."))
          .catch((error) => console.log("Sharing failed", error));
      } else {
        download(fileName, inblob);
      }
    }

    // Create download link image or video
    function download(fileName, inblob) {
      const a = document.createElement("a");
      a.style.display = "none";
      a.href = window.URL.createObjectURL(inblob);
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      setTimeout(() => {
        document.body.removeChild(a);
      }, 10000);
    }
  }

  document.querySelector("#capture").addEventListener("click", function () {
    startRecording();
  });

  document.getElementById("share--btn").addEventListener("click", () => {
    console.log("shareBtn --> Clicked");
    if (storedBlob != null) {
      shareDownload(storedBlob, selectionType, "share");
    }
  });

  document.getElementById("download--btn").addEventListener("click", () => {
    console.log("downloadBtn --> Clicked");
    if (storedBlob != null) {
      shareDownload(storedBlob, selectionType, "download");
    }
  });

  document.getElementById("video--player").addEventListener("ended", () => {
    console.log("videoplayer --> Ended");
    if (selectionType == "video" && recordFlag == true) {
      stopRecording();
    }
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

  // function render() {
  //   camera.updateFrame(renderer);
  //   faceBufferGeometry.updateFromFaceAnchorGroup(trackerGroup);
  //   renderer.render(scene, camera);
  // }

  const start = async () => {
    renderer.setAnimationLoop(() => {
      camera.updateFrame(renderer);
      faceBufferGeometry.updateFromFaceAnchorGroup(trackerGroup);
      renderer.render(scene, camera);
    });
  };
  start();
}

/*==================== Fetch data ====================*/
async function fetchData() {
  createScene();
}

/*==================== DOM ContentLoaded ====================*/
fetchData();
