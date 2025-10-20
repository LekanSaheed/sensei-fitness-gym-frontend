export default class FormatNumber {
  static digits(num: number) {
    const nfObject = new Intl.NumberFormat();
    return nfObject.format(num);
  }

  static ngnAmount(num: number) {
    const nfObject = new Intl.NumberFormat("us-US", {
      style: "currency",
      currency: "NGN",
      currencyDisplay: "narrowSymbol",
    });
    return nfObject.format(num ?? 0);
  }

  static currencyToNumber(str: string) {
    if (!str) return 0;
    const removeCommas = String(str).replace(/,/g, "");
    return isNaN(removeCommas as unknown as number) ? 0 : Number(removeCommas);
  }

  static shortNumber(num: number, dp = 1, withoutReplace = false) {
    const lookup = [
      { value: 1, symbol: "" },
      { value: 1e3, symbol: "k" },
      { value: 1e6, symbol: "M" },
      { value: 1e9, symbol: "G" },
      { value: 1e12, symbol: "T" },
      { value: 1e15, symbol: "P" },
      { value: 1e18, symbol: "E" },
    ];
    const rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
    const item = lookup
      .slice()
      .reverse()
      .find(function (item) {
        return num >= item.value;
      });

    const shortItem = item
      ? withoutReplace
        ? (num / item.value).toFixed(dp).replace(".00", "")
        : (num / item.value).toFixed(dp).replace(rx, "$1")
      : "0";

    return item ? shortItem + item.symbol : "0";
  }

  static longNumber(str: string) {
    if (!str) return 0;
    const lookup = [
      { value: 1e3, symbol: "k" },
      { value: 1e6, symbol: "M" },
      { value: 1e9, symbol: "G" },
      { value: 1e12, symbol: "T" },
      { value: 1e15, symbol: "P" },
      { value: 1e18, symbol: "E" },
    ];

    const item = lookup
      .slice()
      .reverse()
      .find(function (item) {
        return str.includes(item.symbol);
      });

    const numberInStrOnly = item ? str?.replace(item.symbol, "") : str;

    const numberInStryOnlyToNumber = isNaN(numberInStrOnly as unknown as number)
      ? 0
      : Number(numberInStrOnly);

    return item
      ? numberInStryOnlyToNumber * item.value
      : numberInStryOnlyToNumber;
  }

  static humanFileSize(size: number) {
    const i = size == 0 ? 0 : Math.floor(Math.log(size) / Math.log(1024));
    return (
      (size / Math.pow(1024, i)).toFixed(2) +
      " " +
      ["B", "kB", "MB", "GB", "TB"][i]
    );
  }
}
