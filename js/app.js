var scene
, camera
, cameraControl
, cameraPositionDefault =  {x: 700, y: 0, z: 0}
, hemiLight
, dirLight
, renderer
, meshes = []
, spheres = []
, ground
, axes
;

function init () {
  // create scene
  scene = new THREE.Scene();

  // create camera
  camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 1, 100000);
  camera.position.set(cameraPositionDefault.x, cameraPositionDefault.y, cameraPositionDefault.z);
  camera.lookAt(new THREE.Vector3(0, 0, 0));

  // create renderer
  renderer = new THREE.WebGLRenderer({
    antialias: true
  });
  
  cameraControl = new THREE.OrbitControls(camera, renderer.domElement);
  cameraControl.minDistance = 0;
  cameraControl.maxDistance = 100000;

  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0xffffff, 1);
  
  document.body.appendChild(renderer.domElement);

  addSpheres();
  setupLight();
  showAxes(2000);
  // scene.add( new THREE.AxisHelper(2000));

  renderer.render(scene, camera);
  
}


function setButtonActive(button, group) {
  if (group) {
    setButtonGroupInactive(group);
  }

  button.classList.add('active');
}

function setButtonGroupInactive(group) {
  Array.prototype.slice.call(document.querySelectorAll('button'+ group)).forEach((childButton) => {
    setButtonInactive(childButton);
  });
}

function setButtonInactive(button) {
  button.classList.remove('active');
}

function moveCameraOnAxis(axis) {
  var axes = ['x', 'y', 'z'];
  var index = axes.indexOf(axis);

  if (index === -1) {
    throw new Error('Invalid axis!');
  }
  
  axes.forEach((element, index) => {
    let value = axis === element ? (camera.position.getComponent(index) === 0 ? cameraPositionDefault[element] : camera.position.getComponent(index)) : 0;

    camera.position.setComponent(index, value);
  });

  camera.lookAt(new THREE.Vector3(0, 0, 0));
}

function showAxes(length) {
  var axes = new THREE.Object3D()
  , origin = new THREE.Vector3(0, 0, 0)
  ;

  // x
  axes.add(buildAxis(origin, new THREE.Vector3(length, 0, 0), 0xFF0000, false)); // red
  axes.add(buildAxis(origin, new THREE.Vector3(-length, 0, 0), 0xFF0000, true));

  // y
  axes.add(buildAxis(origin, new THREE.Vector3(0, length, 0), 0x00FF00, false)); // green
  axes.add(buildAxis(origin, new THREE.Vector3(0, -length, 0), 0x00FF00, true));

  // z
  axes.add(buildAxis(origin, new THREE.Vector3(0, 0, length), 0x0000FF, false)); // blue
  axes.add(buildAxis(origin, new THREE.Vector3(0, 0, -length), 0x0000FF, true));

  scene.add(axes);

  function buildAxis(source, destination, colorHex, dashed) {
    var geometry = new THREE.Geometry()
    , material
    , lineWidth = 0.1
    ;

    if (dashed) {
      material = new THREE.LineDashedMaterial({linewidth: lineWidth, color: colorHex});
    } else {
      material = new THREE.LineBasicMaterial({linewidth: lineWidth, color: colorHex});
    }

    geometry.vertices.push(source.clone());
    geometry.vertices.push(destination.clone());
    geometry.computeLineDistances();

    return new THREE.Line(geometry, material, THREE.LineSegment);
  }
}


function setupLight() {
  // LIGHTS

  hemiLight = new THREE.HemisphereLight( 0xffffff, 0xffffff, 0.6 ); 
  hemiLight.color.setHSL(0.6, 1, 0.6);
  hemiLight.position.set(0, 500, 0);

  // hemiLight
  dirLight = new THREE.DirectionalLight( 0xffffff, 1);
  dirLight.position.set(400, 600, 100);
  dirLight.lookAt(new THREE.Vector3(0,0,0));

  dirLight.color.setHSL( 0.1, 1, 0.95);
  // dirLight.position.multiplyScalar(50);

  scene.add(hemiLight);
  scene.add(dirLight);
}

// function addMeshes() {
//   addCube(200, 0xd35d6d, new THREE.Vector3(0, 0, 0));
//   addCube(100, 0x33b4ea, new THREE.Vector3(0, 0, 200));
//   addCube(100, 0X7584d8, new THREE.Vector3(200, 0, 0));
// }

function addSpheres() {
  const n = 55;
  const heightFromXInc = 5;
  const sphereSize = 5;
  const rotationSpeedDecrease = 0.13;

  let position = new THREE.Vector3(0, 0, 0);
  let increment = new THREE.Vector3(sphereSize * .9, 0, 0);
  let heightFromX = 0;

  let rotationSpeed = n * 1.1 * rotationSpeedDecrease;

  for (let i = 0; i < n; i++) {
    rotationSpeed -= rotationSpeedDecrease;
    addSphere(sphereSize, 0xd35d6d, position, heightFromX, rotationSpeed);
    heightFromX += heightFromXInc;
    position.add(increment);
  }
}

function addSphere (size, color, position, heightFromX, rotationSpeed) {
  const quality = 20;
  var sphere = {};

  sphere.parent = new THREE.Object3D();
  sphere.pivot = new THREE.Object3D();

  sphere.parent.add(sphere.pivot);

  var geometry = new THREE.SphereGeometry(size, quality, quality);

  var material = new THREE.MeshLambertMaterial({
    color: color,
    wireframe: false
  });

  sphere.heightFromX = heightFromX;
  sphere.rotationSpeed = rotationSpeed;
  sphere.mesh = new THREE.Mesh(geometry, material);

  sphere.mesh.position.setY(heightFromX);
  sphere.pivot.add(sphere.mesh);

  if (position) {
    for(let k in sphere.parent.position) {
      sphere.parent.position[k] = position[k];
    }
  }


  spheres.push(sphere);

  scene.add(sphere.parent);
}

// function addCube (size, color, position) {
//   var geometry = new THREE.BoxGeometry(size, size, size);

//   var material = new THREE.MeshLambertMaterial({
//     color: color,
//     wireframe: false
//   });

//   var mesh = new THREE.Mesh(geometry, material);

//   if (position) {
//     for(var k in mesh.position) {
//       mesh.position[k] = position[k];
//     }
//   }

//   meshes.push(mesh);
//   scene.add(mesh);
// }

// function addGround() {
//   var geometry = new THREE.PlaneGeometry(3000, 3000, 20);

//   var material = new THREE.MeshLambertMaterial({
//     color: 0x343434,
//     side: THREE.DoubleSide,
//     wireframe: true 
//   });

//   ground = new THREE.Mesh(geometry, material);
//   ground.rotateX(Math.radians(90));

//   scene.add(ground);
// }

function animate() {
  requestAnimationFrame(animate);

  // for (let i = meshes.length - 1; i >= 0; i--) {
  //   let mesh = meshes[i]
    
  //   mesh.rotateX(Math.radians(1 * Math.sin(i)));
  //   mesh.rotateY(Math.radians(1));
  //   // mesh.rotateZ(Math.radians(1));
  // };

  for (let i = spheres.length - 1; i >= 0; i--) {
    let sphere = spheres[i];
    
    sphere.parent.rotateX(Math.radians(sphere.rotationSpeed));
  };

  renderer.render(scene, camera);
}

window.onload = function () {
  Math.radians = (degrees) => degrees * Math.PI / 180;
   
  // Converts from radians to degrees.
  Math.degrees = (radians) => radians * 180 / Math.PI;

  init();
  animate();
};