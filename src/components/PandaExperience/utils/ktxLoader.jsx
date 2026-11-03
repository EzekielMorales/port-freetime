import { KTX2Loader } from "three/addons/loaders/KTX2Loader.js";
import * as THREE from "three";
import { useLoader, useThree } from "@react-three/fiber";
import { useMemo } from "react";
import { asset } from "../../../utils/assets";

export const useKTX2Texture = (
  textureUrl,
  transparent = true,
  alphaTestValue = 0.6,
  side = "front"
) => {
  const { gl } = useThree();
  const resolvedUrl = asset(textureUrl);
  const transcoderPath = asset("/basis/");

  const texture = useLoader(KTX2Loader, resolvedUrl, (loader) => {
    loader.setTranscoderPath(transcoderPath);
    loader.detectSupport(gl);
  });

  const material = useMemo(() => {
    if (!texture) return null;

    return new THREE.MeshBasicMaterial({
      map: texture,
      transparent,
      alphaTest: alphaTestValue,
      side: side === "front" ? THREE.FrontSide : THREE.DoubleSide,
    });
  }, [texture, transparent, alphaTestValue, side]);

  return material;
};

useKTX2Texture.preload = (url) =>
  useLoader.preload(KTX2Loader, asset(url), (loader) => {
    loader.setTranscoderPath(asset("/basis/"));
  });
