import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  currentUser: null,
  loading: false,
  error: false
}

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        loginstart: (state) => {
            state.loading = true
        },
        loginSuccess: (state, action) => {
            state.loading = false
            state.currentUser = action.payload
            state.error = false
        },
        loginFailure: (state) => {
            state.loading = false
            state.error = true
        },
        logout: (state) => {
            state.currentUser = null
            state.loading = false
            state.error = false
        },
        Subscriptions: (state, action) => {
          if(state.currentUser.subscribedUsers.includes(action.payload)) {
            state.currentUser.subscribedUsers.splice(
                state.currentUser.subscribedUsers.findIndex((channelId) => channelId === action.payload,),1)
        }else{
            state.currentUser.subscribedUsers.push(action.payload)
        }
    }
    }
    })
  
  // Action creators are generated for each case reducer function
  export const { loginstart, loginSuccess, loginFailure, logout, Subscriptions } = userSlice.actions
  
  export default userSlice.reducer
  
  