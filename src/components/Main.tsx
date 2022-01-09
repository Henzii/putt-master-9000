import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import ToolBar from './ToolBar';
import Menu from './Menu';
import { Routes, Route } from 'react-router-native';
import Peli from './Peli';
import Frontpage from './Frontpage';
import SelectCourses from './SelectCourse';

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false)
  return (
    <View style={styles.container}>
      <ToolBar handleMenuClick={() => setMenuOpen(!menuOpen)} />
      <Menu menuOpen={menuOpen} />
      <Routes>
        <Route path="/peli" element={<Peli />} />
        <Route path="/courses" element={<SelectCourses onSelect={(id) => console.log('Valittu ' + id)} />} />
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
