// store/wishlistSlice.js
import { createSlice } from "@reduxjs/toolkit"

// Load wishlist from localStorage on initial load
const loadWishlistFromStorage = () => {
    if (typeof window !== 'undefined') {
        const saved = localStorage.getItem('wishlist')
        if (saved) {
            return JSON.parse(saved)
        }
    }
    return []
}

// Save wishlist to localStorage
const saveWishlistToStorage = (items) => {
    if (typeof window !== 'undefined') {
        localStorage.setItem('wishlist', JSON.stringify(items))
    }
}

const initialState = {
    items: loadWishlistFromStorage(),
    loading: false,
    error: null
}

const wishlistSlice = createSlice({
    name: "wishlist",
    initialState,
    reducers: {
        setWishlist: (state, action) => {
            state.items = action.payload
            saveWishlistToStorage(state.items)
            state.loading = false
        },
        addToWishlist: (state, action) => {
            if (!state.items.some(item => item.id === action.payload.id)) {
                state.items.push(action.payload)
                saveWishlistToStorage(state.items)
            }
        },
        removeFromWishlist: (state, action) => {
            state.items = state.items.filter(item => item.id !== action.payload)
            saveWishlistToStorage(state.items)
        },
        clearWishlist: (state) => {
            state.items = []
            saveWishlistToStorage(state.items)
        },
        setLoading: (state, action) => {
            state.loading = action.payload
        },
        setError: (state, action) => {
            state.error = action.payload
            state.loading = false
        }
    }
})

export const {
    setWishlist,
    addToWishlist,
    removeFromWishlist,
    clearWishlist,
    setLoading,
    setError
} = wishlistSlice.actions

export default wishlistSlice.reducer