import axios from 'axios'
export const loginUser =async (email:string, password:string) => {
    const res = await axios.post('/user/login', {email,password}, {
        withCredentials:true
    })
    if(res.status!==201) {
        throw new Error('Unable to login')
    }
    const data = await res.data;
    return data;
}

export const signupUser =async (name:string,email:string, password:string) => {
    const res = await axios.post('/user/signup', {name,email,password},{
        withCredentials:true
    })
    if(res.status!==201) {
        throw new Error('Unable to signup')
    }
    const data = await res.data;
    return data;
}

export const checkAuthStatus =async (token:any) => {
    const res = await axios.post('/user/auth-status',{token})
    if(res.status!==200) {
        throw new Error('Unable to authenticate')
    }
    const data = await res.data;
    return data;
}

export const sendChatRequest =async (message:string,id:string|undefined) => {
    const res = await axios.post('/chat/new',{
        message,id
    })
    if(res.status!==200) {
        throw new Error('Unable to send chat')
    }
    const data = await res.data;
    return data;
}

export const getUserChats =async (id:string) => {
    const res = await axios.get(`/chat/all-chats/${id}`)
    if(res.status!==200) {
        throw new Error('Unable to get chats')
    }
    const data = await res.data;
    return data;
}

export const deleteChats =async (id:string|undefined) => {
    const res = await axios.delete(`/chat/delete/${id}`)
    if(res.status!==200) {
        throw new Error('Unable to delete chats')
    }
    const data = await res.data;
    return data;
}

