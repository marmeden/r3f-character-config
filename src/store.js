import { create } from 'zustand'

const url = import.meta.env.VITE_API_URL
if(!url) {
    throw new Error("API URL is required")
}

export const useConfiguratorStore = create((set) => ({
    categories: [],
    currentCategory: null,
    assets: [],
    fetchCategories: async() => {
        const res = await fetch(`${url}/api/customization-groups`);
        const data = await res.json()

        const categories = data.data.map((c) => {
            return {
                name: c.attributes.name,
                position: c.attributes.position,
                id: c.id
            }
        })

        const res2 = await fetch(`${url}/api/customization-assets?populate=*`)
        const data2 = await res2.json()
        console.log(data2)

        const assets = data2.data.map((a) => {
            return {
                name: a.attributes.name,
                group: a.attributes.customization_group.data.id,
                id: a.id,
                thumbnail: a.attributes.thumbnail.data.attributes.url
            }
        })

        categories.forEach((category) => {
            category.assets = assets.filter((asset) => asset.group === category.id)
        })

        console.log(categories)
        console.log(assets)

        set({ categories, currentCategory: categories[0], assets })
    },

    setCurrentCategory: (category) => set({ currentCategory: category })
}))
