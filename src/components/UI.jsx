import { useEffect } from "react";
import { PHOTO_POSES, UI_MODES, useConfiguratorStore } from "../store"
import { grayscale } from "three/tsl";

const PosesBox = () => {
    const curPose = useConfiguratorStore((state) => state.pose)
    const setPose = useConfiguratorStore((state) => state.setPose)

    return(
        <div className="pointer-events-auto rounded-t-lg bg-gradient-to-br from-black/30 to-indigo-900/10 backdrop-blur-sm drop-shadow-md flex p-6 gap-3">
            {Object.keys(PHOTO_POSES).map((pose) => (
                <button
                    className={`transition-colors duration-200 font-medium flex-shrink-0 border-b ${
                        curPose === PHOTO_POSES[pose]
                        ? "text-white shadow-purple-100 border-b-white"
                        : "text-gray-200 hover:text-gray-100 border-b-transparent"
                    }`}
                    onClick={() => setPose(PHOTO_POSES[pose])}
                    >
                    {pose}
                </button>
            ))}
        </div>
    )
}

const AssetsBox = () => {
    const { 
            categories, 
            currentCategory, 
            fetchCategories, 
            setCurrentCategory, 
            changeAsset, 
            customization,
            lockedGroups, 
    } = useConfiguratorStore();

    useEffect(() => {
        fetchCategories()
    }, []);

    return (
        <div className="md:rounded-t-lg bg-gradient-to-br from-black/30 to-indigo-900/20  backdrop-blur-sm drop-shadow-md flex flex-col py-6 gap-3 overflow-hidden">
            <div className="flex items-center gap-8 pointer-events-auto noscrollbar overflow-x-auto px-6 pb-2">
                {categories.map((category) => (
                    <button
                        key={category.id}
                        onClick={() => setCurrentCategory(category)}
                        className={`transition-colors duration-200 font-medium flex-shrink-0 border-b ${
                        currentCategory?.name === category.name
                            ? "text-white shadow-purple-100 border-b-white"
                            : "text-gray-200 hover:text-gray-100 border-b-transparent"
                        }`}>
                            {category.name}
                    </button>
                ))}
            </div>
            {lockedGroups[currentCategory?.name] && (
                <p className="text-red-400 px-6">
                    Asset is hidden by {" "}
                    {lockedGroups[currentCategory.name]
                        .map((asset) => `${asset.name} (${asset.categoryName})`)
                        .join(", ")}
                </p>
            )}
            <div className="flex gap-2 flex-wrap px-6">
                {currentCategory?.removable && (
                    <button
                        onClick={() => changeAsset(currentCategory.name, null)}
                        className={`w-20 h-20 flex-shrink-0 rounded-xl overflow-hidden pointer-events-auto hover:opacity-100 transition-all border-2 duration-300
                        bg-gradient-to-tr
                        ${
                            !customization[currentCategory.name].asset
                                ? "border-white from-white/20 to-white/30"
                                : "from-black/70 to-black/20 border-black"
                        }`}
                    >
                        <div className="w-full h-full flex items-center justify-center bg-black/40 text-white">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="size-8"
                        >
                            <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M6 18 18 6M6 6l12 12"
                            />
                        </svg>
                        </div>
                    </button>
                )}
                {currentCategory?.assets.map((asset, index) => (
                    <button
                        key={index}
                        onClick={() => changeAsset(currentCategory.name, asset)}
                        className={`w-20 h-20 rounded-md overflow-hidden pointer-events-auto  hover:opacity-100 transition-all border-2 duration-300 cursor-pointer bg-gradient-to-tr
                            ${
                                customization[currentCategory.name]?.asset?.id === asset.id
                                ? "border-white from-white/20 to-white/30"
                                : "from-black/70 to-black/20 border-black"
                            }
                        `}>
                        <img 
                        className="object-cover w-full h-full"
                        src={`${import.meta.env.VITE_API_URL}${asset.thumbnail}`} />
                    </button>
                ))}
            </div>
        </div>
    );
}

const RandomizeButton = () => {
    const randomize = useConfiguratorStore((state) => state.randomize)
    return (
        <button
            className="rounded-lg bg-indigo-500 hover:bg-indigo-600 transition-colors duration-300 text-white font-medium px-4 py-3 pointer-events-auto cursor-pointer drop-shadow-md"
            onClick={randomize}>
            <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-6"
            >
                <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19.5 12c0-1.232-.046-2.453-.138-3.662a4.006 4.006 0 0 0-3.7-3.7 48.678 48.678 0 0 0-7.324 0 4.006 4.006 0 0 0-3.7 3.7c-.017.22-.032.441-.046.662M19.5 12l3-3m-3 3-3-3m-12 3c0 1.232.046 2.453.138 3.662a4.006 4.006 0 0 0 3.7 3.7 48.656 48.656 0 0 0 7.324 0 4.006 4.006 0 0 0 3.7-3.7c.017-.22.032-.441.046-.662M4.5 12l3 3m-3-3-3 3"
                />
            </svg>
        </button>
    )
}

const DownloadButton = () => {
    const download = useConfiguratorStore((state) => state.download)
    return (
        <button
            className="rounded-lg bg-indigo-500 hover:bg-indigo-600 transition-colors duration-300 text-white font-medium px-4 py-3 pointer-events-auto cursor-pointer drop-shadow-md"
            onClick={download}>
                Download
        </button>
    )
}

export const UI = () => {
    const currentCategory = useConfiguratorStore((state) => state.currentCategory)
    const customization = useConfiguratorStore((state) => state.customization)
    const mode = useConfiguratorStore((state) => state.mode)
    const setMode = useConfiguratorStore((state) => state.setMode)
    return (
        <main className="pointer-events-none fixed z-10 inset-0 select-none">
            <div className="mx-auto h-full max-w-screen-xl w-full flex flex-col justify-between">
                <div className="flex justify-between items-center p-10">
                    <a 
                        className="pointer-events-auto"
                        href="">
                        <img src="l1.png" width={64} style={{'filter': 'grayscale(1) contrast(0) brightness(2)',}} />
                    </a>
                    <div className="flex items-center gap-2">
                        <RandomizeButton />
                        <DownloadButton />
                    </div>
                </div>
                <div className="px-10 flex flex-col">
                    {mode === UI_MODES.CUSTOMIZE && (
                        <>
                            {currentCategory?.colorPalette && 
                            customization[currentCategory.name] && <ColorPicker />
                            }
                            <AssetsBox />
                        </>
                    )}
                    {mode === UI_MODES.PHOTO && 
                        <PosesBox />
                    }
                    <div className="flex justify-stretch">
                        <button
                            className={`flex-1 pointer-events-auto p-4 text-white transition-colors duration-200 font-medium ${
                                mode === UI_MODES.CUSTOMIZE
                                ? "bg-indigo-500/90"
                                : "bg-indigo-500/30 hover:bg-indigo-500/50"
                            }`}
                            onClick={() => setMode(UI_MODES.CUSTOMIZE)}
                            >
                                Customize Avatar
                        </button>
                        <div className="w-px bg-white/30"></div>
                        <button
                            className={`flex-1 pointer-events-auto p-4 text-white transition-colors duration-200 font-medium ${
                                mode === UI_MODES.PHOTO
                                ? "bg-indigo-500/90"
                                : "bg-indigo-500/30 hover:bg-indigo-500/50"
                            }`}
                            onClick={() => setMode(UI_MODES.PHOTO)}
                            >
                                Photo Booth
                        </button>
                    </div> 
                </div>
            </div>
        </main>
    )
}


const ColorPicker = () => {
    const updateColor = useConfiguratorStore((state) => state.updateColor)
    const currentCategory = useConfiguratorStore((state) => state.currentCategory)

    const handleColorChange = (color) => {
        updateColor(color)
    }

    const customization = useConfiguratorStore((state) => state.customization)

    if(!customization[currentCategory.name]?.asset) {
        return null
    }

    return (
        <div className="pointer-events-auto relative flex gap-2 max-w-full overflow-x-auto backdrop-blur-sm py-2 drop-shadow-md">
            {
                currentCategory.colorPalette?.map((color, index) => (
                    <button
                        key={`${index}-${color}`}
                        className={`w-10 h-10 p-1.5 drop-shadow-md bg-black/20 shrink-0 rounded-lg overflow-hidden transition-all duration-300 border-2 
                        ${customization[currentCategory.name].color === color
                        ? "border-white"
                        : "border-transparent"}`}
                        onClick={() => handleColorChange(color)}>
                            <div className="w-full h-full rounded-md"
                            style={{backgroundColor: color}}>

                            </div>
                    </button>
                ))
            }
        </div>
    )
}