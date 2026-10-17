import React from "react";
import { fireEvent, render, waitFor } from "@testing-library/react-native";
import Settings from "../screens/Settings";
import Wrapper from "./mocks/MockWrapper";
import LocalSettingsProvider from "@components/LocalSettingsProvider";
import i18n from "../localization/i18n";
import { useUpdateSettings } from "@hooks/useUpdateSettings";
import { useSessionV2 } from "@hooks/session/useSessionV2";

jest.useFakeTimers();

jest.mock("@hooks/useUpdateSettings", () => ({
  useUpdateSettings: jest.fn(),
}));

jest.mock("@hooks/session/useSessionV2", () => ({
  useSessionV2: jest.fn(),
}));

const mockUpdateSettings = jest.fn();
const mockedUseSessionV2 = useSessionV2 as jest.Mock;

beforeEach(() => {
  mockUpdateSettings.mockReset();
  mockUpdateSettings.mockReturnValue(jest.fn());
  mockedUseSessionV2.mockReturnValue({
    user: {
      id: "mockedId",
      name: "Mock User",
      email: null,
      accountType: "pleb",
      achievements: [],
      blockFriendRequests: false,
      blockStatsSharing: false,
      groupName: "abc",
    },
    loading: false,
    error: undefined,
  });
  (useUpdateSettings as jest.Mock).mockReturnValue(mockUpdateSettings);
});

const wrappedSettings = () => (
  <LocalSettingsProvider>
    <Wrapper>
      <Settings />
    </Wrapper>
  </LocalSettingsProvider>
);

describe("<Settings /> test", () => {
  it("calls the settings mutation when the friend requests switch is pressed", () => {
    const { getByTestId } = render(wrappedSettings());
    const kytkin = getByTestId("blockFriendRequestsSwitch");

    expect(kytkin.props.value).toBeFalsy();

    fireEvent.press(kytkin);

    expect(mockUpdateSettings).toHaveBeenCalledWith({
      variables: { blockFriendRequests: true },
    });
  });

  it("language selector changes language and propagates to i18n", async () => {
    const { getByText, getByTestId } = render(wrappedSettings());

    // initial title should be in English
    expect(getByText("Language")).toBeTruthy();

    // open the language menu using testID
    const anchor = getByTestId("languageMenuButton");
    fireEvent.press(anchor);

    // choose Finnish (Suomi) from the menu
    const finnish = await waitFor(() => getByText("Suomi"));
    fireEvent.press(finnish);

    // i18n should have switched to Finnish and the Language title should update
    await waitFor(() => expect(i18n.language).toBe("fi"));
    expect(getByText("Kieli")).toBeTruthy();
  });
});
