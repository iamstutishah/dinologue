import { useState, useEffect, useRef, useCallback } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { loadGLTFModel } from "./model";

function easeOutCirc(x) {
  return Math.sqrt(1 - (x - 1) ** 4);
}

const Dino = () => {
  const refContainer = useRef();
  const [loading, setLoading] = useState(true);
  const refRenderer = useRef();
  const urlDinoGLB = "/theo.glb";
  const handleWindowResize = useCallback(() => {
    const { current: renderer } = refRenderer;
    const { current: container } = refContainer;
    if (container && renderer) {
      const scW = container.clientWidth;
      const scH = container.clientHeight;

      renderer.setSize(scW, scH);
    }
  }, []);

  /* eslint-disable react-hooks/exhaustive-deps */
  useEffect(() => {
    const { current: container } = refContainer;
    if (container) {
      const scW = container.clientWidth;
      const scH = container.clientHeight;

      const renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
      });
      renderer.setPixelRatio(window.devicePixelRatio);
      renderer.setSize(scW, scH);
      renderer.outputEncoding = THREE.sRGBEncoding;
      container.appendChild(renderer.domElement);
      refRenderer.current = renderer;
      const scene = new THREE.Scene();

      const target = new THREE.Vector3(0, 0.6, 0);
      const initialCameraPosition = new THREE.Vector3(9, 9, 9);

      // 640 -> 240
      // 8   -> 6
      const scale = scH * 0.000015 + 1.5;
      const camera = new THREE.OrthographicCamera(
        -scale,
        scale,
        scale,
        -scale,
        0.015,
        15
      );
      camera.position.copy(initialCameraPosition);
      camera.lookAt(target);

      const ambientLight = new THREE.AmbientLight(0xcccccc, 3.5);
      scene.add(ambientLight);
      // const directionalLight = new THREE.DirectionalLight(0xffffff, 3);
      // directionalLight.position.set(5, 5, 5);
      // scene.add(directionalLight);
      // const directionalLight2 = new THREE.DirectionalLight(0xffffff, 1);
      // directionalLight.position.set(5, -5, 5);
      // scene.add(directionalLight2);

      const controls = new OrbitControls(camera, renderer.domElement);
      controls.autoRotate = false;
      controls.target = target;

      loadGLTFModel(scene, urlDinoGLB, {
        receiveShadow: false,
        castShadow: false,
      }).then((dino) => {
        dino.scale.set(0.5, 0.5, 0.5);
        scene.add(dino);
        animate();
        setLoading(false);
      });

      let req = null;
      let frame = 0;
      const animate = () => {
        req = requestAnimationFrame(animate);

        frame = frame <= 100 ? frame + 1 : frame;

        if (frame <= 100) {
          const p = initialCameraPosition;
          const rotSpeed = -easeOutCirc(frame / 120) * Math.PI * 20;

          camera.position.y = 6;
          camera.position.x =
            p.x * Math.cos(rotSpeed) + p.z * Math.sin(rotSpeed);
          camera.position.z =
            p.z * Math.cos(rotSpeed) - p.x * Math.sin(rotSpeed);
          camera.lookAt(target);
        } else {
          controls.update();
        }

        renderer.render(scene, camera);
      };

      return () => {
        cancelAnimationFrame(req);
        renderer.domElement.remove();
        renderer.dispose();
      };
    }
  }, []);

  useEffect(() => {
    window.addEventListener("resize", handleWindowResize, false);
    return () => {
      window.removeEventListener("resize", handleWindowResize, false);
    };
  }, [handleWindowResize]);

  return (
    // <DogContainer ref={refContainer}>{loading && <DogSpinner />}</DogContainer>
    <div ref={refContainer} style={{ width: "55%", height: "95vh" }}>
      {loading && <p>Loading...</p>}
    </div>
  );
};

export default Dino;
