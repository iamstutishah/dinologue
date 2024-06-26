import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { DRACOLoader } from "three/addons/loaders/DRACOLoader.js";

const draco = new DRACOLoader();
draco.setDecoderConfig({ type: "js" });
draco.setDecoderPath("https://www.gstatic.com/draco/v1/decoders/");

export function loadGLTFModel(
  scene,
  glbPath,
  options = { receiveShadow: true, castShadow: true }
) {
  const { receiveShadow, castShadow } = options;
  return new Promise((resolve, reject) => {
    const loader = new GLTFLoader();
    loader.setDRACOLoader(draco);

    loader.load(
      glbPath,
      (gltf) => {
        console.log(gltf);
        const obj = gltf.scene;
        obj.name = "frog";
        obj.position.y = 0;
        obj.position.x = 0;
        obj.receiveShadow = receiveShadow;
        obj.castShadow = castShadow;
        scene.add(obj);

        obj.traverse((child) => {
          if (child.isMesh) {
            // eslint-disable-next-line no-param-reassign
            child.castShadow = castShadow;
            // eslint-disable-next-line no-param-reassign
            child.receiveShadow = receiveShadow;
          }
        });
        resolve(obj);
      },
      undefined,
      (error) => {
        reject(error);
      }
    );
  });
}
