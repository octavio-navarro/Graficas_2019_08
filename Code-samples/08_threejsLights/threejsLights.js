var renderer = null, 
scene = null, 
camera = null,
root = null,
group = null,
sphere = null,
sphereEnvMapped = null,
orbitControls = null;

var duration = 20000; // ms
var currentTime = Date.now();
function animate() {

    var now = Date.now();
    var deltat = now - currentTime;
    currentTime = now;
    var fract = deltat / duration;
    var angle = Math.PI * 2 * fract;

    // Rotate the sphere group about its Y axis
    group.rotation.y += angle;
}

function run() {
    requestAnimationFrame(function() { run(); });
    
        // Render the scene
        renderer.render( scene, camera );

        // Spin the cube for next frame
        animate();

        // Update the camera controller
        orbitControls.update();
}

function setLightColor(light, r, g, b)
{
    r /= 255;
    g /= 255;
    b /= 255;
    
    light.color.setRGB(r, g, b);
}

var directionalLight = null;
var spotLight = null;
var pointLight = null;
var ambientLight = null;
var mapUrl = "../images/ash_uvgrid01.jpg";

function createScene(canvas) {
    
    // Create the Three.js renderer and attach it to our canvas
    renderer = new THREE.WebGLRenderer( { canvas: canvas, antialias: true } );

    // Set the viewport size
    renderer.setSize(canvas.width, canvas.height);

    // Create a new Three.js scene
    scene = new THREE.Scene();

    // Add  a camera so we can view the scene
    camera = new THREE.PerspectiveCamera( 45, canvas.width / canvas.height, 1, 40000 );
    camera.position.set(-2, 6, 12);
    scene.add(camera);
    
    orbitControls = new THREE.OrbitControls(camera, renderer.domElement);
    // orbitControls.target = new THREE.Vector3(0, 5, 0);    

    // Create a group to hold all the objects
    root = new THREE.Object3D;
    
    // Add a directional light to show off the object
    directionalLight = new THREE.DirectionalLight( 0xffffff, 0.5);
    var directionalHelper = new THREE.DirectionalLightHelper(directionalLight);
    scene.add(directionalHelper);

    // Create and add all the lights
    directionalLight.position.set(.5, 0, 3);
    directionalLight.rotation.x = Math.PI/2;
    root.add(directionalLight);

    pointLight = new THREE.PointLight (0x0000ff, 0.5);
    pointLight.position.set(5, 10, -10);
    root.add(pointLight);
    var pointLightHelper = new THREE.PointLightHelper( pointLight, 1);
    scene.add( pointLightHelper );

    spotLight = new THREE.SpotLight (0xffffff, 0.5);
    spotLight.position.set(2, 2, 5);
    spotLight.target.position.set(2, 0, 4);
    root.add(spotLight);

    var spotlightHelper = new THREE.SpotLightHelper(spotLight);
    scene.add(spotlightHelper);
    
    ambientLight = new THREE.AmbientLight ( 0xffffff, 0.1 );
    root.add(ambientLight);

    // Create a group to hold the spheres
    group = new THREE.Object3D;
    root.add(group);

    // Create a texture map
    
    var map = new THREE.TextureLoader().load(mapUrl);
    map.wrapS = map.wrapT = THREE.RepeatWrapping;
    map.repeat.set(1, 1);

    var color = 0xffffff;
    // Put in a ground plane to show off the lighting
    geometry = new THREE.PlaneGeometry(100, 100, 50, 50);
    var mesh = new THREE.Mesh(geometry, new THREE.MeshPhongMaterial({ color:color, map:map, side:THREE.DoubleSide}));
    mesh.rotation.x = -Math.PI / 2;
    mesh.position.y = -4.02;
    
    // Add the mesh to our group
    group.add( mesh );
    
    // Create the cube geometry
    geometry = new THREE.CubeGeometry(2, 2, 2);
    
    // And put the geometry and material together into a mesh
    mesh = new THREE.Mesh(geometry, new THREE.MeshPhongMaterial({color:color}));
    mesh.position.y = 3;

    // Add the mesh to our group
    group.add( mesh );

    // Create the sphere geometry
    geometry = new THREE.SphereGeometry(Math.sqrt(2), 50, 50);
    
    // And put the geometry and material together into a mesh
    mesh = new THREE.Mesh(geometry, new THREE.MeshPhongMaterial({color:color}));
    mesh.position.y = 0;

    // Add the mesh to our group
    group.add( mesh );

    // Create the cylinder geometry
    geometry = new THREE.CylinderGeometry(1, 2, 2, 50, 10);
    
    // And put the geometry and material together into a mesh
    mesh = new THREE.Mesh(geometry, new THREE.MeshPhongMaterial({color:color}));
    mesh.position.y = -3;

    // Add the  mesh to our group
    group.add( mesh );
    
    // Now add the group to our scene
    scene.add( root );
}
