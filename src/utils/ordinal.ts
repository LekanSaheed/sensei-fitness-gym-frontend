/** 1 -> "st", 2 -> "nd", 3 -> "rd", 11 -> "th", 22 -> "nd" ... */
export const ordinalSuffix = (n: number) => {
  const mod100 = n % 100;

  if (mod100 >= 11 && mod100 <= 13) return "th";

  return ({ 1: "st", 2: "nd", 3: "rd" } as Record<number, string>)[n % 10] || "th";
};

/** 1 -> "1st", 2 -> "2nd", 3 -> "3rd", 4 -> "4th" */
export const ordinal = (n: number) => `${n}${ordinalSuffix(n)}`;
