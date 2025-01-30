import { appAxios } from './apiInterceptors.js';
import { BASE_URI } from './ApiManager.js';
import axios from 'axios';

// Function for user login
export const userLogin = async (data) => {
  try {
    const response = await axios.post(`${BASE_URI}/users/signin`, data, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response;
  } catch (error) {
    throw error;
  }
};

// Function for user signup
export const userSignup = async (data) => {
  try {
    const response = await axios.post(`${BASE_URI}/users/signup`, data, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response;
  } catch (error) {
    throw error;
  }
};

// Function to verify OTP
export const verifyOTP = async (data) => {
  try {
    const response = await axios.post(`${BASE_URI}/users/verify`, data, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response;
  } catch (error) {
    throw error;
  }
};

// Function to get the current logged-in user
export const getCurrentUser = async (Auth_data) => {
  try {
    const response = await appAxios.get(`${BASE_URI}/users/current-user`, {
      headers: {
        'Content-Type': 'application/json',
        // Authorization: `Bearer ${Auth_data.accessToken}`,
      },
    });
    return response;
  } catch (error) {
    throw error;
  }
};

// Function to refresh the token
export const refreshToken = async (data) => {
  try {
    const response = await axios.post(`${BASE_URI}/users/refresh-token`, data, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response;
  } catch (error) {
    throw error;
  }
};

// Function to log out the user
export const logoutUser = async (Auth_data) => {
  try {
    const response = await axios.post(`${BASE_URI}/users/logout`, {}, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${JSON.parse(Auth_data).accessToken}`,
      },
    });
    return response;
  } catch (error) {
    throw error;
  }
};

// Function to update the user's avatar
export const updateAvatar = async (Auth_data, data) => {
  try {
    const response = await axios.patch(`${BASE_URI}/users/avatar`, data, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${Auth_data}`,
      },
    });
    return response;
  } catch (error) {
    throw error;
  }
};

// Function to update officer's ID proof
export const updateOfficerIdProof = async (Auth_data, formData) => {
  try {
    const response = await axios.patch(`${BASE_URI}/users/uploadIdProofDoc`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${Auth_data}`,
      },
    });
    return response;
  } catch (error) {
    if (error.response) {
      console.error('Server responded with an error:', error.response.data);
    } else if (error.request) {
      console.error('No response received:', error.request);
    } else {
      console.error('Error during setup:', error.message);
    }
    throw error;
  }
};


export const uploadFileForChatUser = async (Auth_data, formData, onUploadProgress) => {
  try {
    const response = await axios.post(`${BASE_URI}/chats/uploadChat`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${Auth_data}`,
      },
      onUploadProgress: progressEvent => {
        if (onUploadProgress) {
          onUploadProgress({
            loaded: progressEvent.loaded,
            total: progressEvent.total,
            progress: Math.round((progressEvent.loaded * 100) / progressEvent.total),
          });
        }
      },
      timeout: 600000, // Set timeout for the request (10 minutes)
    });
    return response; 
  } catch (error) {
    if (error.response) {
      console.error('Server responded with an error:', error.response.data);
    } else if (error.request) {
      console.error('No response received:', error.request);
    } else {
      console.error('Error during setup:', error.message);
    }
    throw error; 
  }
};
