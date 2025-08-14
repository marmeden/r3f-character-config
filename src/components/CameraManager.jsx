import { CameraControls } from "@react-three/drei"
import { useEffect, useRef } from "react"
import { button, useControls} from 'leva'
import { useConfiguratorStore } from "../store"
import { UI_MODES} from '../store'

export const START_CAMERA_POSITION = [500, 10, 1000]
export const DEFAULT_CAMERA_POSITION = [-1, 1, 5]
export const DEFAULT_CAMERA_TARGET = [0, 0, 0]

export const CameraManager = () => {
    const controls = useRef()
    const currentCategory = useConfiguratorStore((state) => state.currentCategory)
    const initialLoading = useConfiguratorStore((state) => state.loading)
    const mode = useConfiguratorStore((state) => state.mode)
    useControls({
        getCameraPosition: button(() => {
            console.log("Camera Position", [...controls.current.getPosition()])
        }),
        getCameraTarget: button(() => {
            console.log(controls)
            console.log("Camera Target", [...controls.current.getTarget()])
        }),
    })

    useEffect(() => {
        if(initialLoading) {
            controls.current.setLookAt(
                ...START_CAMERA_POSITION,
                ...DEFAULT_CAMERA_TARGET
            )
        } else if(mode === UI_MODES.CUSTOMIZE && currentCategory?.cameraPlacement) {
            controls.current.setLookAt(
                ...currentCategory.cameraPlacement.position,
                ...currentCategory.cameraPlacement.target,
                true
            )
        } else {
            controls.current.setLookAt(
                ...DEFAULT_CAMERA_POSITION,
                ...DEFAULT_CAMERA_TARGET,
                true
            )
        }
    }, [currentCategory, mode, initialLoading])
    return (
        <CameraControls 
            ref={controls}
            minPolarAngle={Math.PI /4}
            maxPolarAngle={Math.PI /2}
            minDistance={2}
            maxDistance={8}
        />
    )
}