export function applyTheme(theme: Record<string, string | undefined>): void {
    const root = document.documentElement;
    Object.entries(theme).forEach(([cssVar, value]) => {
      if (value) {
        root.style.setProperty(cssVar, value);
      }
    });
  }
  