// store/wishlistSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { API } from "@/services/api"

// The backend returns { id: <wishlist row id>, product_id, name, price, image }.
// Every existing consumer (ProductCard, Navbar, cart page, product page) checks
// item.id === product.id expecting the PRODUCT's id - so we normalize id to
// product_id here, once, and nothing downstream needs to change.
const normalize = (row) => ({
    id: row.product_id,
    name: row.name,
    price: row.price,
    image: row.image,
})

export const fetchWishlist = createAsyncThunk(
    "wishlist/fetch",
    async (_, { rejectWithValue }) => {
        try {
            const response = await API.getWishlist()
            const rows = Array.isArray(response.data) ? response.data : (response.data?.data || [])
            return rows.map(normalize)
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Failed to load wishlist")
        }
    }
)

export const addToWishlist = createAsyncThunk(
    "wishlist/add",
    async (product, { rejectWithValue }) => {
        try {
            await API.addToWishlist(product.id)
            return product
        } catch (error) {
            // 409 = already in the wishlist server-side (e.g. a stale double
            // click) - treat that as success rather than surfacing an error.
            if (error.response?.status === 409) {
                return product
            }
            return rejectWithValue(error.response?.data?.message || "Failed to add to wishlist")
        }
    }
)

export const removeFromWishlist = createAsyncThunk(
    "wishlist/remove",
    async (productId, { rejectWithValue }) => {
        try {
            await API.removeFromWishlist(productId)
            return productId
        } catch (error) {
            // 404 = already not in the wishlist - treat as success (idempotent).
            if (error.response?.status === 404) {
                return productId
            }
            return rejectWithValue(error.response?.data?.message || "Failed to remove from wishlist")
        }
    }
)

const initialState = {
    items: [],
    loading: false,
    error: null,
}

const wishlistSlice = createSlice({
    name: "wishlist",
    initialState,
    reducers: {
        // Local-only reset on logout - we don't delete the user's
        // server-side wishlist, just clear what's cached in the browser.
        clearWishlist: (state) => {
            state.items = []
            state.error = null
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchWishlist.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(fetchWishlist.fulfilled, (state, action) => {
                state.items = action.payload
                state.loading = false
            })
            .addCase(fetchWishlist.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload
            })

            .addCase(addToWishlist.fulfilled, (state, action) => {
                if (!state.items.some((item) => item.id === action.payload.id)) {
                    state.items.push(action.payload)
                }
            })
            .addCase(addToWishlist.rejected, (state, action) => {
                state.error = action.payload
            })

            .addCase(removeFromWishlist.fulfilled, (state, action) => {
                state.items = state.items.filter((item) => item.id !== action.payload)
            })
            .addCase(removeFromWishlist.rejected, (state, action) => {
                state.error = action.payload
            })
    },
})

export const { clearWishlist } = wishlistSlice.actions
export default wishlistSlice.reducer
