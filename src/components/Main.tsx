import { StatusBar } from 'expo-status-bar';
import React from 'react';
import ToolBar from './ToolBar';

import { Routes, Route, useNavigate } from 'react-router-native';

import Game from '../screens/Game';
import Frontpage from '../screens/Frontpage';
import SelectCourses from './SelectCourse';
import FriendsList from './FriendsList';
import Notifications from './Notifications';
import OldGamesList from './OldGamesList';
import SignUp from './SignUp';
import Settings from '../screens/Settings';
import Stats from '../screens/Stats';

export default function App() {
  const navi = useNavigate();
  const goBack = () => {
    navi(-1);
  };
  return (
    <>
      <Notifications />
      <ToolBar handleMenuClick={goBack} />
      <Routes>
        <Route path="/signUp" element={<SignUp />} />
        <Route path="/game" element={<Game />} />
        <Route path="/games" element={<OldGamesList />} />
        <Route path="/courses" element={<SelectCourses />} />
        <Route path="/friends" element={<FriendsList />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/stats" element={<Stats />} />
        <Route path="/" element={<Frontpage />} />
      </Routes>
      <StatusBar style="auto" />
    </>
  );
}
