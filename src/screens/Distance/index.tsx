import React, { useState } from "react";
import { FC } from "react";
import { BottomNavigation } from "react-native-paper";
import Measure from "./Measure";
import List from "./List";

const Distance: FC = () => {
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    {
      key: "list",
      title: "List",
      focusedIcon: "view-list",
      unfocusedIcon: "view-list-outline",
    },
    {
      key: "measure",
      title: "Measure",
      focusedIcon: "tape-measure",
    },
  ]);

  const renderScene = BottomNavigation.SceneMap({
    list: List,
    measure: Measure,
  });

  return (
    <BottomNavigation
      navigationState={{ index, routes }}
      onIndexChange={setIndex}
      renderScene={renderScene}
    />
  );
};

export default Distance;
