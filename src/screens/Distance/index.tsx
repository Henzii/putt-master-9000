import React, { useCallback, useState } from "react";
import { FC } from "react";
import { BottomNavigation } from "react-native-paper";
import Measure from "./Measure";
import List from "./List";
import { useMeasuredThrows } from "@hooks/useMeasuredThrows";
import { MeasuredThrow } from "src/types/throws";
import { useDispatch } from "react-redux";
import { addNotification } from "src/reducers/notificationReducer";

const Distance: FC = () => {
  const [index, setIndex] = useState(0);
  const { throws, addMeasuredThrow } = useMeasuredThrows();
  const dispatch = useDispatch();

  const handleAddMeasuredThrow = (
    measuredThrow: Omit<MeasuredThrow, "createdAt">
  ) => {
    try {
      addMeasuredThrow({ variables: { measuredThrow } });
      dispatch(addNotification("New measurement added", "success"));
    } catch {
      dispatch(addNotification("Something went wrong", "warning"));
    }
  };
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

  const ListComponent = useCallback(() => <List throws={throws} />, [throws]);
  const MeasureComponent = useCallback(
    () => <Measure onAddMeasuredThrow={handleAddMeasuredThrow} />,
    []
  );

  const renderScene = BottomNavigation.SceneMap({
    list: ListComponent,
    measure: MeasureComponent,
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
