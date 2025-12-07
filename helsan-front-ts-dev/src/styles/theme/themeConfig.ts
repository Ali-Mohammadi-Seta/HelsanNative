export  const colors = {
    colorBgSider: "var(--theme-colorBgSider)", //"#1677ff"
    colorBgHeader: "var(--theme-colorBgHeader)", //"#1677ff"
    colorSubText: "var(--theme-colorSubText)", //"#d9d9d9",
    colorPrimary: "var(--theme-colorPrimary)", //"#1677ff", #1677ff  #95de64
    colorSecondary: "var(--theme-colorSecondary)", //"#002140",
    colorBgContainer: "var(--theme-colorBgContainer)", //"#1677ff",
    colorBgBase: "var(--theme-colorBgBase)", //"#ffffff",
    colorBgElevated: "var(--theme-colorBgElevated)", // "#ffffff"
    colorBgLayout: "var(--theme-colorBgLayout)", // "#f5f5f5"
    colorBgMask: "var(--theme-colorBgMask)", // rgba(0, 0, 0, 0.45)
    colorBgSpotlight: "var(--theme-colorBgSpotlight)", //rgba(0, 0, 0, 0.85)
    colorBgContainerDisabled: "var(--theme-colorBgContainerDisabled)", // rgba(0, 0, 0, 0.04)
    colorBgTextActive: "var(--theme-colorBgTextActive)", // rgba(0, 0, 0, 0.15)
    colorBgTextHover: "var(--theme-colorBgTextHover)", // rgba(0, 0, 0, 0.06)
    colorPrimaryActive: "var(--theme-colorPrimaryActive)",
    colorPrimaryBg: "var(--theme-colorPrimaryBg)",
    colorPrimaryBgHover: "var(--theme-colorPrimaryBgHover)",
    colorPrimaryBorder: "var(--theme-colorPrimaryBorder)",
    colorPrimaryBorderHover: "var(--theme-colorPrimaryBorderHover)",
    colorPrimaryHover: "var(--theme-colorPrimaryHover)",
    colorPrimaryText: "var(--theme-colorPrimaryText)",
    colorPrimaryTextActive: "var(--theme-colorPrimaryTextActive)",
    colorPrimaryTextHover: "var(--theme-colorPrimaryTextHover)",
  
    // borderRadius: 8,
  
    // colorError: "#ff4d4f",
    // colorInfo: "#1677ff",
    // colorSuccess: "#52c41a",
    // colorTextBase: "#000",
    // colorWarning: "#faad14",
    // controlHeight: "32",
    // fontFamily:
    //   "YekanBakh, IRANSans, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue,sans-serif",
    // fontSize: "14",
    // lineType: "solid",
    // lineWidth: 1,
    // motionUnit: 0.1,
    // sizeStep: 4,
    // sizeUnit: 4,
    // wireframe: false,
    // zIndexBase: 0,
    // zIndexPopupBase: 1000,
    // components: {
    //   Radio: {
    //     colorPrimary: '#00b96b',
    //   },
    // },
  };
  interface Palette {
    colorBgSider: string;
    colorHeader?: string;
    colorSubText: string;
    colorPrimary: string;
    colorSecondary: string;
    colorBgSpotlight?: string;
  }
  
 export const algorithms = {};
  
  export const paletteConfig =(palette: Palette): Record<string, string | undefined> => {
    return {
      "--theme-colorBgSider": palette?.colorBgSider,
      "--theme-colorHeader": palette?.colorHeader,
      "--theme-colorSubText": palette?.colorSubText,
      "--theme-colorPrimary": palette?.colorPrimary,
      "--theme-colorSecondary": palette?.colorSecondary,
    };
  };
  

  
  // const pallet1 = {
  //   colorBgSider: "#005EA2",
  //   colorHeader: "#002140",
  //   colorSubText: "#d9d9d9",
  //   colorPrimary: "#1677ff", //#1677ff  #95de64
  //   colorSecondary: "#002140",
  //   colorSuccess: "#22C568",
  //   colorError: "#EF4444",
  //   colorTextBase: "#0000",
  //   // blue
  //   color_1_Theme900: "#153C5B",
  //   color_1_Theme800: "#0B4778",
  //   color_1_Theme700: "#06538D",
  //   color_1_Theme600: "#005EA2",
  //   color_1_Theme500: "#2378E3",
  //   color_1_Theme400: "#4B96E5",
  //   color_1_Theme300: "#73B3E7",
  //   color_1_Theme200: "#B1D5F1",
  //   color_1_Theme100: "#EFF6FB",
  //   // gray
  //   color_2_Theme500: "#C9C9C9",
  //   color_2_Theme400: "#E1E1E1",
  //   color_2_Theme300: "#EDEDED",
  //   color_2_Theme200: "#F4F4F4",
  //   color_2_Theme100: "#F7F7F7",
  // };
  // const pallet2 = {
  //   colorBgSider: "#B352CE",
  //   colorHeader: "##6FC6F0",
  //   colorSubText: "#ffff",
  //   colorPrimary: "#C574DC",
  //   colorSecondary: "#002140",
  //   colorSuccess: "#22C568",
  //   colorError: "#EF4444",
  //   colorTextBase: "#0000",
  //   // purpule
  //   color_1_Theme900: "#642C73",
  //   color_1_Theme800: "#B352CE",
  //   color_1_Theme700: "#A647C1",
  //   color_1_Theme600: "#BF66D8",
  //   color_1_Theme500: "#C574DC",
  //   // gray
  //   color_2_Theme500: "#C9C9C9",
  //   color_2_Theme400: "#E1E1E1",
  //   color_2_Theme300: "#EDEDED",
  //   color_2_Theme200: "#F4F4F4",
  //   color_2_Theme100: "#F7F7F7",
  // };
  