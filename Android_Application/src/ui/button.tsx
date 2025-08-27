import {
  ActivityIndicator,
  type GestureResponderEvent,
  StyleSheet,
  Text,
  TouchableOpacity,
  type ViewStyle,
} from "react-native";
import { radii, spacing, typography } from "@/design/styles";
import { useTheme } from "../../context/theme-context";
import { JSX, ReactElement } from "react";

type Variant = "primary" | "secondary" | "ghost" | "danger";
type Size = "md" | "lg";

interface ButtonProps {
  title: string | ReactElement;
  onPress?: (e: GestureResponderEvent) => void;
  variant?: Variant;
  size?: Size;
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  style?: ViewStyle;
}

export function NButton({
  title,
  onPress,
  variant = "primary",
  size = "lg",
  disabled,
  loading,
  fullWidth,
  style,
}: ButtonProps): JSX.Element {
  const { palette } = useTheme();
  const styles = getStyles({ variant, size, fullWidth, disabled, palette });

  return (
    <TouchableOpacity
      disabled={disabled || loading}
      onPress={onPress}
      style={[styles.base, style]}
    >
      {loading ? (
        <ActivityIndicator
          color={getActivityIndicatorColor(variant, palette)}
        />
      ) : (
        <Text style={styles.text}>{title}</Text>
      )}
    </TouchableOpacity>
  );
}

function getActivityIndicatorColor(variant: Variant, palette: any): string {
  switch (variant) {
    case "secondary":
    case "ghost":
      return palette.text;
    case "danger":
      return palette.textInverse;
    case "primary":
    default:
      return palette.textInverse;
  }
}

function getStyles({
  variant,
  size,
  fullWidth,
  disabled,
  palette,
}: {
  variant: Variant;
  size: Size;
  fullWidth?: boolean;
  disabled?: boolean;
  palette: any;
}) {
  const getBackgroundColor = (): string => {
    switch (variant) {
      case "primary":
        return palette.primary;
      case "secondary":
        return palette.card;
      case "danger":
        return palette.danger;
      case "ghost":
      default:
        return "transparent";
    }
  };

  const getTextColor = (): string => {
    switch (variant) {
      case "secondary":
      case "ghost":
        return palette.text;
      case "danger":
      case "primary":
      default:
        return palette.textInverse;
    }
  };

  const getBorderColor = (): string => {
    switch (variant) {
      case "secondary":
        return palette.border;
      case "ghost":
        return palette.borderLight;
      default:
        return "transparent";
    }
  };

  const base: ViewStyle = {
    backgroundColor: getBackgroundColor(),
    borderRadius: radii.button,
    paddingVertical: size === "lg" ? spacing.md : spacing.sm,
    paddingHorizontal: spacing.xl,
    borderWidth: variant === "secondary" || variant === "ghost" ? 1 : 0,
    borderColor: getBorderColor(),
    alignItems: "center",
    opacity: disabled ? 0.4 : 1,
    width: fullWidth ? "100%" : undefined,
  };

  const text = {
    ...typography.button,
    fontSize: size === "lg" ? 16 : 14,
    color: getTextColor(),
  };

  return StyleSheet.create({ base, text });
}
