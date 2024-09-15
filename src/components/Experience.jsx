import React from "react";
import { Room } from "/src/components/Room";
import { OrbitControls } from "@react-three/drei";

export function Experience() {
    
    return (
        <>
        <OrbitControls />
        <Room scale={0.3} />
        </>
    );
}

export default Experience;