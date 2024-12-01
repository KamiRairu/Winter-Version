import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import * as dat from 'lil-gui';

/**
 * Base
 */
// Debug
const gui = new dat.GUI();

// Canvas
const canvas = document.querySelector('canvas.webgl');

// Scene
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000033); // Dark background for night

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader();

// Load door texture
const doorTexture = textureLoader.load('textures/door/color.jpg'); // Replace with your door texture path

/**
 * House
 */
const house = new THREE.Group();
scene.add(house);

// Graves
const graves = new THREE.Group();
scene.add(graves);

const graveGeometry = new THREE.BoxGeometry(0.6, 0.8, 0.2);
const graveMaterial = new THREE.MeshStandardMaterial({ color: '#b2b6b1' });

for (let i = 0; i < 50; i++) {
    const angle = Math.random() * Math.PI * 2; // Random angle
    const radius = 3 + Math.random() * 6; // Random radius
    const x = Math.cos(angle) * radius; // Get the x position
    const z = Math.sin(angle) * radius; // Get the z position
    
    // Create the mesh
    const grave = new THREE.Mesh(graveGeometry, graveMaterial);
    grave.castShadow = true; // Enable shadow casting for graves
    // Position
    grave.position.set(x, 0.3, z);
    // Rotation
    grave.rotation.z = (Math.random() - 0.5) * 0.4;
    grave.rotation.y = (Math.random() - 0.5) * 0.4;
    // Add to the graves container
    graves.add(grave);
}

// Walls
const bricksColorTexture = textureLoader.load('/textures/bricks/color.jpg');
const bricksAmbientOcclusionTexture = textureLoader.load('/textures/bricks/ambientOcclusion.jpg');
const bricksNormalTexture = textureLoader.load('/textures/bricks/normal.jpg');
const bricksRoughnessTexture = textureLoader.load('/textures/bricks/roughness.jpg');

const walls = new THREE.Mesh(
    new THREE.BoxGeometry(4, 2.5, 4),
    new THREE.MeshStandardMaterial({
        map: bricksColorTexture,
        aoMap: bricksAmbientOcclusionTexture,
        normalMap: bricksNormalTexture,
        roughnessMap: bricksRoughnessTexture
    })
);
walls.geometry.setAttribute('uv2', new THREE.Float32BufferAttribute(walls.geometry.attributes.uv.array, 2));
walls.position.y = 1.25;
walls.castShadow = true; // Enable shadow casting for walls
house.add(walls); // Add walls to the house

// Door
const door = new THREE.Mesh(
    new THREE.PlaneGeometry(1, 1.9),
    new THREE.MeshStandardMaterial({ map: doorTexture })
);
door.position.y = 1;
door.position.z = 2 + 0.01;
door.castShadow = true; // Enable shadow casting for door
house.add(door);

// Door light
const doorLight = new THREE.PointLight('#ff7d46', 1, 7);
doorLight.position.set(0, 2.2, 2.7);
house.add(doorLight);

/**
 * Fog
 */
const fog = new THREE.Fog('#000033', 1, 15); // Dark fog for night
scene.fog = fog;

// Roof
const roof = new THREE.Mesh(
    new THREE.ConeGeometry(3.5, 1, 4),
    new THREE.MeshStandardMaterial({ color: '#b35f45' })
);
roof.rotation.y = Math.PI * 0.25;
roof.position.y = 2.5 + 0.5;
roof.castShadow = true; // Enable shadow casting for roof
house.add(roof);

// Christmas Tree
const createTree = () => {
    const treeGroup = new THREE.Group();

    // Tree trunk
    const trunkGeometry = new THREE.CylinderGeometry(0.2, 0.2, 1, 8);
    const trunkMaterial = new THREE.MeshStandardMaterial({ color: '#8B4513' });
    const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);
    trunk.position.y = 0.5; // Position the trunk above the ground
    trunk.castShadow = true; // Enable shadow casting for trunk
    treeGroup.add(trunk);

    // Foliage (pine tree structure)
    const foliageGeometry = new THREE.ConeGeometry(1, 3, 8); // Base radius, height
    const foliageMaterial = new THREE.MeshStandardMaterial({ color: '#228B22' });
    const foliage = new THREE.Mesh(foliageGeometry, foliageMaterial);
    foliage.position.y = 2; // Position above the trunk
    foliage.castShadow = true; // Enable shadow casting for foliage
    treeGroup.add(foliage);

    // Decorations
    const decorationPositions = [
        { x: -0.5, y: 1.8, z: 0.5 },
        { x: 0.5, y: 1.5, z: -0.5 },
        { x: -0.5, y: 2.1, z: -0.5 },
        { x: 0.5, y: 2.0, z: 0.5 },
        { x: 0, y: 1.2, z: 0 }, // Center bottom
    ];

    // Add decorations
    for (const pos of decorationPositions) {
        const ornamentGeometry = new THREE.SphereGeometry(0.1, 8, 8);
        const ornamentMaterial = new THREE.MeshBasicMaterial({
            color: Math.random() * 0xffffff,
            emissive: 0xffffff, // White glow
            emissiveIntensity: 0.7 // Adjust intensity for the glow effect
        });
        
        const ornament = new THREE.Mesh(ornamentGeometry, ornamentMaterial);
        ornament.position.set(pos.x, pos.y, pos.z);
        treeGroup.add(ornament);
    }

    return treeGroup;
};

// Create and position the tree
const christmasTree = createTree();
christmasTree.position.set(4, 0, 1); // Position the tree in the scene
scene.add(christmasTree);

/**
 * Snow
 */
const snowflakes = [];
const totalSnowflakes = 300; // Increase the number of snowflakes

const createSnowflake = () => {
    const snowflakeGeometry = new THREE.SphereGeometry(0.05, 8, 8);
    const snowflakeMaterial = new THREE.MeshStandardMaterial({ color: '#d0e0f0' }); // Light bluish color for snow
    const snowflake = new THREE.Mesh(snowflakeGeometry, snowflakeMaterial);
    
    // Random position
    snowflake.position.x = (Math.random() - 0.5) * 20;
    snowflake.position.y = Math.random() * 10 + 5; // Start higher above the ground
    snowflake.position.z = (Math.random() - 0.5) * 20;
    
    scene.add(snowflake);
    snowflakes.push(snowflake);
};

// Create more snowflakes
for (let i = 0; i < totalSnowflakes; i++) {
    createSnowflake();
}

/**
 * Snow Particle System
 */
const snowParticleCount = 500; // Number of snow particles
const snowGeometry = new THREE.BufferGeometry();
const snowPositions = new Float32Array(snowParticleCount * 3); // 3 for x, y, z

for (let i = 0; i < snowParticleCount; i++) {
    // Random positions for snow particles
    snowPositions[i * 3] = (Math.random() - 0.5) * 20; // x
    snowPositions[i * 3 + 1] = Math.random() * 5; // y (above the ground)
    snowPositions[i * 3 + 2] = (Math.random() - 0.5) * 20; // z
}

// Set positions attribute
snowGeometry.setAttribute('position', new THREE.BufferAttribute(snowPositions, 3));

// Create snow material
const snowMaterial = new THREE.PointsMaterial({
    color: 0xd0e0f0, // Light bluish color for snow
    size: 0.2,
    transparent: true,
    opacity: 0.8,
});

// Create snow particles
const snowParticles = new THREE.Points(snowGeometry, snowMaterial);
scene.add(snowParticles);

/**
 * Animate Snow Particles
 */
const animateSnowParticles = () => {
    const positions = snowParticles.geometry.attributes.position.array;

    for (let i = 1; i < positions.length; i += 3) {
        positions[i] -= 0.01; // Move particles down

        // Reset particle position if it falls below ground level
        if (positions[i] < 0) {
            positions[i] = Math.random() * 5 + 5; // Start above the ground
            positions[i - 1] = (Math.random() - 0.5) * 20; // Random x position
            positions[i + 1] = (Math.random() - 0.5) * 20; // Random z position
        }
    }

    // Notify Three.js that the position attribute has changed
    snowParticles.geometry.attributes.position.needsUpdate = true;
};

/**
 * Animate Snow
 */
const animateSnow = () => {
    for (const snowflake of snowflakes) {
        snowflake.position.y -= 0.03; // Increased fall speed for a more dynamic effect
        
        // Reset snowflake position if it falls below ground
        if (snowflake.position.y < -1) { // Slightly below ground to avoid flickering
            snowflake.position.y = Math.random() * 10 + 5; // Start high above
            snowflake.position.x = (Math.random() - 0.5) * 20;
            snowflake.position.z = (Math.random() - 0.5) * 20;
        }
    }
};

/**
 * Floor
 */
// Load textures
const grassColorTexture = textureLoader.load('/textures/grass/snow.jpeg');
const grassAmbientOcclusionTexture = textureLoader.load('/textures/grass/white.jpeg');
const grassNormalTexture = textureLoader.load('/textures/grass/dark.jpeg');
const grassRoughnessTexture = textureLoader.load('/textures/grass/hard.jpeg');

// Create the floor mesh
const floorGeometry = new THREE.PlaneGeometry(20, 20);
const floorMaterial = new THREE.MeshStandardMaterial({
    map: grassColorTexture,
    aoMap: grassAmbientOcclusionTexture,
    normalMap: grassNormalTexture,
    roughnessMap: grassRoughnessTexture,
});

// Create the floor mesh
const floor = new THREE.Mesh(floorGeometry, floorMaterial);
floor.geometry.setAttribute('uv2', new THREE.Float32BufferAttribute(floor.geometry.attributes.uv.array, 2));
floor.rotation.x = -Math.PI * 0.5;
floor.position.y = 0;
floor.receiveShadow = true; // Enable shadow receiving for the floor
scene.add(floor);

/**
 * Lights
 */
// Ambient light
const ambientLight = new THREE.AmbientLight('#a0a0ff', 0.5); // Cool blue ambient light
gui.add(ambientLight, 'intensity', 0, 1, 0.001).name('Ambient Light Intensity');
scene.add(ambientLight);

// Directional light (moonlight)
const moonLight = new THREE.DirectionalLight('#ffffff', 0.5);
moonLight.position.set(4, 5, -2);
moonLight.castShadow = true; // Enable shadow casting for the directional light
gui.add(moonLight, 'intensity', 0, 1, 0.001).name('Moonlight Intensity');
gui.add(moonLight.position, 'x', -5, 5, 0.001).name('Moonlight X Position');
gui.add(moonLight.position, 'y', -5, 5, 0.001).name('Moonlight Y Position');
gui.add(moonLight.position, 'z', -5, 5, 0.001).name('Moonlight Z Position');
scene.add(moonLight);

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight,
};

window.addEventListener('resize', () => {
    // Update sizes
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;

    // Update camera
    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();

    // Update renderer
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100);

// Position the camera in front of the door
camera.position.set(0, 1.5, 8); // Adjusted position: x=0, y=1.5 (above ground), z=8 (in front of the door)

// Point the camera towards the door
camera.lookAt(0, 1, 2); // Looking at the door position
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true, // Enable transparency if needed
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.enabled = true; // Enable shadow maps

/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
    const elapsedTime = clock.getElapsedTime();

    // Update snow animation
    animateSnow();
    animateSnowParticles(); // Update particle animation

    // Update controls
    controls.update();

    // Render
    renderer.render(scene, camera);

    // Call tick again on the next frame
    window.requestAnimationFrame(tick);
};

tick();