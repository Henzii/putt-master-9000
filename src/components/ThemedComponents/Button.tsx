import React, { ComponentProps } from "react";
import { Button as PaperButton, useTheme } from "react-native-paper";

export type ButtonVariant = "primary" | "secondary" | "tertiary" | "text";

type Props = Omit<ComponentProps<typeof PaperButton>, "mode" | "buttonColor" | "textColor"> & {
  variant?: ButtonVariant;
};

const Button = ({ variant = "primary", ...props }: Props) => {
  const { colors } = useTheme();

  if (variant === "text") {
    return <PaperButton {...props} mode="text" textColor={colors.onBackground} />;
  }

  if (variant === "secondary") {
    return (
      <PaperButton
        {...props}
        mode="outlined"
        textColor={colors.onBackground}
        style={[{ borderColor: colors.primary }, props.style]}
      />
    );
  }

  const [buttonColor, textColor] =
    variant === "tertiary"
      ? [colors.tertiary, colors.onTertiary]
      : [colors.primary, colors.onPrimary];

  return (
    <PaperButton
      {...props}
      mode="contained"
      buttonColor={buttonColor}
      textColor={textColor}
    />
  );
};

export default Button;
