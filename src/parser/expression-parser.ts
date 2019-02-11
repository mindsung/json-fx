import { isObjectLike as _isObjectLike } from "lodash";

export class ExpressionParser {
  propValueToLongForm(stringForm: string) {
    if (!stringForm.startsWith("$")) {
      throw new Error(`Invalid property value expression "${stringForm}": variable name expected.`);
    }
    const iPath = stringForm.indexOf(".");
    return {
      "$$": iPath > 0 ? stringForm.substring(0, iPath) : stringForm,
      ":property": {
        "@path": iPath > 0 ? stringForm.substring(iPath + 1) : ""
      }
    };
  }

  parseExpressionParams(params: any) {
  }

  tryParseInputAndExpressionKey(parent: object, key: string, value: any) {
    const iXpr = key.indexOf(":");
    if (iXpr < 0) {
      return null;
    }
    if (iXpr === 0) {
      if (parent["$$"] === undefined) {
        parent["$$"] = "$$";
      }
      return value;
    }
    delete parent[key];
    parent["$$"] = this.propValueToLongForm(key.substring(0, iXpr));
    parent[key.substring(iXpr)] = value;
    return value;
  }

  stringValueToLongForm(stringForm: string) {
    return this.propValueToLongForm(stringForm);
  }

  expandExpression(xpr: any) {
    if (typeof xpr === "string") {
      return this.stringValueToLongForm(xpr);
    }
    let xprParams: any = null;
    // TODO: check for constant value type.
    const out: any = Object.assign({}, xpr);
    Object.keys(out).forEach(key => {
      const p = this.tryParseInputAndExpressionKey(out, key, out[key]);
      if (p != null) {
        if (xprParams != null) {
          throw new Error("Only one expression type may be identified in an expression block.");
        }
        xprParams = p;
      }
      else if (xprParams != null && !key.startsWith("$")) {
        throw new Error(`Invalid identifier ${key}: Only an expression type and variables may be identified in an expression block.`);
      }
      else {
        out[key] = this.expandExpression(out[key]);
      }
    });
    return out;
  }
}
