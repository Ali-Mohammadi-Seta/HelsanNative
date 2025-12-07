export const toEnglishDigits = (str: string): string => {
    // Convert Persian digits [۰۱۲۳۴۵۶۷۸۹]
    let baseCode = '۰'.charCodeAt(0);
    str = str.replace(/[۰-۹]/g, (t): string => String(t.charCodeAt(0) - baseCode));
  
    // Convert Arabic-Indic digits [٠١٢٣٤٥٦٧٨٩]
    baseCode = '٠'.charCodeAt(0);
    str = str.replace(/[٠-٩]/g, (t): string => String(t.charCodeAt(0) - baseCode));
  
    return str;
  };
  