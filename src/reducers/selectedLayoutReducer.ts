import { Course, Layout } from "../types/course";

const SelectedLayoutActionType = {
    SET: 'SET',
    CLEAR: 'CLEAR'
} as const;

type SelectedLayoutState = {course: Course, layout: Layout} | null
type SelectedLayoutAction = {type: (typeof SelectedLayoutActionType[keyof typeof SelectedLayoutActionType]), data: SelectedLayoutState}

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