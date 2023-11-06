import axios from "axios";

// --- Constants ----------------------------------------------------------------------------------
const API_HOST = "http://localhost:4000";
const USER_KEY = "user";

// --- User ---------------------------------------------------------------------------------------
async function verifyUser(email, password) {
  try {
    const response = await axios.get(API_HOST + "/api/users/login", { params: { email, password } });
    
    console.log('API response:', response); // Log the API response
    
    if (response.status === 401) {
      throw new Error(response.data.error);
    }

    const user = response.data;
    if (user !== null) setUser(user);
    return user;
  } catch (error) {
    throw error; // Propagate the error to be caught in `handleSubmit`
  }
}

async function findUser(id) {
  const response = await axios.get(API_HOST + `/api/users/select/${id}`);

  return response.data;
}

async function createUser(user) {
  const response = await axios.post(API_HOST + "/api/users", user);

  return response.data;
}

async function isUserLocked(email) {
  try {
    const response = await axios.get(`${API_HOST}/api/users/isLocked`, {
      params: { email }
    });
    return response.data.isLocked;  // Ensure your API sends a boolean under `isLocked` key
  } catch (error) {
    console.error("Error in isUserLocked:", error);
    throw error; // Propagate the error up
  }
}

// --- Post ---------------------------------------------------------------------------------------
async function getPosts() { 
  const response = await axios.get(API_HOST + "/api/posts");

  return response.data;
}

//--- Update ------------------------------------------------------------------------------------
async function updateUser(user) {
  const response = await axios.put(API_HOST + "/api/users", user);
  setUser(user);
  return response.data;
}

// --- Delete ------------------------------------------------------------------------------------
async function deleteUser(email) {
  const response = await axios.delete(API_HOST + `/api/users/delete/${email}`);

  return response.data;
}

//---GetByEmail ------------------------------------------------------------------------------------
async function getByEmail(email) {
  const response = await axios.get(API_HOST + `/api/users/select/${email}`);

  return response.data;
}

//---GetAllMovies ------------------------------------------------------------------------------------
async function getMovies() { 
  const response = await axios.get(API_HOST + "/api/movies");
  console.log("response ", response.data);
  return response.data;
}

async function getMovieByTitle(title) {
  const response = await axios.get(API_HOST + `/api/movies/select/${title}`);

  return response.data;
}

//--- Movie views ------------------------------------------------------------------------------------
async function updateViews(movie){
  const response = await axios.put(API_HOST + "/api/movies", movie);

  return response.data;
}

async function createPost(post) {
  try {
    const response = await axios.post(API_HOST + "/api/posts", post);
    return response.data;
  } catch (error) {
    console.error("Error in createPost:", error); // Log for debugging
    throw error; // Propagate the error up
  }
}

//---GetAllReviews ------------------------------------------------------------------------------------
async function getReviews() { 
  const response = await axios.get(API_HOST + "/api/posts");
  console.log("getall review response ", response.data);
  return response.data;
}

//---GetAllRemivesByEmail ------------------------------------------------------------------------------------
async function getAllReviewsByEmail(email) {
  const response = await axios.get(API_HOST + `/api/posts/selectBy/${email}`);
  return response.data;
}

//---getAllReviewsByTitle ------------------------------------------------------------------------------------
async function getAllReviewsByTitle(title) {
  const response = await axios.get(API_HOST + `/api/posts/selectBy/${title}`);

  return response.data;
}

// --- Delete Review ------------------------------------------------------------------------------------
async function deleteReview(post_id) {
  console.log("delete review ", post_id);
  const response = await axios.delete(API_HOST + `/api/posts/delete/${post_id}`);
  console.log("review deleted ", post_id);
  console.log("review deleted ", response);
  return response.data;
}
// --- DeleteByEmail ------------------------------------------------------------------------------------
async function deleteReviewByEmail(email) {
  console.log("delete review by email ", email);
  const response = await axios.delete(API_HOST + `/api/posts/deleteBy/${email}`);
  console.log("review deleted  by email", email);
  console.log("review deleted by email ", response);
  return response.data;
}

// --- Delete all Review ------------------------------------------------------------------------------------
async function deleteAllReviewByEmail(email) {
  console.log("delete review ", email);
  const response = await axios.delete(API_HOST + `/api/posts/delete/${email}`);
  console.log("review deleted ", email);
  console.log("review deleted ", response);
  return response.data;
}
// --- Update Review ------------------------------------------------------------------------------------
async function updateReview(review) {
  console.log("updateReview ", review);
  const response = await axios.put(API_HOST + "/api/posts", review);
  console.log("update response ", response);
  return response.data;
}

// --- Create Reservation ------------------------------------------------------------------------------------
async function createReservation(user_session) {
  const response = await axios.post(API_HOST + "/api/sessions", user_session);
  return response.data;
}

//---GetAllReservationByEmail ------------------------------------------------------------------------------------
async function getAllReservationByEmail(email) {
  const response = await axios.get(API_HOST + `/api/sessions/select/${email}`);
  return response.data;
}

//---getAllSessionByTitle ------------------------------------------------------------------------------------
async function getAllSessionByTitle(movie_title) {
  console.log("movie_title ", movie_title);
  const response = await axios.get(API_HOST + `/api/sessions/select/${movie_title}`);
  console.log("getAllSessionByTitle  response-------------------", response.data);
  return response.data;
}

//---getSessionByID ------------------------------------------------------------------------------------
async function getSessionById(session_id) {
  const response = await axios.get(API_HOST + `/api/sessions/selectUserSession/${session_id}`);
  return response.data;
}

// --- Update Reservation ------------------------------------------------------------------------------------
async function updateReservation(sessions) {
  const response = await axios.put(API_HOST + "/api/sessions", sessions);
  console.log("update response ", response);
  return response.data;
}

// --- Session ---------------------------------------------------------------------------------------
async function getSessions() { 
  const response = await axios.get(API_HOST + "/api/sessions");
  return response.data;
}

// --- Helper functions to interact with local storage --------------------------------------------
function setUser(user) {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

function getUser() {
  return JSON.parse(localStorage.getItem(USER_KEY));
}

function removeUser() {
  localStorage.removeItem(USER_KEY);
}

export {
  verifyUser, findUser, createUser,
  getPosts, getByEmail, updateUser, deleteUser,
  getUser, removeUser, getMovies, getMovieByTitle, createPost,
  getAllReviewsByEmail, getAllReviewsByTitle, getReviews,
  deleteReview, deleteAllReviewByEmail, deleteReviewByEmail, updateReview,
  createReservation, getAllReservationByEmail, getAllSessionByTitle, updateReservation,
  getSessions, getSessionById, updateViews, isUserLocked
}
