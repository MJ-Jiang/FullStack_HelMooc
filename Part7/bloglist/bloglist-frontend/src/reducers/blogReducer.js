import { createSlice } from '@reduxjs/toolkit'
import blogService from '../services/blogs'

const blogSlice = createSlice({
    name: 'blogs',
    initialState: [],
    reducers: {
        setBlogs(state, action) {
            return action.payload
        },
        addBlog(state, action) {
            return [...state, action.payload]
        },
        updateBlog(state, action) {
            const updated = action.payload
            return state.map((b) => (b.id === updated.id ? updated : b))
        },
        deleteBlog(state, action) {
            const id = action.payload
            return state.filter((b) => b.id !== id)
        },
    },
})

export const { setBlogs, addBlog, updateBlog, deleteBlog } = blogSlice.actions

export const initializeBlogs = () => {
    return async (dispatch) => {
        const blogs = await blogService.getAll()
        dispatch(setBlogs(blogs))
    }
}

export const createBlog = (blogContent) => {
    return async (dispatch) => {
        const newBlog = await blogService.create(blogContent)
        dispatch(addBlog(newBlog))
    }
}
export const likeBlog = (blog) => async (dispatch) => {
    const updatedBlog = {
        ...blog,
        likes: blog.likes + 1,
        user: blog.user.id || blog.user,
    }
    const returnedBlog = await blogService.update(blog.id, updatedBlog)
    const fixedBlog = {
        ...returnedBlog,
        user: blog.user,
    }
    dispatch(updateBlog(fixedBlog))
}
export const removeBlog = (id) => async (dispatch) => {
    await blogService.remove(id)
    dispatch(deleteBlog(id))
}
export default blogSlice.reducer
