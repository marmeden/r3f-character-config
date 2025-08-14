import { roughness } from "three/tsl"
import { Avatar } from "./Avatar"
import { CameraManager } from "./CameraManager"
import { Backdrop, SoftShadows } from "@react-three/drei"
import { Environment } from "@react-three/drei"
import { useConfiguratorStore } from "../store"
import { useThree } from "@react-three/fiber"
import { useEffect } from "react"

export const Experience = () => {

    const setScreenshot = useConfiguratorStore((state) => state.setScreenshot)
    const gl = useThree((state) => state.gl)

    useEffect(() => {
        const screenshot = () => {
            const overlayCanvas = document.createElement('canvas')
            overlayCanvas.width = gl.domElement.width;
            overlayCanvas.height = gl.domElement.height;

            const overlayCtx = overlayCanvas.getContext("2d")
            if(!overlayCtx) {
                return
            }

            overlayCtx.drawImage(gl.domElement, 0, 0)

            const logo = new Image()
            logo.src = "l1.png"
            logo.crossOrigin = "anonymous"
            logo.onload = () => {
                const logoWidth = 765 / 4
                const logoHeight = 370 / 4

                const x = overlayCanvas.width - logoWidth - 42
                const y = overlayCanvas.height - logoHeight - 42

                overlayCtx.drawImage(logo, x, y, logoWidth, logoHeight)

                const link = document.createElement("a")
                const date = new Date()

                link.setAttribute(
                    "download",
                    `Avatar_${
                        date.toISOString().split("T")[0]
                    }_${date.toLocaleTimeString()}.png`
                )
                link.setAttribute(
                    "href",
                    overlayCanvas
                        .toDataURL("image/png")
                        .replace("image/png", "image/octet-stream")
                )
                link.click()
            }
        }
        setScreenshot(screenshot)
    }, [gl])

    return (
        <>
            <CameraManager />
            <Environment preset="sunset" environmentIntensity={0.3} />

            <mesh receiveShadow rotation-x={-Math.PI / 2}>
                <planeGeometry args={[100, 100]}/>
                <meshStandardMaterial color={'#333'} roughness={0.85} />
            </mesh>

            <SoftShadows size={52} samples={16} focus={0.5}/>
            <directionalLight 
                position={[5, 5, 5]}
                intensity={2.2}
                castShadow
                shadow-mapSize-width={2048}
                shadow-mapSize-height={2048}
                shadow-bias={-0.0001}
            />

            <directionalLight position={[-5, 5, 5]} intensity={0.7} />
            <directionalLight position={[3, 3, -5]} intensity={6} color={'#ff3b3b'} />
            <directionalLight position={[3, 3, -5]} intensity={8} color={'#3cb1ff'} />
            <Avatar />
        </>
    )
}