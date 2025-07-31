import { create } from 'zustand'

const url = import.meta.env.VITE_API_URL
if(!url) {
    throw new Error("API URL is required")
}

export const useConfiguratorStore = create((set) => ({
    categories: [],
    currentCategory: null,
    assets: [],
    customization: {},
    download: () => {},
    setDownload: (download) => set({download}),
    fetchCategories: async() => {
        const res = await fetch(`${url}/api/customization-groups?populate=startingAsset`);
        const data = await res.json()

        const categories = data.data.map((c) => {
            return {
                name: c.attributes.name,
                position: c.attributes.position,
                id: c.id,
                startingAsset: c.attributes.startingAsset.data?.id
            }
        })

        const res2 = await fetch(`${url}/api/customization-assets?populate=*&pagination[pageSize]=50`)
        const data2 = await res2.json()

        const assets = data2.data.map((a) => {
            return {
                name: a.attributes.name,
                group: a.attributes.customization_group.data.id,
                id: a.id,
                thumbnail: a.attributes.thumbnail.data.attributes.url,
                url: a.attributes.url.data.attributes.url
            }
        })

        const customization = {}
        categories.forEach((category) => {
            category.assets = assets.filter((asset) => asset.group === category.id)
            customization[category.name] = {}

            if(category.startingAsset) {
                customization[category.name].asset = category.assets.find((asset) => asset.id == category.startingAsset)
            }
        })

        set({ categories, currentCategory: categories[0], assets, customization })
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
        }
    )
}))
