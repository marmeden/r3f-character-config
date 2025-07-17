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
        const res = await fetch(`${url}/customization-groups`);
        const data = await res.json()

        const categories = data.data.map((c) => {
            return {
                name: c.attributes.name,
                position: c.attributes.position
            }
        })

        const res2 = await fetch(`${url}/customization-assets`)
        const data2 = await res2.json()

        const assets = data2.data.map((a) => {
            return {
                name: a.attributes.name
            }
        })

        console.log(categories)
        console.log(assets)

        set({ categories, currentCategory: categories[0], assets })
    },

    setCurrentCategory: (category) => set({ currentCategory: category })
}))
