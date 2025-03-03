import { Text } from "react-native";

export default function CustomText({
  variant,
  children,
  align = "left",
  color = "black",
  style,
}) {
  let fontSize;
  let fontWeight;

  switch (variant) {
    case "display":
      fontSize = 32;
      fontWeight = "bold";
      break;
    case "headline":
      fontSize = 24;
      fontWeight = "700";
      break;
    case "title":
      fontSize = 20;
      fontWeight = "600";
      break;
    case "body":
      fontSize = 16;
      fontWeight = "500";
      break;
    case "caption":
      fontSize = 12;
      fontWeight = "400";
      break;
    default:
      fontSize = 14;
      fontWeight = "400";
  }

  return (
    <Text
      style={[
        {
          fontSize,
          fontWeight,
          textAlign: align,
          width: "100%",
          marginBottom: 10,
          color,
        },
        style,
      ]}
    >
      {children}
    </Text>
  );
}
