import React from 'react';
import { OrbitControls } from '@react-three/drei';

const CustomOrbitControls = (props) => {
    return (
        <OrbitControls
            {...props}
            enablePan={false}
            enableZoom={false}
            enableDamping={true}
            minPolarAngle={Math.PI / 2}
            maxPolarAngle={Math.PI / 2}
            rotateSpeed={1}
            onChange={(e) => {
            }}
        />
    );
};

export default CustomOrbitControls;
