import axios from 'axios';
import Cookies from 'js-cookie';

let apiUrl = import.meta.env.VITE_URL;

export const loginApi = async (data) => {
  try {
    const response = await axios.post(`${apiUrl}/account/login`, data, { withCredentials: true });
    console.log(response.data);
    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.message || 'Login failed');
    } else {
      throw new Error('Network or server error');
    }
  }
}
export const signupApi = async (formData) => {
  try {
    const response = await axios.post(`${apiUrl}/account/signup`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    if (error.response) {
      // Return detailed error message from server response
      throw new Error(error.response.data.message || 'Signup failed');
    } else {
      // Handle other types of errors
      throw new Error('Network or server error');
    }
  }
};


// To fetch user details
export const getuserApi = async () => {
  try {
    const response = await axios.get(`${apiUrl}/account/user`, { withCredentials: true });
    return response.data;
  } catch (error) {
    console.error('Error fetching user:', error);
    throw error;
  }
}

// To update user details
export const updateUserApi = async (formData) => {
  try {
    const response = await axios.put(`${apiUrl}/account/edit`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      withCredentials: true,
    });
    return response.data.user;
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
}


// Function to add a post
export const addPostApi = async (formData) => {
  try {
    const response = await axios.post(`${apiUrl}/post/create`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    if (error.response) {
      // Return detailed error message from server response
      throw new Error(error.response.data.message || 'Failed to add post');
    } else {
      // Handle other types of errors
      throw new Error('Network or server error');
    }
  }
};

// to get all post
export const getPosts = async () => {
  try {
    const response = await axios.get(`${apiUrl}/post`, { withCredentials: true });
    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.message || 'Failed to fetch posts');
    } else {
      throw new Error('Network or server error');
    }
  }
}

// to get user posts 
export const getUserPosts = async () => {
  try {
    const response = await axios.get(`${apiUrl}/account/posts`, { withCredentials: true });
    return response.data; // Assuming response.data is { posts: [] }
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.message || 'Failed to fetch posts');
    } else {
      throw new Error('Network or server error');
    }
  }
};

// To delete a post
export const deletePostApi = async (postId) => {
  try {
    const response = await axios.delete(`${apiUrl}/post/${postId}`, { withCredentials: true });
    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.message || 'Failed to delete post');
    } else {
      throw new Error('Network or server error');
    }
  }
};

// To update a post
export const updatePostApi = async (postId, formData) => {
  try {
    const response = await axios.put(`${apiUrl}/post/${postId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      withCredentials: true,
    });
    return response.data.post;
  } catch (error) {
    console.error('Error updating post:', error);
    throw error;
  }
};

// To fetch a single post by ID
export const getPostByIdApi = async (postId) => {
  try {
    if (!postId) {
      throw new Error('Post ID is required');
    }
    console.log('Making API call to fetch post by ID:', postId); // Log the API call
    const response = await axios.get(`${apiUrl}/post/${postId}`, { withCredentials: true });
    return response.data;
  } catch (error) {
    console.error('Error in getPostByIdApi:', error); // Log the error
    if (error.response) {
      throw new Error(error.response.data.message || 'Failed to fetch post');
    } else {
      throw new Error('Network or server error');
    }
  }
};

// to fetch all users 
export const getUsersApi = async () => {
  try {
    const users = await axios.get(`${apiUrl}/account/users`, { withCredentials: true })
    return users.data
  } catch (error) {
    console.error('Error in getting all users:', error); 
    if (error.response) {
      throw new Error(error.response.data.message || 'Failed to fetch all users');
    } else {
      throw new Error('Network or server error');
    }
  }
}

// to fetch user profile detail
export const getUserDetailApi = async (id) => {
  try {
    const user = await axios.get(`${apiUrl}/account/${id}`, { withCredentials: true})
    return user.data
  } catch (error) {
    console.error('Error in getting user detail:', error); 
    if (error.response) {
      throw new Error(error.response.data.message || 'Failed to fetch user detail');
    } else {
      throw new Error('Network or server error');
    }
  }
}

// to get old chats
export const getChatHistoryApi = async ( userId2) => {
  try {
    const response = await axios.get(`${apiUrl}/chat/${userId2}`, { withCredentials: true });
    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.message || 'Failed to fetch chat history');
    } else {
      throw new Error('Network or server error');
    }
  }
};

// to post message
export const postMessageApi = async (data) => {
  try {
    const response = await axios.post(`${apiUrl}/chat`, data, { withCredentials: true });
    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.message || 'Failed to send message');
    } else {
      throw new Error('Network or server error');
    }
  }
};

// to get chatted users
export const getChattedUsersApi = async (userId) => {
  try {
    const response = await axios.get(`${apiUrl}/chat/chattedUsers/${userId}`, { withCredentials: true });
    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.message || 'Failed to fetch chatted users');
    } else {
      throw new Error('Network or server error');
    }
  }
};


export const getUserIdFromToken = async () => {
  const token = Cookies.get('token');

  console.log('Token:', token); // Log the token

  if (!token) return null;

  try {
    const { default: jwtDecode } = await import('jwt-decode');
    const decodedToken = jwtDecode(token);
    console.log('Decoded Token:', decodedToken); // Log the decoded token to inspect its structure
    return decodedToken.id; // Ensure the token contains the user ID as 'id'
  } catch (error) {
    console.error('Failed to decode token:', error);
    return null;
  }
};

export const likePost = async (postId) => {
  const response = await axios.post(`${apiUrl}/post/${postId}/like`, {}, { withCredentials: true });
  return response.data;
};

export const unlikePost = async (postId) => {
  const response = await axios.post(`${apiUrl}/post/${postId}/unlike`, {}, { withCredentials: true });
  return response.data;
};

export const fetchChatHistory = async (userId1, userId2) => {
  try {
    const response = await fetch(`${API_BASE_URL}/chat/${userId2}`, {
      credentials: 'include',
    });
    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }
    const chatHistory = await response.json();
    return chatHistory;
  } catch (error) {
    console.error('Error fetching chat history:', error);
    throw error;
  }
};

export const fetchUserDetail = async (userId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/user/${userId}`, {
      credentials: 'include',
    });
    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }
    const userDetail = await response.json();
    return userDetail;
  } catch (error) {
    console.error('Error fetching user detail:', error);
    throw error;
  }
};