const backgroundColor = 0x00000F;
var noise = new SimplexNoise();

/*////////////////////////////////////////*/

var renderCalls = [];
function render () {
  requestAnimationFrame( render );
  renderCalls.forEach((callback)=>{ callback(); });
}
render();

/*////////////////////////////////////////*/

var scene = new THREE.Scene();

var camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 0.1, 1000 );
camera.position.set(30, 80, 70);
camera.lookAt(new THREE.Vector3(0, 0, 0));

var renderer = new THREE.WebGLRenderer( { antialias: true } );
renderer.setPixelRatio( window.devicePixelRatio );
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.setClearColor( backgroundColor );

window.addEventListener( 'resize', function () {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize( window.innerWidth, window.innerHeight );
}, false );

document.body.appendChild( renderer.domElement);

function renderScene(){ renderer.render( scene, camera ); }
renderCalls.push(renderScene);

/* ////////////////////////////////////////////////////////////////////////// */

var controls = new THREE.OrbitControls( camera, renderer.domElement );
controls.enableZoom = false;
//controls.autoRotate = true;

controls.rotateSpeed = 0.01;
controls.zoomSpeed = 0.3;

controls.enablePan = false;

controls.enableDamping = true;
controls.dampingFactor = 0.1;

controls.update();

renderCalls.push(function(){
  controls.update()
});


/* ////////////////////////////////////////////////////////////////////////// */


var spotLight = new THREE.SpotLight( 0xffffff, 1.25 );
spotLight.position.set( -200, 200, 600 );
camera.add( spotLight );
spotLight.position.set(-5, 2, 0);
scene.add(camera);

var pointLight = new THREE.PointLight(0xffffff, 0.25);
scene.add(pointLight);

var stats = initStats();
renderCalls.push(function(){
  stats.update()
});

var datcontrols = {
  Something : 0,
  SomethingElse : 0.01,
}

var gui = new dat.GUI();
gui.add(datcontrols, 'Something', 0, 10);
gui.add(datcontrols, 'SomethingElse', 0.01, 1);

/* ////////////////////////////////////////////////////////////////////////// */

let dummy_array = new Uint8Array(512);
const uniforms = {
  u_time: {
    type: "f",
    value: 1.0,
  },
  u_amplitude: {
    type: "f",
    value: 3.0,
  },
  u_data_arr: {
    type: "float[64]",
    value: dummy_array,
  },
  // u_black: { type: "vec3", value: new THREE.Color(0x000000) },
  // u_white: { type: "vec3", value: new THREE.Color(0xffffff) },
};

const planeGeometry = new THREE.PlaneGeometry(72, 72, 72, 72);
//const planeMaterial = new THREE.MeshNormalMaterial({ wireframe: true });

var vertShader = document.getElementById("vertex_shader").innerHTML;
var fragShader = document.getElementById("fragment_shader").innerHTML;

const planeMaterial = new THREE.ShaderMaterial({
  uniforms: uniforms,
  vertexShader: vertShader,
  fragmentShader: fragShader,
  wireframe:true,
});

var plane = new THREE.Mesh(planeGeometry, planeMaterial);
plane.rotation.x = -0.5 * Math.PI;
plane.position.set(0, 10, 0);
scene.add(plane);

var audioContext;
var audioElement;
var audioSource;
var audioAnalyser;
var FFTBufferLength;
var FFTDataArray;

let audio_initialized = false;

function init_audio() {
  audioContext = new AudioContext();
  audioElement = document.querySelector('audio');
  audioSource = audioContext.createMediaElementSource(audioElement);
  audioAnalyser = audioContext.createAnalyser();
  audioSource.connect(audioAnalyser);
  audioAnalyser.connect(audioContext.destination)
  audioAnalyser.fftSize = 1024;
  FFTBufferLength = audioAnalyser.frequencyBinCount;
  FFTDataArray = new Uint8Array(FFTBufferLength);
  audio_initialized = true;
}

renderCalls.push(function(){
  if (audio_initialized) {
    audioAnalyser.getByteFrequencyData(FFTDataArray);
    uniforms.u_time.value += 0.05;
    uniforms.u_data_arr.value = FFTDataArray;
  }
});

// select our play button
const playButton = document.querySelector('button');

playButton.addEventListener('click', function() {

  if (!audio_initialized) {
    init_audio();
  }
  // check if context is in suspended state (autoplay policy)
  if (audioContext.state === 'suspended') {
    audioContext.resume();
  }

  // play or pause track depending on state
  if (this.dataset.playing === 'false') {
    audioElement.play();
    this.dataset.playing = 'true';
  } else if (this.dataset.playing === 'true') {
    audioElement.pause();
    this.dataset.playing = 'false';
  }
}, false);
