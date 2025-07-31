import { Avatar } from "./Avatar"
import { Backdrop, OrbitControls, SoftShadows } from "@react-three/drei"
import { Environment } from "@react-three/drei"

export const Experience = () => {
    return (
        <>
            <OrbitControls 
                minPolarAngle={Math.PI /4}
                maxPolarAngle={Math.PI /2}
                minAzimuthAngle={-Math.PI /4}
                maxAzimuthAngle={Math.PI /4}
            />
            <Environment preset="sunset" environmentIntensity={0.3} />

            <Backdrop scale={[50, 10, 5]} floor={1.5} receiveShadow position-z={-4}>
                <meshStandardMaterial color='#555' />
            </Backdrop>

            <SoftShadows size={52} samples={16}/>
            <directionalLight 
                position={[5, 5, 5]}
                intensity={2.2}
                castShadow
                shadow-mapSize-width={2048}
                shadow-mapSize-height={2048}
                shadow-bias={-0.0001}
            />

            <directionalLight position={[-5, 5, 5]} intensity={0.7} />
            <directionalLight position={[1, 0.1, -5]} intensity={3} color={'red'} />
            <directionalLight position={[-1, 0.1, -5]} intensity={8} color={'blue'} />
            <Avatar />
        </>
    )
}