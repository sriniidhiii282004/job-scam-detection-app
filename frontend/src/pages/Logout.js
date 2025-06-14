import { redirect } from "react-router";
import { getAuthToken } from "../util/auth";

export function logoutAction() {
  localStorage.removeItem('token');
  return redirect('/');
}

export function tokenLoader(){
  return localStorage.getItem('token');
}

export function checkAuthLoader(){
  const token = getAuthToken();
  if (!token) {
    return redirect('/auth');
  }
  
}