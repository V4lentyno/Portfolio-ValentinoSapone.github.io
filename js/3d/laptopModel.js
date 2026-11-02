import * as THREE from 'three';
import { SVGLoader } from 'three/examples/jsm/loaders/SVGLoader.js';

/**
 * Helper function to create a 2D rounded rectangle shape for Three.js ExtrudeGeometry.
 */
export function createRoundedRectShape(w, h, r) {
    const shape = new THREE.Shape();
    const x = -w / 2;
    const y = -h / 2;
    shape.moveTo(x + r, y);
    shape.lineTo(x + w - r, y);
    shape.quadraticCurveTo(x + w, y, x + w, y + r);
    shape.lineTo(x + w, y + h - r);
    shape.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    shape.lineTo(x + r, y + h);
    shape.quadraticCurveTo(x, y + h, x, y + h - r);
    shape.lineTo(x, y + r);
    shape.quadraticCurveTo(x, y, x + r, y);
    return shape;
}

/**
 * Generates a high-detail procedural 3D Studio Laptop model with PBR materials, LED keyboard glow & vector Apple logo.
 * @param {THREE.CanvasTexture} screenTexture 
 * @returns {{ laptopGroup: THREE.Group, lidGroup: THREE.Group, screenMat: THREE.MeshBasicMaterial, screenMesh: THREE.Mesh, kbGlowMat: THREE.MeshBasicMaterial }}
 */
export function createProceduralLaptop(screenTexture) {
    const laptopGroup = new THREE.Group();

    // 1. MATERIALS SYSTEM (Apple Silver Aluminum PBR & Black Keyboard)
    const aluminumMaterial = new THREE.MeshStandardMaterial({
        color: 0xc8d0dc,
        metalness: 0.94,
        roughness: 0.2,
    });

    const darkPlasticMaterial = new THREE.MeshStandardMaterial({
        color: 0x07080c,
        metalness: 0.3,
        roughness: 0.75
    });

    const keyMaterial = new THREE.MeshStandardMaterial({
        color: 0x0d0f15,
        metalness: 0.35,
        roughness: 0.45
    });

    const rubberFootMaterial = new THREE.MeshStandardMaterial({
        color: 0x1a1c22,
        metalness: 0.1,
        roughness: 0.9
    });

    // 2. MAIN BASE CHASSIS
    const baseShape = createRoundedRectShape(4.7, 3.0, 0.18);
    const baseExtrudeSettings = {
        depth: 0.05,
        bevelEnabled: true,
        bevelSegments: 3,
        bevelSize: 0.015,
        bevelThickness: 0.008,
        curveSegments: 12
    };
    const baseGeo = new THREE.ExtrudeGeometry(baseShape, baseExtrudeSettings);
    const baseMesh = new THREE.Mesh(baseGeo, aluminumMaterial);
    baseMesh.rotation.x = Math.PI / 2;
    baseMesh.position.y = 0.03;
    baseMesh.castShadow = true;
    baseMesh.receiveShadow = true;
    laptopGroup.add(baseMesh);

    // Front Lip Opening Notch
    const frontNotchGeo = new THREE.BoxGeometry(0.5, 0.02, 0.04);
    const frontNotchMesh = new THREE.Mesh(frontNotchGeo, darkPlasticMaterial);
    frontNotchMesh.position.set(0, 0.032, 1.48);
    laptopGroup.add(frontNotchMesh);

    // Bottom Rubber Feet
    const footGeo = new THREE.CylinderGeometry(0.12, 0.12, 0.02, 16);
    const footPositions = [
        [-2.0, -0.02, 1.2],
        [2.0, -0.02, 1.2],
        [-2.0, -0.02, -1.2],
        [2.0, -0.02, -1.2]
    ];
    footPositions.forEach(pos => {
        const foot = new THREE.Mesh(footGeo, rubberFootMaterial);
        foot.position.set(pos[0], pos[1], pos[2]);
        laptopGroup.add(foot);
    });

    // Side Ports (Thunderbolt USB-C Slots)
    const portGeo = new THREE.BoxGeometry(0.04, 0.02, 0.1);
    const portL1 = new THREE.Mesh(portGeo, darkPlasticMaterial);
    portL1.position.set(-2.36, 0.015, 0.4);
    const portL2 = new THREE.Mesh(portGeo, darkPlasticMaterial);
    portL2.position.set(-2.36, 0.015, 0.7);
    const portR1 = new THREE.Mesh(portGeo, darkPlasticMaterial);
    portR1.position.set(2.36, 0.015, 0.4);
    const portR2 = new THREE.Mesh(portGeo, darkPlasticMaterial);
    portR2.position.set(2.36, 0.015, 0.7);
    laptopGroup.add(portL1, portL2, portR1, portR2);

    // 3. MOUSEPAD / TRACKPAD
    const trackpadSilverMat = new THREE.MeshStandardMaterial({
        color: 0xd2d9e4,
        metalness: 0.88,
        roughness: 0.22
    });

    const trackpadOutlineMat = new THREE.MeshStandardMaterial({
        color: 0x12151f,
        metalness: 0.5,
        roughness: 0.8
    });

    // Dark perimeter outline groove
    const trackpadGrooveShape = createRoundedRectShape(1.78, 1.08, 0.09);
    const trackpadGrooveGeo = new THREE.ExtrudeGeometry(trackpadGrooveShape, { depth: 0.008, bevelEnabled: false, curveSegments: 12 });
    trackpadGrooveGeo.rotateX(Math.PI / 2);
    const trackpadGrooveMesh = new THREE.Mesh(trackpadGrooveGeo, trackpadOutlineMat);
    trackpadGrooveMesh.position.set(0, 0.034, 0.82);
    laptopGroup.add(trackpadGrooveMesh);

    // Main Silver Trackpad Body
    const trackpadShape = createRoundedRectShape(1.74, 1.04, 0.08);
    const trackpadExtrudeSettings = {
        depth: 0.01,
        bevelEnabled: true,
        bevelSegments: 2,
        bevelSize: 0.004,
        bevelThickness: 0.003,
        curveSegments: 12
    };
    const trackpadGeo = new THREE.ExtrudeGeometry(trackpadShape, trackpadExtrudeSettings);
    trackpadGeo.rotateX(Math.PI / 2);
    const trackpadMesh = new THREE.Mesh(trackpadGeo, trackpadSilverMat);
    trackpadMesh.position.set(0, 0.040, 0.82);
    laptopGroup.add(trackpadMesh);

    // 4. KEYBOARD WELL & SPEAKER GRILLES
    const kbRecessShape = createRoundedRectShape(4.1, 1.48, 0.08);
    const kbRecessGeo = new THREE.ExtrudeGeometry(kbRecessShape, { depth: 0.005, bevelEnabled: false, curveSegments: 10 });
    kbRecessGeo.rotateX(Math.PI / 2);
    const kbRecessMesh = new THREE.Mesh(kbRecessGeo, darkPlasticMaterial);
    kbRecessMesh.position.set(0, 0.031, -0.42);
    laptopGroup.add(kbRecessMesh);

    // Speaker Grilles
    const speakerGeo = new THREE.BoxGeometry(0.18, 0.005, 1.45);
    const speakerL = new THREE.Mesh(speakerGeo, darkPlasticMaterial);
    speakerL.position.set(-2.2, 0.032, -0.42);
    const speakerR = new THREE.Mesh(speakerGeo, darkPlasticMaterial);
    speakerR.position.set(2.2, 0.032, -0.42);
    laptopGroup.add(speakerL, speakerR);

    // Keyboard Backlight LED Glow
    const kbGlowGeo = new THREE.PlaneGeometry(4.08, 1.45);
    const kbGlowMat = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.65,
        blending: THREE.AdditiveBlending,
        side: THREE.DoubleSide
    });
    const kbGlowMesh = new THREE.Mesh(kbGlowGeo, kbGlowMat);
    kbGlowMesh.rotation.x = -Math.PI / 2;
    kbGlowMesh.position.set(0, 0.033, -0.42);
    laptopGroup.add(kbGlowMesh);

    // Key Legend Texture Helper
    function createKeyLegendTexture(text) {
        const canvas = document.createElement('canvas');
        canvas.width = 64;
        canvas.height = 64;
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, 64, 64);
        ctx.fillStyle = '#ffffff';
        ctx.font = '600 28px "Outfit", system-ui, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(text, 32, 32);
        const texture = new THREE.CanvasTexture(canvas);
        texture.needsUpdate = true;
        return texture;
    }

    const keyLabels = [
        ["esc", "F1", "F2", "F3", "F4", "F5", "F6", "F7", "F8", "F9", "F10", "F11", "F12", "⌫"],
        ["~", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "-", "=", "del"],
        ["tab", "Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P", "[", "]", "\\"],
        ["caps", "A", "S", "D", "F", "G", "H", "J", "K", "L", ";", "'", "enter", ""],
        ["shift", "Z", "X", "C", "V", "B", "N", "M", ",", ".", "/", "▲", "▼", "◄"]
    ];

    // Keyboard Keys Grid
    const keysGroup = new THREE.Group();
    const rows = 5;
    const cols = 14;
    const keyW = 0.25;
    const keyH = 0.23;
    const keyGap = 0.035;

    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            let width = keyW;
            let cornerR = 0.04;
            let labelText = keyLabels[r] && keyLabels[r][c] ? keyLabels[r][c] : "";

            if (r === 4 && c >= 4 && c <= 9) {
                if (c !== 4) continue;
                width = keyW * 6 + keyGap * 5;
                cornerR = 0.05;
                labelText = "";
            }

            const keyShape = createRoundedRectShape(width, keyH, cornerR);
            const keyExtrudeSettings = {
                depth: 0.016,
                bevelEnabled: true,
                bevelSegments: 2,
                bevelSize: 0.004,
                bevelThickness: 0.003,
                curveSegments: 8
            };
            const keyGeo = new THREE.ExtrudeGeometry(keyShape, keyExtrudeSettings);
            keyGeo.rotateX(Math.PI / 2);
            const keyMesh = new THREE.Mesh(keyGeo, keyMaterial);

            let posX = (c - (cols - 1) / 2) * (keyW + keyGap);
            if (r === 4 && c === 4) posX = 0;

            const posZ = (r - (rows - 1) / 2) * (keyH + keyGap) - 0.42;
            keyMesh.position.set(posX, 0.046, posZ);
            keyMesh.castShadow = true;
            keysGroup.add(keyMesh);

            // Print White Key Legend Label on Top Face
            if (labelText) {
                const legendTex = createKeyLegendTexture(labelText);
                const legendMat = new THREE.MeshBasicMaterial({
                    map: legendTex,
                    transparent: true,
                    opacity: 0.92,
                    side: THREE.FrontSide
                });
                const legendGeo = new THREE.PlaneGeometry(width * 0.75, keyH * 0.75);
                const legendMesh = new THREE.Mesh(legendGeo, legendMat);
                legendMesh.rotation.x = -Math.PI / 2;
                legendMesh.position.set(posX, 0.048, posZ);
                keysGroup.add(legendMesh);
            }
        }
    }
    laptopGroup.add(keysGroup);

    // 5. RECESSED HINGE MECHANISM
    const hingeSlotGeo = new THREE.BoxGeometry(3.6, 0.025, 0.08);
    const hingeSlotMesh = new THREE.Mesh(hingeSlotGeo, darkPlasticMaterial);
    hingeSlotMesh.position.set(0, 0.022, -1.44);
    laptopGroup.add(hingeSlotMesh);

    const hingeGeo = new THREE.CylinderGeometry(0.024, 0.024, 3.55, 24);
    const hingeMesh = new THREE.Mesh(hingeGeo, darkPlasticMaterial);
    hingeMesh.rotation.z = Math.PI / 2;
    hingeMesh.position.set(0, 0.020, -1.44);
    laptopGroup.add(hingeMesh);

    // 6. LID & SCREEN ASSEMBLY
    const lidGroup = new THREE.Group();
    lidGroup.position.set(0, 0.035, -1.45);

    const lidShape = createRoundedRectShape(4.7, 2.95, 0.18);
    const lidExtrudeSettings = {
        depth: 0.03,
        bevelEnabled: true,
        bevelSegments: 3,
        bevelSize: 0.012,
        bevelThickness: 0.008,
        curveSegments: 12
    };
    const lidGeo = new THREE.ExtrudeGeometry(lidShape, lidExtrudeSettings);
    lidGeo.translate(0, 0, -0.03);
    const lidMesh = new THREE.Mesh(lidGeo, aluminumMaterial);
    lidMesh.position.set(0, 1.475, 0);
    lidMesh.castShadow = true;
    lidGroup.add(lidMesh);

    // Bezel
    const bezelGeo = new THREE.BoxGeometry(4.62, 2.87, 0.005);
    const bezelMesh = new THREE.Mesh(bezelGeo, darkPlasticMaterial);
    bezelMesh.position.set(0, 1.475, 0.005);
    lidGroup.add(bezelMesh);

    // Display Screen Mesh (Canvas Texture)
    const screenGeo = new THREE.PlaneGeometry(4.45, 2.72);
    const screenMat = new THREE.MeshBasicMaterial({
        map: screenTexture,
        side: THREE.FrontSide
    });
    const screenMesh = new THREE.Mesh(screenGeo, screenMat);
    screenMesh.position.set(0, 1.475, 0.012);
    screenMesh.name = 'screenMesh';
    lidGroup.add(screenMesh);

    // WebCam Notch & Lens
    const notchGeo = new THREE.BoxGeometry(0.3, 0.07, 0.01);
    const notchMesh = new THREE.Mesh(notchGeo, darkPlasticMaterial);
    notchMesh.position.set(0, 2.86, 0.035);
    lidGroup.add(notchMesh);

    const cameraLensGeo = new THREE.CircleGeometry(0.018, 16);
    const cameraLensMat = new THREE.MeshStandardMaterial({
        color: 0x052040,
        metalness: 0.9,
        roughness: 0.1
    });
    const cameraLens = new THREE.Mesh(cameraLensGeo, cameraLensMat);
    cameraLens.position.set(0, 2.86, 0.042);
    lidGroup.add(cameraLens);

    // 7. BACK APPLE LOGO (SVG Extrusion)
    const appleSvgPathBody = "M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83";
    const appleSvgPathLeaf = "M15.97 6.32c.67-.81 1.13-1.94.99-3.07-1 .04-2.18.67-2.87 1.48-.61.71-1.14 1.87-.99 2.98 1.11.09 2.22-.57 2.87-1.39z";

    const svgLoader = new SVGLoader();

    // Apple Body Mesh
    const bodyMarkup = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="${appleSvgPathBody}"/></svg>`;
    const bodySvgData = svgLoader.parse(bodyMarkup);
    const bodyShapes = SVGLoader.createShapes(bodySvgData.paths[0]);
    const bodyGeo = new THREE.ExtrudeGeometry(bodyShapes[0], {
        depth: 0.008,
        bevelEnabled: true,
        bevelSegments: 2,
        bevelSize: 0.002,
        bevelThickness: 0.002,
        curveSegments: 16
    });
    bodyGeo.center();
    const bodyMesh = new THREE.Mesh(bodyGeo, trackpadSilverMat);

    // Apple Leaf Mesh
    const leafMarkup = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="${appleSvgPathLeaf}"/></svg>`;
    const leafSvgData = svgLoader.parse(leafMarkup);
    const leafShapes = SVGLoader.createShapes(leafSvgData.paths[0]);
    const leafGeo = new THREE.ExtrudeGeometry(leafShapes[0], {
        depth: 0.008,
        bevelEnabled: true,
        bevelSegments: 2,
        bevelSize: 0.002,
        bevelThickness: 0.002,
        curveSegments: 16
    });
    leafGeo.center();
    const leafMesh = new THREE.Mesh(leafGeo, trackpadSilverMat);
    leafMesh.position.set(1.8, -9.8, 0);

    const officialAppleGroup = new THREE.Group();
    officialAppleGroup.add(bodyMesh, leafMesh);

    const scaleFactor = 0.038;
    officialAppleGroup.scale.set(scaleFactor, -scaleFactor, scaleFactor);

    const appleLogoGroup = new THREE.Group();
    appleLogoGroup.add(officialAppleGroup);
    appleLogoGroup.position.set(0, 1.48, -0.038);
    appleLogoGroup.rotation.y = Math.PI;
    lidGroup.add(appleLogoGroup);

    // Open Lid Angle (~105 degrees)
    lidGroup.rotation.x = -0.25;

    laptopGroup.add(lidGroup);
    laptopGroup.position.set(0, -0.6, 0);

    return { laptopGroup, lidGroup, screenMat, screenMesh, kbGlowMat };
}
