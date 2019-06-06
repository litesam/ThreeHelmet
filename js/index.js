const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
scene.background = new THREE.Color(0xffffff); // Sets background color to white
let mtl;

// Initial canvas maker
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Camera controls
const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.autoRotate = true;
controls.update();

// cube maker
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const cube = new THREE.Mesh(geometry, material);
// scene.add(cube);

camera.position.z = 7;

// giving light to the canvas
const ambientLight = new THREE.AmbientLight(0xffffff, 1.0);
scene.add(ambientLight);

const hemisphereLight = new THREE.HemisphereLight(0xdddddd, 0xffffff, 1);
const hemisphereLight1 = new THREE.HemisphereLight(0xdddddd, 0xcccccc, 0.9);
const hemisphereLight2 = new THREE.HemisphereLight(0xdddddd, 0xcccccc, 0.9);
const hemisphereLight3 = new THREE.HemisphereLight(0xdddddd, 0xcccccc, 0.9);
hemisphereLight3.position = new THREE.Vector3(0, 0, -1);
hemisphereLight2.position = new THREE.Vector3(0, 0, 1);
hemisphereLight1.position = new THREE.Vector3(0, 1, 0);
scene.add(hemisphereLight3);
scene.add(hemisphereLight2);
scene.add(hemisphereLight1);
scene.add(hemisphereLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.7);
scene.add(directionalLight);

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
      mtl = materials; // remove this piece this is some daring shit
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
            // obj.children[2].position.x = -0.39;
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
  controls.update();
  // cube.rotation.x += 0.01;
  // cube.rotation.y += 0.01;
  // camera.lookAt(scene.position);
  renderer.render(scene, camera);
}

animate();

// Color picker
const slider = document.getElementById('slider');
const picker = document.getElementById('picker');

picker.addEventListener('mousedown', e => {
  picker.style.position = 'relative';
  slider.appendChild(picker);

  moveAt(e.pageX);

  function moveAt(x) {
    picker.style.left = (x - picker.offsetWidth / 2) % 360 + 'px';
    slider.style.background = `hsl(${parseInt(picker.style.left)}, 100%, 50%)`;
    const colorHelmet = new THREE.Color(slider.style.background);
    mtl.materials.Helmet.color = colorHelmet;
  }

  slider.addEventListener('mousemove', e => moveAt(e.clientX));

  picker.addEventListener('mouseup', e => {
    picker.onmouseup = null;
    slider.removeEventListener('mousemove', (e) => moveAt(e.clientX));
  });
});

picker.addEventListener('dragstart', false);
