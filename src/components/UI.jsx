import { useEffect } from "react";
import { useConfiguratorStore } from "../store"

const AssetsBox = () => {
    const { 
            categories, 
            currentCategory, 
            fetchCategories, 
            setCurrentCategory, 
            changeAsset, 
            customization 
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
            <div className="flex gap-2 flex-wrap px-6">
                {currentCategory?.assets.map((asset, index) => (
                    <button
                        key={index}
                        onClick={() => changeAsset(currentCategory.name, asset)}
                        className={`w-20 h-20 rounded-md overflow-hidden pointer-events-auto  hover:opacity-100 transition-all border-2 duration-300 cursor-pointer
                            ${
                                customization[currentCategory.name]?.asset?.id === asset.id
                                ? "border-white opacity-100"
                                : "border-transparent opacity-80"
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

const DownloadButton = () => {
    const download = useConfiguratorStore((state) => state.download)
    return (
        <button
            className="rounded-lg bg-indigo-500 hover:bg-indigo-600 transition-colors duration-300 text-white font-medium px-4 py-3 pointer-events-auto"
            onClick={download}>
                Download
        </button>
    )
}

export const UI = () => {
    const currentCategory = useConfiguratorStore((state) => state.currentCategory)
    const customization = useConfiguratorStore((state) => state.customization)
    return (
        <main className="pointer-events-none fixed z-10 inset-0 select-none">
            <div className="mx-auto h-full max-w-screen-xl w-full flex flex-col justify-between">
                <div className="flex justify-between items-center p-10">
                    <a 
                        className="pointer-events-auto"
                        href="">
                        Hey
                    </a>
                    <DownloadButton />
                </div>
                <div className="px-10 flex flex-col">
                    {currentCategory?.colorPalette && 
                    customization[currentCategory.name] && <ColorPicker />
                    }
                    <AssetsBox />
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