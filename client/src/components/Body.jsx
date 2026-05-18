import React, { useEffect } from 'react'
import NavBar from './NavBar'
import { Outlet, useNavigate } from 'react-router-dom'
import Footer from './Footer'
import { API_BASE_URL } from '../utils/constants'
import axios from 'axios'
import { useDispatch, useSelector } from 'react-redux'
import { addUser } from '../utils/userSlice'

const Body = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userData = useSelector((store) => store.user);

  const fetchUser = async () => {
    if( userData ) return; // If user data already exists in the store, no need to fetch again
    try {
      const res = await axios.get(`${API_BASE_URL}/profile/view`, {
        withCredentials: true
      });

      console.log('User profile fetched successfully:', res.data);
      dispatch(addUser(res.data));
    } catch (error) {
      console.error('Error fetching user profile:', error);
      if(error.response && error.response.status === 401) {
        navigate('/login');
      }
    }
  }

  useEffect(() => {
      fetchUser();
  }, [])

  return (
    <>
      <NavBar />
      <Outlet />
      <Footer />
    </>
  )
}

export default Body