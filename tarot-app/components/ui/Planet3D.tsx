import React, { useRef, useEffect } from "react";
import { View, StyleSheet } from "react-native";
import { GLView } from "expo-gl";
import { Renderer } from "expo-three";
import {
  Scene,
  PerspectiveCamera,
  SphereGeometry,
  MeshPhongMaterial,
  Mesh,
  DirectionalLight,
  AmbientLight,
  RingGeometry,
  MeshBasicMaterial,
  DoubleSide,
} from "three";

const PLANET_COLORS: Record<string, { color: number; emissive: number }> = {
  sun: { color: 0xffd700, emissive: 0xdd8800 },
  moon: { color: 0xe8e0d0, emissive: 0x222222 },
  mars: { color: 0xcc4422, emissive: 0x441100 },
  mercury: { color: 0xaaaacc, emissive: 0x333344 },
  jupiter: { color: 0xddaa66, emissive: 0x553311 },
  venus: { color: 0xeedd88, emissive: 0x554422 },
  saturn: { color: 0xccbb88, emissive: 0x443322 },
};

interface Planet3DProps {
  planetKey: string;
  size?: number;
}

export default function Planet3D({ planetKey, size = 120 }: Planet3DProps) {
  const glRef = useRef<any>(null);

  const onContextCreate = (gl: any) => {
    const renderer = new Renderer({ gl });
    renderer.setSize(gl.drawingBufferWidth, gl.drawingBufferHeight);
    renderer.setClearColor(0x000000, 0);

    const scene = new Scene();
    const camera = new PerspectiveCamera(
      45,
      gl.drawingBufferWidth / gl.drawingBufferHeight,
      0.1,
      100
    );
    camera.position.z = 3.5;

    const colors = PLANET_COLORS[planetKey] || PLANET_COLORS.moon;
    const geometry = new SphereGeometry(1, 48, 48);
    const material = new MeshPhongMaterial({
      color: colors.color,
      emissive: colors.emissive,
      specular: 0x333333,
      shininess: planetKey === "sun" ? 30 : 10,
    });
    const planet = new Mesh(geometry, material);
    scene.add(planet);

    // Saturn gets rings
    if (planetKey === "saturn") {
      const ringGeo = new RingGeometry(1.3, 1.8, 64);
      const ringMat = new MeshBasicMaterial({
        color: 0xccbb88,
        side: DoubleSide,
        transparent: true,
        opacity: 0.6,
      });
      const ring = new Mesh(ringGeo, ringMat);
      ring.rotation.x = Math.PI / 3;
      scene.add(ring);
    }

    const sunLight = new DirectionalLight(0xffffff, 1.0);
    sunLight.position.set(3, 2, 5);
    scene.add(sunLight);

    const ambient = new AmbientLight(0x404040, 0.4);
    scene.add(ambient);

    let frame = 0;
    const animate = () => {
      frame = requestAnimationFrame(animate);
      planet.rotation.y += 0.005;
      renderer.render(scene, camera);
      gl.endFrameEXP();
    };
    animate();

    glRef.current = { frame };
  };

  useEffect(() => {
    return () => {
      if (glRef.current?.frame) {
        cancelAnimationFrame(glRef.current.frame);
      }
    };
  }, []);

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <GLView
        style={{ width: size, height: size }}
        onContextCreate={onContextCreate}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 999,
    overflow: "hidden",
  },
});
