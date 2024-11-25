// Add this to the existing storiesSlice.js file
export const deleteStory = createAsyncThunk(
    'stories/deleteStory',
    async (storyId) => {
    await axios.delete(${API_URL}/${storyId})
    return storyId
    }
    )
    // Add this to the extraReducers
    .addCase(deleteStory.fulfilled, (state, action) => {
    state.items = state.items.filter(story => story.id !== action.payload)
    })