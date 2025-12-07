// ✅ NEW: Hover color mapping with smooth transitions
export const getHoverClass = (
  hoverable: boolean,
  hoverClassName: string,
  hoverColor: string
) => {
  if (!hoverable) return "";
  if (hoverClassName) return hoverClassName;

  switch (hoverColor) {
    case "cyan":
      return "hover:bg-cyan-100/70";
    case "blue":
      return "hover:bg-blue-100/70";
    case "green":
      return "hover:bg-green-100/70";
    case "purple":
      return "hover:bg-purple-100/70";
    case "pink":
      return "hover:bg-pink-100/70";
    case "gray":
      return "hover:bg-zinc-100/70";
    default:
      return "hover:bg-cyan-100/70";
  }
};
