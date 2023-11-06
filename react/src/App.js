import './App.css';
import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes, Switch } from 'react-router-dom';
import Header from './components/header/header'
import Navbar from './components/navBar/navbar'
import Home from './pages/home/home'
import Footer from './components/footer/footer'
import SignIn from './pages/signIn/SignIn'
import SignUp from './pages/signUp/signUp'
import Review from './pages/review/review'
import { getUser, removeUser, findUser, updateUser } from "./data/repo";
import ProfileManagement from './pages/profileManagement/ProfileManagement';
import ProfileEdit from './pages/profileEdit/ProfileEdit';
import movie from "./movieData.json"
import ViewReviews from './pages/viewReviews/ViewReviews';
import EditReviews from './pages/editReview/EditReviews';

export default function App() {
  const [user, setUser] = useState(getUser());
  // console.log("findUser: ", findUser("abu@example.com"))
  // function handleState(newValue) {
  //   // console.log("newValue: ", newValue)
  //   setUser(newValue);
  // }
  console.log("user in app: ", user);
  const loginUser = (user) => {
    setUser(user);
  };
  // console.log("username: ", user.username);
  const logoutUser = () => {
    removeUser();
    setUser(null);
  };

  const editUser = (user) => {
    console.log("editUser: ", user);
    setUser(user);
  };
  return (
    <div>
      <Header />
      <Router>
        {/*<Navbar username={username} email={email} logoutUser={logoutUser} />*/}
        <Navbar user={user} logoutUser={logoutUser} />
        <main>
          {/*{console.log("username: ", username)}*/}
          <div>
            <Routes>
              <Route path="/" element={<Home user={user} />} />
              <Route path="/signIn" element={<SignIn change={loginUser} />} />
              <Route path="/signUp" element={<SignUp loginUser={loginUser} />} />
              <Route path='/profile' element={<ProfileManagement user={user} logoutUser={logoutUser} /*deleteReview={deleteReview}*/ ></ProfileManagement>}></Route>
              <Route path='/edit/:email' element={<ProfileEdit user={user} edit={editUser} />}></Route>
              <Route path="/review" element={<Review user={user} />} />
              <Route path="/viewReviews" element={<ViewReviews user={user} />} />
              <Route path="/editReview" element={<EditReviews user={user} />} />

            </Routes>
          </div>
        </main>
        <Footer />
      </Router>
    </div>
  );
}

