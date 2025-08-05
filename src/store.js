import { MeshStandardMaterial } from 'three'
import { randInt } from 'three/src/math/MathUtils.js'
import { create } from 'zustand'

const url = import.meta.env.VITE_API_URL
if(!url) {
    throw new Error("API URL is required")
}

export const useConfiguratorStore = create((set, get) => ({
    categories: [],
    currentCategory: null,
    assets: [],
    lockedGroups: {},
    skin: new MeshStandardMaterial({
        color: 0xf5c6a5,
        roughness: 1
    }),
    customization: {},
    download: () => {},
    setDownload: (download) => set({download}),
    updateColor: (color) => {
        set((state) => ({
            customization: {
                ...state.customization,
                [state.currentCategory.name]: {
                    ...state.customization[state.currentCategory.name],
                    color,
                },
            }
        }));

        if(get().currentCategory.name === 'Head') {
            get().updateSkin(color)
        }
    },
    updateSkin: (color) => {
        get().skin.color.set(color)
    },
    fetchCategories: async() => {
        const res = await fetch(`${url}/api/customization-groups?populate=startingAsset, customizationPalette`);
        const data = await res.json()

        console.log(data)

        const categories = data.data.map((c) => {
            return {
                name: c.attributes.name,
                position: c.attributes.position,
                id: c.id,
                startingAsset: c.attributes.startingAsset.data?.id,
                colorPalette: c.attributes.customizationPalette.data?.attributes.colors,
                removable: c.attributes.removable
            }
        })

        const res2 = await fetch(`${url}/api/customization-assets?populate=*&pagination[pageSize]=50`)
        const data2 = await res2.json()
        console.log(data2)

        const assets = data2.data.map((a) => {
            return {
                name: a.attributes.name,
                group: a.attributes.customization_group.data.id,
                id: a.id,
                thumbnail: a.attributes.thumbnail.data.attributes.url,
                url: a.attributes.url.data.attributes.url,
                lockedGroups: a.attributes.lockedGroups.data?.map((d) => d.id)
            }
        })

        const customization = {}
        categories.forEach((category) => {
            category.assets = assets.filter((asset) => asset.group === category.id)
            customization[category.name] = {
                color: category?.colorPalette?.[0] || ""
            }

            if(category.startingAsset) {
                customization[category.name].asset = category.assets.find((asset) => asset.id == category.startingAsset)
            }
        })

        set({ categories, currentCategory: categories[0], assets, customization })
        get().applyLockedAssets()
    },

    setCurrentCategory: (category) => set({ currentCategory: category }),

    changeAsset: ((category, asset) => {
            set((state) => 
                ({
                    customization: {
                        ...state.customization,
                        [category]: {
                            ...state.customization[category],
                            asset
                        }
                    }
                }
            ))
            get().applyLockedAssets()
        }
    ),

    randomize: () => {
        const customization = {}
        get().categories.forEach((category) => {
            let randomAsset = category.assets[randInt(0, category.assets.length - 1)]
            if(category.removable) {
                if(randInt(0, category.assets.length - 1) === 0) {
                    randomAsset = null
                }
            }
            const randomColor = category.colorPalette?.[randInt(0, category.colorPalette.length - 1)]
            customization[category.name] = {
                asset: randomAsset,
                color: randomColor
            }

            if(category.name === 'Head') {
                get().updateSkin(randomColor)
            }
        })

        set({customization})
        get().applyLockedAssets()
    },

    applyLockedAssets: () => {
        const customization = get().customization
        const categories = get().categories
        const lockedGroups = {}

        Object.values(customization).forEach((category) => {
            if(category.asset?.lockedGroups) {
                category.asset.lockedGroups.forEach((group) => {
                    const categoryName = categories.find((category) => category.id === group).name
                    if(!lockedGroups[categoryName]) {
                        lockedGroups[categoryName] = []
                    }

                    const lockingAssetCategoryName = categories.find((cat) => cat.id === category.asset.group)

                    lockedGroups[categoryName].push({
                        name: category.asset.name,
                        categoryName
                    })
                })
            }
        })

        set({lockedGroups})
    }
}))
