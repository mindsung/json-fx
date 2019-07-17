export function polyfills(): void {
  if (!String.prototype.startsWith) {
    String.prototype.startsWith = function (search, pos): boolean {
      pos = !pos || pos < 0 ? 0 : +pos;
      return this.substring(pos, pos + search.length) == search;
    };
  }

  if (!String.prototype.endsWith) {
    String.prototype.endsWith = function (search, pos): boolean {
      if (pos == undefined || pos > this.length) {
        pos = this.length;
      }
      return this.substring(pos - search.length, pos) == search;
    };
  }
}
