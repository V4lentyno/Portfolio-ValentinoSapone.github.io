import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { coversData } from '../config/coversData.js';

/**
 * Initializes the 3D Interactive Vinyl / Album Covers Showcase engine.
 */
export function initCovers3DShowcase() {
    const container = document.getElementById('covers-3d-canvas');
    if (!container) return;

    const scene = new THREE.Scene();

    const w = container.clientWidth || window.innerWidth;
    const h = container.clientHeight || 520;
    const aspect = w / h;
    const camera = new THREE.PerspectiveCamera(38, aspect, 0.1, 100);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(w, h);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;
    container.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.minDistance = 4.0;
    controls.maxDistance = 14.0;
    controls.maxPolarAngle = Math.PI / 2 + 0.1;
    controls.enablePan = false;
    controls.target.set(0, 0, 0);

    function updateCameraForViewport() {
        if (!container) return;
        const currentW = container.clientWidth || window.innerWidth;
        const currentH = container.clientHeight || 520;
        const currentAspect = currentW / currentH;
        camera.aspect = currentAspect;

        if (currentW <= 768) {
            if (currentAspect < 0.75) {
                camera.position.set(0, 0.3, 10.5);
            } else {
                camera.position.set(0, 0.3, 8.8);
            }
        } else if (currentW <= 1024) {
            camera.position.set(0, 0.3, 7.8);
        } else {
            camera.position.set(0, 0.3, 6.8);
        }

        camera.updateProjectionMatrix();
        renderer.setSize(currentW, currentH);
    }

    updateCameraForViewport();
    controls.update();

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.4);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 2.8);
    keyLight.position.set(5, 8, 6);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    scene.add(keyLight);

    const blueRim = new THREE.PointLight(0x0066ff, 3.5, 12);
    blueRim.position.set(-6, 3, -2);
    scene.add(blueRim);

    const purpleRim = new THREE.PointLight(0x7000ff, 3.5, 12);
    purpleRim.position.set(6, -2, 2);
    scene.add(purpleRim);

    // Shadow Floor
    const floorGeo = new THREE.PlaneGeometry(25, 25);
    const floorMat = new THREE.ShadowMaterial({ opacity: 0.35 });
    const floorMesh = new THREE.Mesh(floorGeo, floorMat);
    floorMesh.rotation.x = -Math.PI / 2;
    floorMesh.position.y = -1.6;
    floorMesh.receiveShadow = true;
    scene.add(floorMesh);

    // Texture Loader
    const textureLoader = new THREE.TextureLoader();

    // Create 3D Vinyl / CD Album Sleeve Group
    const coversGroup = new THREE.Group();
    scene.add(coversGroup);

    const albumMeshes = [];
    const radius = 2.5;
    const count = coversData.length;

    // Dark Metallic sleeve edge material
    const sleeveEdgeMaterial = new THREE.MeshStandardMaterial({
        color: 0x11131a,
        metalness: 0.8,
        roughness: 0.2
    });

    coversData.forEach((cover, i) => {
        const angle = (i / count) * Math.PI * 2;
        const x = Math.sin(angle) * radius;
        const z = Math.cos(angle) * radius;

        const albumGeo = new THREE.BoxGeometry(1.85, 1.85, 0.08);

        textureLoader.load(cover.image, (tex) => {
            tex.colorSpace = THREE.SRGBColorSpace;
            const coverMat = new THREE.MeshStandardMaterial({
                map: tex,
                roughness: 0.3,
                metalness: 0.15
            });

            // Materials for 6 box faces: [Right, Left, Top, Bottom, Front, Back]
            const materials = [
                sleeveEdgeMaterial,
                sleeveEdgeMaterial,
                sleeveEdgeMaterial,
                sleeveEdgeMaterial,
                coverMat,
                coverMat
            ];

            const albumMesh = new THREE.Mesh(albumGeo, materials);
            albumMesh.position.set(x, 0, z);
            albumMesh.rotation.y = angle + Math.PI / 6;
            albumMesh.castShadow = true;
            albumMesh.receiveShadow = true;
            albumMesh.userData = { index: i, coverData: cover };

            coversGroup.add(albumMesh);
            albumMeshes.push(albumMesh);
        });
    });

    // Raycasting for Lightbox interaction
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    let downPos = { x: 0, y: 0 };

    container.addEventListener('mousedown', (e) => {
        downPos = { x: e.clientX, y: e.clientY };
    });

    container.addEventListener('click', (e) => {
        const moved = Math.hypot(e.clientX - downPos.x, e.clientY - downPos.y);
        if (moved > 5) return;

        const rect = container.getBoundingClientRect();
        mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObjects(albumMeshes);

        if (intersects.length > 0) {
            const hit = intersects[0].object;
            const index = hit.userData.index;
            if (window.triggerLightboxAtIndex) {
                window.triggerLightboxAtIndex(index);
            }
        }
    });

    // Animation Loop
    const clock = new THREE.Clock();

    function animate() {
        requestAnimationFrame(animate);

        const elapsedTime = clock.getElapsedTime();
        coversGroup.rotation.y = elapsedTime * 0.15;

        albumMeshes.forEach((mesh, idx) => {
            mesh.position.y = Math.sin(elapsedTime * 1.5 + idx * 1.2) * 0.08;
        });

        controls.update();
        renderer.render(scene, camera);
    }

    animate();

    function onResize() {
        updateCameraForViewport();
    }

    window.addEventListener('resize', onResize);
}
