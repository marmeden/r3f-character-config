import { act, Suspense, useEffect, useRef } from "react"
import { useAnimations, useFBX, useGLTF } from "@react-three/drei"
import { useConfiguratorStore } from "../store"
import { Asset } from "./Asset"
import { GLTFExporter } from "three-stdlib";
import { NodeIO } from "@gltf-transform/core";
import { dedup, draco, quantize } from "@gltf-transform/functions";

export const Avatar = ({...props}) => {
    const group = useRef()
    const { nodes } = useGLTF('models/Armature.glb')
    const { animations } = useGLTF('models/Poses.glb') 
    const customization = useConfiguratorStore((state) => state.customization)
    const { actions } = useAnimations(animations, group)

    const setDownload = useConfiguratorStore((state) => state.setDownload)

    const pose = useConfiguratorStore((state) => state.pose)

    useEffect(() => {
        function download() {
            const exporter = new GLTFExporter()
            exporter.parse(
                group.current,
                async function (result) {
                    const io = new NodeIO()
                    const document = await io.readBinary(new Uint8Array(result))
                    await document.transform(
                        dedup(),
                        draco(),
                        quantize()
                    )
                    const glb = await io.writeBinary(document)

                    save(
                        new Blob([glb], {type: "application/octet-stream"}),
                        `avatar_${+new Date()}.glb`
                    )
                },
                function (error) {
                    console.error(error)
                },
                { binary: true }
            )
        }

        const link = document.createElement("a")
        link.style.display = "none"
        document.body.appendChild(link)

        function save(blob, filename) {
            link.href = URL.createObjectURL(blob)
            link.download = filename 
            link.click()
        }

        setDownload(download)
    }, [])

    useEffect(() => {
        actions[pose]?.fadeIn(0.2).play()
        return () => actions[pose]?.fadeOut(0.2).stop()
    }, [actions, pose])
    return (
        <group ref={group} {...props} dispose={null}>
        <group name="Scene">
            <group name="Armature" rotation={[Math.PI / 2, 0, 0]} scale={0.01}>
                <primitive object={nodes.mixamorigHips} />
                {
                    Object.keys(customization).map((key) => customization[key]?.asset?.url && (
                        <Suspense
                            key={customization[key].asset.id}>
                            <Asset
                                categoryName={key}
                                url={`${import.meta.env.VITE_API_URL}${customization[key].asset.url}`}
                                skeleton={nodes.Plane.skeleton}
                            />
                        </Suspense>
                    ))
                }
            </group>
        </group>
        </group>
    )
}