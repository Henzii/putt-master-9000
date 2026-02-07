import React, { useCallback, useMemo, useState } from "react";
import { FC } from "react";
import { BottomNavigation } from "react-native-paper";
import { useTranslation } from 'react-i18next';
import Measure from "./Measure";
import List from "./List";
import { useMeasuredThrows } from "@hooks/useMeasuredThrows";
import { MeasuredThrow } from "src/types/throws";
import { useDispatch } from "react-redux";
import { addNotification } from "src/reducers/notificationReducer";

const Distance: FC = () => {
  const [index, setIndex] = useState(0);
  const { throws, addMeasuredThrow, deleteMeasuredThrow } = useMeasuredThrows();
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const routes = useMemo(() => [
    {
      key: "list",
      title: t('screens.distance.listTab'),
      focusedIcon: "view-list",
      unfocusedIcon: "view-list-outline",
    },
    {
      key: "measure",
      title: t('screens.distance.measureTab'),
      focusedIcon: "tape-measure",
    },
  ], [t]);

  const handleAddMeasuredThrow = (
    measuredThrow: Omit<MeasuredThrow, "createdAt" | "id">
  ) => {
    try {
      addMeasuredThrow({ variables: { measuredThrow } });
      dispatch(addNotification(t('screens.distance.newMeasurementAdded'), "success"));
    } catch {
      dispatch(addNotification(t('screens.distance.somethingWentWrong'), "warning"));
    }
  };

  const handleDeleteMeasuredThrow = (throwId: string) => {
    try {
      deleteMeasuredThrow({ variables: { throwId } });
      dispatch(addNotification(t('screens.distance.measurementDeleted'), "success"));
    } catch {
      dispatch(addNotification(t('screens.distance.somethingWentWrong'), "warning"));
    }
  };

  const ListComponent = useCallback(
    () => <List throws={throws} onDelete={handleDeleteMeasuredThrow} />,
    [throws]
  );
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
