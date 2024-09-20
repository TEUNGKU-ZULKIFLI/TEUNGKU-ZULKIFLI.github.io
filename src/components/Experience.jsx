import React from "react";
import { Room } from "./Room";
import { Environment } from "@react-three/drei";
import CustomOrbitControls from "./CustomOrbitControls";


export function Experience() {

    return (
        <>
        <ambientLight intensity={0.5} />
        <directionalLight intensity={0.5} />
        <Environment preset="night" />
        <CustomOrbitControls />
        <Room />
        </>
    );
}

export default Experience;
