// This file contains functions to interact with the user-related API endpoints. you can use these functions to get the user's profile, update it, log out, log in, and register a new user. The functions use the `httpClient` to make requests to the server, we abstracted the HTTP request logic into a separate file to keep the code clean and maintainable.
// example usage in a component would be like this but mostly we will use the context to access these functions:

/** const onSubmit = async (data) => {
  try {
    await register(fullData);
    alert("Registration successful!");
    reset();
  } catch (error) {
    alert(error.message);
  }
}; */

import { httpClient } from "./client";
export function getProfile() {
  return httpClient("/profile");
}

export function updateProfile(profileData) {
  return httpClient("/profile", {
    method: "PATCH",
    body: profileData,
  });
}
export function logout() {
  return httpClient("/users/logout", { method: "POST" });
}

// these will be for refactoring later and to have cleaner components.
export function login(credentials) {
  return httpClient("/users/login", {
    method: "POST",
    body: credentials,
  });
}
export function register(userData) {
  return httpClient("/users/register", {
    method: "POST",
    body: userData,
  });
}

// this function is used to delete the user account.
export function deleteAccount() {
  return httpClient("/users/delete", {
    method: "POST",
  });
}
