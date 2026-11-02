import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { projectsData } from '../config/projectsData.js';
import { createVirtualOSScreenTexture } from './textureGenerator.js';
import { createProceduralLaptop } from './laptopModel.js';

/**
 * Initializes the Interactive 3D Laptop Showcase for featured projects.
 */
export function initProjects3DShowcase() {
    const container = document.getElementById('projects-3d-canvas');
    if (!container) return;

    let currentIndex = 0;
    const loadedMedia = [];
    let screenMat = null;
    let screenMesh = null;
    let laptopGroup = null;

    function updateScreenTexture(idx) {
        if (!screenMat) return;
        const { texture } = createVirtualOSScreenTexture(idx, loadedMedia);
        if (screenMat.map) {
            screenMat.map.dispose();
        }
        screenMat.map = texture;
        screenMat.map.needsUpdate = true;
        screenMat.needsUpdate = true;
    }

    // Preload project images & video elements
    projectsData.forEach((proj, idx) => {
        if (proj.video) {
            const video = document.createElement('video');
            video.src = proj.video;
            video.muted = true;
            video.loop = true;
            video.playsInline = true;
            video.autoplay = true;
            video.setAttribute('muted', '');
            video.setAttribute('playsinline', '');
            video.onloadeddata = () => {
                if (idx === currentIndex) {
                    updateScreenTexture(currentIndex);
                }
            };
            video.play().catch(() => { });
            loadedMedia[idx] = video;
        } else {
            const img = new Image();
            img.src = proj.image;
            img.onload = () => {
                if (idx === currentIndex) {
                    updateScreenTexture(currentIndex);
                }
            };
            loadedMedia[idx] = img;
        }
    });

    // Scene
    const scene = new THREE.Scene();

    // Camera setup
    const initialWidth = container.clientWidth || window.innerWidth;
    const initialHeight = container.clientHeight || window.innerHeight;
    const aspect = initialWidth / initialHeight;
    const camera = new THREE.PerspectiveCamera(40, aspect, 0.1, 100);

    // Renderer
    const renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance'
    });
    renderer.setSize(initialWidth, initialHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    container.appendChild(renderer.domElement);

    // Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.maxPolarAngle = Math.PI / 2 + 0.05;
    controls.minDistance = 3.2;
    controls.maxDistance = 14.0;
    controls.enablePan = false;
    controls.target.set(0, 0.4, 0);

    // Adjust camera distance according to device screen & aspect ratio
    function updateCameraForViewport() {
        if (!container) return;
        const w = container.clientWidth || window.innerWidth;
        const h = container.clientHeight || window.innerHeight;
        const currentAspect = w / h;
        camera.aspect = currentAspect;

        if (w <= 768) {
            if (currentAspect < 0.75) {
                camera.position.set(0, 0.8, 9.8);
            } else {
                camera.position.set(0, 0.7, 8.2);
            }
        } else if (w <= 1024) {
            camera.position.set(0, 0.6, 7.2);
        } else {
            camera.position.set(0, 0.5, 5.8);
        }

        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
    }

    updateCameraForViewport();
    controls.update();

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.3);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 2.8);
    keyLight.position.set(5, 8, 5);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0xd8e4f8, 2.2);
    rimLight.position.set(-6, 6, -4);
    scene.add(rimLight);

    const fillLight = new THREE.PointLight(0xe2ecfa, 1.2, 12);
    fillLight.position.set(0, -1, 3);
    scene.add(fillLight);

    // Shadow Floor
    const shadowFloorGeo = new THREE.PlaneGeometry(25, 25);
    const shadowFloorMat = new THREE.ShadowMaterial({ opacity: 0.35 });
    const shadowFloor = new THREE.Mesh(shadowFloorGeo, shadowFloorMat);
    shadowFloor.rotation.x = -Math.PI / 2;
    shadowFloor.position.y = -0.75;
    shadowFloor.receiveShadow = true;
    scene.add(shadowFloor);

    // Initial Screen Texture & Procedural Laptop
    const { texture: initialTexture } = createVirtualOSScreenTexture(0, loadedMedia);
    const laptopData = createProceduralLaptop(initialTexture);
    laptopGroup = laptopData.laptopGroup;
    screenMat = laptopData.screenMat;
    screenMesh = laptopData.screenMesh;
    scene.add(laptopGroup);

    // Raycasting for direct screen navigation click
    const raycaster = new THREE.Raycaster();
    const mouseVector = new THREE.Vector2();
    let mouseDownPos = { x: 0, y: 0 };

    container.addEventListener('mousedown', (e) => {
        mouseDownPos = { x: e.clientX, y: e.clientY };
    });

    container.addEventListener('click', (e) => {
        const distMoved = Math.hypot(e.clientX - mouseDownPos.x, e.clientY - mouseDownPos.y);
        if (distMoved > 6) return;

        const rect = container.getBoundingClientRect();
        mouseVector.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        mouseVector.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

        raycaster.setFromCamera(mouseVector, camera);
        const intersects = raycaster.intersectObject(screenMesh);

        if (intersects.length > 0) {
            const activeProj = projectsData[currentIndex];
            if (activeProj && activeProj.link) {
                window.open(activeProj.link, '_blank');
            }
        }
    });

    // Update Project Function
    function goToProject(index) {
        if (index < 0) index = projectsData.length - 1;
        if (index >= projectsData.length) index = 0;
        currentIndex = index;
        updateScreenTexture(currentIndex);
    }

    // Auto-loop slideshow timer for tablet & mobile (3-second interval)
    let autoLoopInterval = null;

    function checkAutoLoop() {
        const isMobileOrTablet = window.innerWidth <= 1024;
        if (isMobileOrTablet) {
            if (!autoLoopInterval) {
                autoLoopInterval = setInterval(() => {
                    goToProject(currentIndex + 1);
                }, 3000);
            }
        } else {
            if (autoLoopInterval) {
                clearInterval(autoLoopInterval);
                autoLoopInterval = null;
            }
        }
    }

    checkAutoLoop();

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        const section = document.getElementById('gallery');
        if (!section) return;
        const rect = section.getBoundingClientRect();
        if (rect.top <= window.innerHeight && rect.bottom >= 0) {
            if (e.key === 'ArrowRight') goToProject(currentIndex + 1);
            if (e.key === 'ArrowLeft') goToProject(currentIndex - 1);
        }
    });

    // Mouse Parallax Interaction
    let targetRotY = 0;
    let targetRotX = 0;

    container.addEventListener('mousemove', (e) => {
        const rect = container.getBoundingClientRect();
        const mouseX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        const mouseY = -((e.clientY - rect.top) / rect.height) * 2 + 1;

        targetRotY = mouseX * 0.35;
        targetRotX = mouseY * 0.15;
    });

    container.addEventListener('mouseleave', () => {
        targetRotY = 0;
        targetRotX = 0;
    });

    // Animation Loop
    const clock = new THREE.Clock();

    function animate() {
        requestAnimationFrame(animate);

        const activeProj = projectsData[currentIndex];
        const activeMedia = loadedMedia[currentIndex];
        if (activeProj && activeProj.video && activeMedia instanceof HTMLVideoElement && screenMat) {
            const { texture } = createVirtualOSScreenTexture(currentIndex, loadedMedia);
            screenMat.map = texture;
            screenMat.map.needsUpdate = true;
        }

        const elapsedTime = clock.getElapsedTime();
        laptopGroup.position.y = -0.6 + Math.sin(elapsedTime * 1.5) * 0.04;

        laptopGroup.rotation.y += (targetRotY - laptopGroup.rotation.y) * 0.05;
        laptopGroup.rotation.x += (targetRotX - laptopGroup.rotation.x) * 0.05;

        controls.update();
        renderer.render(scene, camera);
    }

    animate();

    // Resize Handler
    function onResize() {
        updateCameraForViewport();
        checkAutoLoop();
    }

    window.addEventListener('resize', onResize);
}
