import React from "react";
import { Room } from "/src/components/Room";
import { Environment, OrbitControls } from "@react-three/drei";

export function Experience() {

    return (
        <>
        <ambientLight intensity={0.5} />
        <directionalLight intensity={0.5} />
        <Environment preset='night' />
        <OrbitControls enableRotate={true} enablePan={false} enableZoom={false} />
        <Room />
        </>
    );
}

export default Experience;