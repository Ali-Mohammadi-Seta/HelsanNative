import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { applyTheme } from "@/styles/theme/applyTheme";
import { paletteConfig } from "@/styles/theme/themeConfig";
import { setTheme } from "@/redux/reducers/theme";
import { paletteBase } from "@/styles/theme/palette";

export const useTheme = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { paletteAntd, paletteTailwind } = useSelector(
    (state: RootState) => state.theme
  );

  useEffect(() => {
    paletteTailwind && applyTheme(paletteTailwind);
  }, [paletteTailwind]);

  useEffect(() => {
    const storedPalette = localStorage.getItem("preferredPalette");
    if (storedPalette) {
      dispatch(
        setTheme({
          paletteTailwind: paletteConfig(JSON.parse(storedPalette)),
          paletteAntd: JSON.parse(storedPalette),
        })
      );
    } else {
      dispatch(
        setTheme({
          paletteTailwind: paletteConfig(paletteBase),
          paletteAntd: paletteBase,
        })
      );
    }
  }, []);

  return { paletteAntd, paletteTailwind };
};
