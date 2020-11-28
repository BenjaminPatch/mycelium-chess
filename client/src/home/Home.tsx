import React from 'react';
import StudentHome from './StudentHome';
import StaffHome from './StaffHome';
import { authStore } from "../App";
import { useStore } from "effector-react";

function Home() {
  const auth = useStore(authStore);

  if (auth.userType === 'staff') {
    return <StaffHome />;
  } else {
    return <StudentHome />;
  }
}

export default Home;

