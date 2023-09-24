import { Course, Layout } from "../hooks/useCourses";

enum SelectedLayoutActionType {SET, CLEAR}
type SelectedLayoutState = {course: Course, layout: Layout} | null
type SelectedLayoutAction = {type: SelectedLayoutActionType, data: SelectedLayoutState}

const reducer = (state: SelectedLayoutState = null, action: SelectedLayoutAction): SelectedLayoutState | null => {
    switch(action.type) {
        case SelectedLayoutActionType.SET:
            return action.data;
        case SelectedLayoutActionType.CLEAR:
            return null;
        default:
            return state;
    }
};

export const setSelectedLayout = (course: Course, layout: Layout): SelectedLayoutAction => {
    return {
        type: SelectedLayoutActionType.SET,
        data: {
            course,
            layout,
        }
    };
};

export const clearSelectedLayout = (): SelectedLayoutAction => ({
    type: SelectedLayoutActionType.CLEAR,
    data: null
});

export default reducer;