import React from "react";
import { fireEvent, render, waitFor } from "@testing-library/react-native";
import Settings from "../screens/Settings";
import Wrapper from "./mocks/MockWrapper";
import LocalSettingsProvider from "@components/LocalSettingsProvider";
import i18n from "../localization/i18n";

jest.useFakeTimers();

const wrappedSettings = () => (
  <LocalSettingsProvider>
    <Wrapper>
      <Settings />
    </Wrapper>
  </LocalSettingsProvider>
);

describe("<Settings /> test", () => {
  it("block firendrequests switch toggles", async () => {
    const { getByTestId } = render(wrappedSettings());
    const kytkin = getByTestId("blockFriendRequestsSwitch");
    expect(kytkin.props.value).toBeFalsy();

    fireEvent.press(kytkin);

    await waitFor(() => expect(kytkin.props.value).toBeTruthy());
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
