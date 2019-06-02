const documentColorChanger = document.createElement('div');
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
scene.background = new THREE.Color(0xffffff); // Sets background color to white
const event = new EventDispatcher();
let mtl;
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
      console.log('material-for-helmet', materials);
      mtl = materials; // remove this piece this is some daring
      // OBJLoader
      const loader = new THREE.OBJLoader();
      loader
        .setMaterials(materials)
        .load(
          'assets/helmet.obj',
          function (obj) {
            // Positioning the object
            obj.position.y = -2.4;
            obj.rotation.y = -15;
            // Object.assign(obj.prototype, EventDispatcher.prototype); - not worked
            // OrbitControls.js looks promising
            // Somehow understood how to get individual object from the whole
            // Changing colors is usually the power of Material
            console.log('helmet-obj', obj);
            obj.children[2].position.x = -2.4;
            scene.add(obj);
          },
          function (xhr) {
            console.log(Math.round(((xhr.loaded / xhr.total * 100)), 2) + '% loaded');
          },
          function (error) {
            console.log('An error happened');
          }
        );
    }
  );

function animate() {
  requestAnimationFrame(animate);

  // cube.rotation.x += 0.01;
  // cube.rotation.y += 0.01;
  // camera.lookAt(scene.position);
  renderer.render(scene, camera);
}

animate();

documentColorChanger.style.width = '300px';
documentColorChanger.style.height = '300px';
documentColorChanger.style.backgroundColor = '#000000';
documentColorChanger.addEventListener('mousemove', (e) => {
  mtl.materials.Helmet.color.g = e.clientY / 300;
  mtl.materials.Helmet.color.r = e.clientX / 300;
  // mtl.materials.Helmet.color.b = e.clientX / 300;
});
document.body.appendChild(documentColorChanger);