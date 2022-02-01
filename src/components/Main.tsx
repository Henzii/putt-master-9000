import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import ToolBar from './ToolBar';

import { Routes, Route, useNavigate } from 'react-router-native';

import Game from './Game';
import Frontpage from './Frontpage';
import SelectCourses from './SelectCourse';
import FriendsList from './FriendsList';
import Notifications from './Notifications';
import OldGamesList from './OldGamesList';
import SignUp from './SignUp';
import Login from './Login';

export default function App() {
  const navi = useNavigate();
  const goBack = () => {
    navi(-1);
  }
  return (
    <View style={styles.container}>
      <Notifications />
      <ToolBar handleMenuClick={goBack} />
      <Routes>
        <Route path="/signUp" element={<SignUp />} />
        <Route path="/game" element={<Game />} />
        <Route path="/games" element={<OldGamesList />} />
        <Route path="/courses" element={<SelectCourses />} />
        <Route path="/friends" element={<FriendsList />} />
        <Route path="/" element={<Frontpage />} />
      </Routes>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'flex-start',
    
  },
});
