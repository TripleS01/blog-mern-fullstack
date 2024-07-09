import './App.css';
import { Route, Routes } from 'react-router-dom';

import PathTo from './paths';
import UserContextProvider from './contexts/UserContext';

import Layout from './components/Main/Layout';
import Home from './components/Main/Home';
import Posts from './components/Posts/Posts';
import CreatePost from './components/Posts/CreatePost';
import Login from './components/Authorization/Login';
import Register from './components/Authorization/Register';
import PostPage from './components/Posts/PostPage';
import EditPost from './components/Posts/EditPost';
import Profile from './components/Profile/Profile';
import Footer from './components/Main/Footer';

function App() {
   return (
      <>

            <UserContextProvider>
               <Routes>
                  <Route path={PathTo.Home} element={<Layout />}>
                     <Route index element={<Home />} />
                     <Route path={PathTo.Posts} element={<Posts />} />
                     <Route path={PathTo.PostId} element={<PostPage />} />
                     <Route path={PathTo.CreatePost} element={<CreatePost />} />
                     <Route path={PathTo.EditPostId} element={<EditPost />} />
                     <Route path={PathTo.Profile} element={<Profile />} />
                     <Route path={PathTo.Login} element={<Login />} />
                     <Route path={PathTo.Register} element={<Register />} />
                  </Route>
               </Routes>

            </UserContextProvider>

      </>
   );
}

export default App;
