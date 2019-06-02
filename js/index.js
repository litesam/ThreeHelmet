const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

// Initial canvas maker
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// cube maker
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const cube = new THREE.Mesh(geometry, material);
// scene.add(cube);

camera.position.z = 5;

// giving light to the canvas
const ambientLight = new THREE.AmbientLight(0xffffff, 1.0);
scene.add(ambientLight);

const pointLight = new THREE.PointLight(0xffffff, 1);
camera.add(pointLight);
scene.add(camera);

// MTLLoader
// OBJLoader
const mtlLoader = new THREE.MTLLoader();
mtlLoader
  .setPath('assets/')
  .load(
    'helmet.mtl',
    function (materials) {
      materials.preload();
      console.log(materials);
      // OBJLoader
      const loader = new THREE.OBJLoader();
      loader
        .setMaterials(materials)
        .load(
          'assets/helmet.obj',
          function (obj) {
            // Positioning the object
            obj.position.y = -2.4;
            scene.add(obj);
          },
          function (xhr) {
            console.log((xhr.loaded / xhr.total * 100) + '% loaded');
          },
          function (error) {
            console.log('An error happened');
          }
        );
    }
  );

function animate() {
  requestAnimationFrame(animate);
  // camera.lookAt(scene.position);
  renderer.render(scene, camera);
}

animate();