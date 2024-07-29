import axios from 'axios';

const apiUrl = import.meta.env.VITE_URL;

// Set up an axios instance
const apiClient = axios.create({
  baseURL: apiUrl,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Add a request interceptor to include the token in the headers
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Utility function for handling API errors
const handleApiError = (error) => {
  if (error.response) {
    throw new Error(error.response.data.message || 'API request failed');
  } else {
    throw new Error('Network or server error');
  }
};

// Login function
export const loginApi = async (data) => {
  try {
    const response = await apiClient.post('/account/login', data);
    const { token, user } = response.data;
    localStorage.setItem('token', token);
    return { token, user };
  } catch (error) {
    handleApiError(error);
  }
};

// Signup function
export const signupApi = async (formData) => {
  try {
    const response = await apiClient.post('/account/signup', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    const { token, user } = response.data;
    localStorage.setItem('token', token);
    return user;
  } catch (error) {
    handleApiError(error);
  }
};

// Fetch user details
export const getuserApi = async () => {
  try {
    const response = await apiClient.get('/account/user');
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

// Update user details
export const updateUserApi = async (formData) => {
  try {
    const response = await apiClient.put('/account/edit', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data.user;
  } catch (error) {
    handleApiError(error);
  }
};

// Add a post
export const addPostApi = async (formData) => {
  try {
    const response = await apiClient.post('/post/create', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

// Fetch all posts
export const getPosts = async () => {
  try {
    const response = await apiClient.get('/post');
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

// Fetch user posts
export const getUserPosts = async () => {
  try {
    const response = await apiClient.get('/account/posts');
    return response.data; // Assuming response.data is { posts: [] }
  } catch (error) {
    handleApiError(error);
  }
};

// Delete a post
export const deletePostApi = async (postId) => {
  try {
    const response = await apiClient.delete(`/post/${postId}`);
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

// Update a post
export const updatePostApi = async (postId, formData) => {
  try {
    const response = await apiClient.put(`/post/${postId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data.post;
  } catch (error) {
    handleApiError(error);
  }
};

// Fetch a single post by ID
export const getPostByIdApi = async (postId) => {
  try {
    if (!postId) throw new Error('Post ID is required');
    console.log('Making API call to fetch post by ID:', postId); // Log the API call
    const response = await apiClient.get(`/post/${postId}`);
    return response.data;
  } catch (error) {
    console.error('Error in getPostByIdApi:', error); // Log the error
    handleApiError(error);
  }
};

// Fetch all users
export const getUsersApi = async () => {
  try {
    const response = await apiClient.get('/account/users');
    return response.data;
  } catch (error) {
    console.error('Error in getting all users:', error);
    handleApiError(error);
  }
};

// Fetch user profile detail
export const getUserDetailApi = async (id) => {
  try {
    const response = await apiClient.get(`/account/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error in getting user detail:', error);
    handleApiError(error);
  }
};

// Fetch old chats
export const getChatHistoryApi = async (userId2) => {
  try {
    const response = await apiClient.get(`/chat/${userId2}`);
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

// Post a message
export const postMessageApi = async (data) => {
  try {
    const response = await apiClient.post('/chat', data);
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

// Fetch chatted users
export const getChattedUsersApi = async (userId) => {
  try {
    const response = await apiClient.get(`/chat/chattedUsers/${userId}`);
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

// Get user ID from token
export const getUserIdFromToken = async () => {
  const token = localStorage.getItem('token');

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

// Like a post
export const likePost = async (postId) => {
  try {
    const response = await apiClient.post(`/post/${postId}/like`);
    return response.data;
  } catch (error) {
    console.error('Error liking post:', error);
    handleApiError(error);
  }
};

// Unlike a post
export const unlikePost = async (postId) => {
  try {
    const response = await apiClient.post(`/post/${postId}/unlike`);
    return response.data;
  } catch (error) {
    console.error('Error unliking post:', error);
    handleApiError(error);
  }
};

// Fetch user detail
export const fetchUserDetail = async (userId) => {
  try {
    const response = await apiClient.get(`/user/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching user detail:', error);
    handleApiError(error);
  }
};
