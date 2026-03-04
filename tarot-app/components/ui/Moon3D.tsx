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
} from "three";

interface Moon3DProps {
  illumination: number; // 0-1
  size?: number;
  phaseKey?: string;
}

export default function Moon3D({
  illumination,
  size = 150,
  phaseKey,
}: Moon3DProps) {
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
    camera.position.z = 3;

    const geometry = new SphereGeometry(1, 64, 64);
    const material = new MeshPhongMaterial({
      color: 0xe8e0d0,
      emissive: 0x222222,
      specular: 0x333333,
      shininess: 5,
    });
    const moon = new Mesh(geometry, material);
    scene.add(moon);

    // Directional light simulates sun — position based on illumination
    const sunLight = new DirectionalLight(0xffffff, 1.2);
    const angle = (1 - illumination) * Math.PI;
    sunLight.position.set(Math.cos(angle) * 5, 0.5, Math.sin(angle) * 5);
    scene.add(sunLight);

    const ambient = new AmbientLight(0x404040, 0.3);
    scene.add(ambient);

    let frame = 0;
    const animate = () => {
      frame = requestAnimationFrame(animate);
      moon.rotation.y += 0.003;
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
