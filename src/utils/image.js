// This file used to have its own hardcoded getImageUrl - now it just
// re-exports the single canonical implementation so anything still
// importing from "utils/image" stays in sync automatically.
export { getImageUrl } from './imageHelper'
