//  We create a UserContext using React's createContext.
//  The UserProvider component fetches the user's profile on mount and provides user data and functions to the rest of the app.
//  The useUser hook allows components to access user data and functions easily.(Using  the hookis better)
//  The user data is stored in the state and updated whenever the user logs in, logs out, or updates their profile.
//  The context provides a clean API for user-related operations

// example usage in a component would be like this:
/* 

import { useUser } from "../../contexts/UserContext";

  const { login } = useUser(); 

  const onSubmit = async (data) => {
    try {
      await login(data); // use context login
      alert("Login successful!");
      reset();
      navigate("/profile");
    } catch (error) {
      alert(error.message);
    }
  };
*/

import React, { createContext, useContext, useState, useEffect } from "react";
import * as userService from "../api/userService.js";
const UserContext = createContext();

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProfile() {
      try {
        const data = await userService.getProfile();
        setUser(data.user ?? data);
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, []);

  // --- functions ---
  const login = async (credentials) => {
    await userService.login(credentials);

    // fetch profile
    const data = await userService.getProfile();
    setUser(data.user ?? data);
  };
  // logout function
  const logout = async () => {
    await userService.logout();
    setUser(null);
  };
  // update profile function
  const updateProfile = async (data) => {
    const updated = await userService.updateProfile(data);
    setUser(updated.user ?? updated);
  };

  return (
    <UserContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: !!user, // true if user is logged in
        login,
        logout,
        updateProfile,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}
export function useUser() {
  return useContext(UserContext);
}
