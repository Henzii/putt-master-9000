import React, { useState } from'react';
import { GestureResponderEvent, View } from 'react-native';
import { IconButton, Menu } from 'react-native-paper';
import { confirmCourseDeletion } from './alerts';
import { useApolloClient, useMutation } from '@apollo/client';
import { DELETE_COURSE } from '../../graphql/mutation';
import type { Course } from '../../types/course';
import { useDispatch } from 'react-redux';
import { extractApolloErrorMessage } from '../../utils/apollo';
import { addNotification } from '../../reducers/notificationReducer';
import { GET_COURSES } from '../../graphql/queries';

type Props = {
    course: Course
    onEditCoursePress: () => void
}

const ExtraMenu = ({course, onEditCoursePress}: Props) => {
    const [visible, setVisible] = useState(false);
    const [anchor, setAnchor] = useState({x: 0, y: 0});
    const [deleteCourse] = useMutation(DELETE_COURSE);
    const dispatch = useDispatch();
    const client = useApolloClient();

    const handleOpenMenu = (event: GestureResponderEvent) => {
        setAnchor({
            x: event.nativeEvent.pageX,
            y: event.nativeEvent.pageY
        });
        setVisible(true);
    };

    const handleEditCourse = () => {
        onEditCoursePress();
        setVisible(false);
    };

    const handleDeleteCourse = () => {
        confirmCourseDeletion({
            onConfirm: async () => {
                try {
                    await deleteCourse({variables: { courseId: course.id}});
                    dispatch(addNotification('Course deleted', 'success'));
                    client.refetchQueries({include:[GET_COURSES]});
                } catch (error) {
                    dispatch(addNotification(`Course was not deleted! ${extractApolloErrorMessage(error)}`, 'alert'));
                } finally {
                    setVisible(false);
                }
            },
            onCancel: () => setVisible(false)
        });
    };

    return (
        <View>
            <IconButton icon="dots-horizontal" onPress={handleOpenMenu} size={20} />
            <View>
                <Menu
                    visible={visible}
                    onDismiss={() => setVisible(false)}
                    anchor={anchor}
                >
                    <Menu.Item title="Edit course" onPress={handleEditCourse} />
                    <Menu.Item title="Delete course" onPress={handleDeleteCourse} />
                </Menu>
            </View>
            </View>
    );
};

export default ExtraMenu;