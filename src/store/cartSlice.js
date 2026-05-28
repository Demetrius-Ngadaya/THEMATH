// store/cartSlice.js
import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    items: [],
    total: 0,
    loading: false,
    error: null
}

const cartSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {
        setCart: (state, action) => {
            state.items = action.payload
            state.total = action.payload.reduce((sum, item) => sum + (item.price * item.quantity), 0)
        },
        addToCart: (state, action) => {
            const existing = state.items.find(item => item.id === action.payload.id)
            if (existing) {
                existing.quantity += action.payload.quantity
            } else {
                state.items.push(action.payload)
            }
            state.total = state.items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
        },
        updateQuantity: (state, action) => {
            const item = state.items.find(i => i.id === action.payload.productId)
            if (item) {
                item.quantity = action.payload.quantity
            }
            state.total = state.items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
        },
        removeItem: (state, action) => {
            state.items = state.items.filter(item => item.id !== action.payload)
            state.total = state.items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
        },
        clearCart: (state) => {
            state.items = []
            state.total = 0
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
    setCart,
    addToCart,
    updateQuantity,
    removeItem,
    clearCart,
    setLoading,
    setError
} = cartSlice.actions

export default cartSlice.reducer