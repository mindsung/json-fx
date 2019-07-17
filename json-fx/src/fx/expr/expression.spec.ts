import { describe, it } from "mocha";
import { assert } from "chai";
import { AnyFn, FxExpressionDefinition } from "../../lexer/model/fx-definition";

export class ExpressionTester {

  private readonly expressions: { [index: string]: FxExpressionDefinition };
  private readonly set: string;

  constructor(set: string, expressions: ReadonlyArray<FxExpressionDefinition>) {
    this.set = set;
    this.expressions = expressions.reduce((obj, item) => {
      obj[item.name] = item;
      return obj;
    }, {});
  }

  public run(fn: AnyFn): void {
    describe(`Expressions <${this.set}>`, () => {
      fn();

      it("[Tests all Fx in set]", () => {
        this.assertAllTested();
      });
    });
  }

  public test(name: string, tester: (fn: AnyFn) => void): void {
    const definition = this.expressions[name];

    if (definition) {
      delete this.expressions[name];

      it(`Evaluates <${name}>`, () => {
        tester(definition.evaluate);
      });
    }
  }

  private assertAllTested(): void {
    const keysRemaining = Object.keys(this.expressions);
    assert(keysRemaining.length == 0, "These Fx are not being tested: " + keysRemaining.join(", "));
  }
}

/*
import { after, describe, Func, it } from "mocha";
import { assert } from "chai";

import { Expressions } from "./expr";

const Fx = Expressions.map(expr => expr.name);

function compile(expr: string): any {
  const fx = new JsonFx(Expressions);
  return fx.compile(expr).evaluate();
}

function itEvaluates(name: string, fn: Func): void {
  // Remove tested Fx from master list,
  // so after completion we know which Fx did not get tested

  const index = Fx.indexOf(name);
  const testName = `Evaluates "${name}"`;

  if (index != -1) {
    Fx.splice(index, 1);
    it(testName, fn);
  } else {
    it(testName, function () {
      assert.fail(null, null, `Expression "${name}" either is not a expr expression or has already been tested`);
    });
  }
}

after("Tested all Fx", function () {
  assert.deepEqual(Fx, [], "Not all Fx have been tested");
});

describe("Core Fx", function () {

  itEvaluates("add", function () {
    let actual = compile("add(2, 4)");
    assert.closeTo(actual, 6, 0.0001);

    actual = compile("8 + 16");
    assert.closeTo(actual, 24, 0.0001);
  });

  itEvaluates("sub", function () {
    let actual = compile("sub(2, 4)");
    assert.closeTo(actual, -2, 0.0001);

    actual = compile("8 - 16");
    assert.closeTo(actual, -8, 0.0001);
  });

  itEvaluates("mul", function () {
    let actual = compile("mul(2, 4)");
    assert.closeTo(actual, 8, 0.0001);

    actual = compile("8 * 16");
    assert.closeTo(actual, 128, 0.0001);
  });

  itEvaluates("div", function () {
    let actual = compile("div(2, 4)");
    assert.closeTo(actual, 0.5, 0.0001);

    actual = compile("8 / 16");
    assert.closeTo(actual, 0.5, 0.0001);
  });

  itEvaluates("mod", function () {
    let actual = compile("mod(9, 4)");
    assert.closeTo(actual, 1, 0.0001);

    actual = compile("9 % 4");
    assert.closeTo(actual, 1, 0.0001);
  });

  itEvaluates("pow", function () {
    let actual = compile("pow(2, 4)");
    assert.closeTo(actual, 16, 0.0001);

    actual = compile("2 ** 4");
    assert.closeTo(actual, 16, 0.0001);
  });

  itEvaluates("item", function () {
    const actual = compile("item([2, 4, 8], 0)");
    assert.equal(actual, 2);
  });

  itEvaluates("map", function () {
    const actual = compile("map([2, 4, 8], $i => $i - 1)");
    assert.deepEqual(actual, [1, 3, 7]);
  });

  itEvaluates("sort", function () {
    let actual = compile("sort([`bb`, `aa`, `cc`])");
    assert.deepEqual(actual, ["aa", "bb", "cc"]);

    actual = compile("sort([`bb`, `a`, `ccc`], $ => $:length)");
    assert.deepEqual(actual, ["a", "bb", "ccc"]);
  });

  itEvaluates("filter", function () {
    const actual = compile("filter([1, 2, 3, 4], $ => $ % 2 == 0)");
    assert.deepEqual(actual, [2, 4]);
  });

  itEvaluates("find", function () {
    const actual = compile("find([1, 2, 3, 4], $ => $ % 2 == 0)");
    assert.equal(actual, 2);
  });

  itEvaluates("concat", function () {
    const actual = compile("concat([1, 2], [3, 4])");
    assert.deepEqual(actual, [1, 2, 3, 4]);
  });

  itEvaluates("min", function () {
    const actual = compile("min([1, 2, 3, 4])");
    assert.equal(actual, 1);
  });

  itEvaluates("max", function () {
    const actual = compile("max([1, 2, 3, 4])");
    assert.equal(actual, 4);
  });

  itEvaluates("avg", function () {
    const actual = compile("avg([1, 2, 3, 4])");
    assert.equal(actual, 2.5);
  });

  itEvaluates("withMin", function () {
    const actual = compile("withMin([1, 2, 3, 4])");
    assert.equal(actual, 1);
  });

  itEvaluates("withMax", function () {
    const actual = compile("withMax([1, 2, 3, 4])");
    assert.equal(actual, 4);
  });

  itEvaluates("length", function () {
    const actual = compile("length([1, 2, 3, 4])");
    assert.equal(actual, 4);
  });

  itEvaluates("eq", function () {
    assert.isTrue(compile("eq(2, 2)"));
    assert.isFalse(compile("eq(2, 3)"));

    assert.isTrue(compile("eq(`aaa`, `aaa`)"));
    assert.isFalse(compile("eq(`aaa`, `bbb`)"));

    assert.isTrue(compile("2 == 2"));
    assert.isFalse(compile("2 == 3"));

    assert.isTrue(compile("`aaa` == `aaa`"));
    assert.isFalse(compile("`aaa` == `bbb`"));
  });

  itEvaluates("neq", function () {
    assert.isFalse(compile("neq(2, 2)"));
    assert.isTrue(compile("neq(2, 3)"));

    assert.isFalse(compile("neq(`aaa`, `aaa`)"));
    assert.isTrue(compile("neq(`aaa`, `bbb`)"));

    assert.isFalse(compile("2 != 2"));
    assert.isTrue(compile("2 != 3"));

    assert.isFalse(compile("`aaa` != `aaa`"));
    assert.isTrue(compile("`aaa` != `bbb`"));
  });

  itEvaluates("gt", function () {
    assert.isFalse(compile("gt(2, 3)"));
    assert.isTrue(compile("gt(3, 2)"));

    assert.isFalse(compile("gt(`aaa`, `bbb`)"));
    assert.isTrue(compile("gt(`bbb`, `aaa`)"));

    assert.isFalse(compile("2 > 3"));
    assert.isTrue(compile("3 > 2"));

    assert.isFalse(compile("`aaa` > `bbb`"));
    assert.isTrue(compile("`bbb` > `aaa`"));
  });

  itEvaluates("gte", function () {
    assert.isFalse(compile("gte(2, 3)"));
    assert.isTrue(compile("gte(2, 2)"));

    assert.isFalse(compile("gte(`aaa`, `bbb`)"));
    assert.isTrue(compile("gte(`aaa`, `aaa`)"));

    assert.isFalse(compile("2 >= 3"));
    assert.isTrue(compile("2 >= 2"));

    assert.isFalse(compile("`aaa` >= `bbb`"));
    assert.isTrue(compile("`aaa` >= `aaa`"));
  });

  itEvaluates("lt", function () {
    assert.isTrue(compile("lt(2, 3)"));
    assert.isFalse(compile("lt(3, 2)"));

    assert.isTrue(compile("lt(`aaa`, `bbb`)"));
    assert.isFalse(compile("lt(`bbb`, `aaa`)"));

    assert.isTrue(compile("2 < 3"));
    assert.isFalse(compile("3 < 2"));

    assert.isTrue(compile("`aaa` < `bbb`"));
    assert.isFalse(compile("`bbb` < `aaa`"));
  });

  itEvaluates("lte", function () {
    assert.isTrue(compile("lte(2, 2)"));
    assert.isFalse(compile("lte(3, 2)"));

    assert.isTrue(compile("lte(`aaa`, `aaa`)"));
    assert.isFalse(compile("lte(`bbb`, `aaa`)"));

    assert.isTrue(compile("2 <= 2"));
    assert.isFalse(compile("3 <= 2"));

    assert.isTrue(compile("`aaa` <= `aaa`"));
    assert.isFalse(compile("`bbb` <= `aaa`"));
  });

  itEvaluates("ifelse", function () {
    let actual = compile("ifelse(1, `foo`, `bar`)");
    assert.deepEqual(actual, "foo");

    actual = compile("ifelse(0, `foo`, `bar`)");
    assert.deepEqual(actual, "bar");
  });

  itEvaluates("if", function () {
    assert.isTrue(compile("if(`aaa`)"));
    assert.isTrue(compile("if(1)"));
    assert.isTrue(compile("if(1 == 1)"));

    assert.isFalse(compile("if(``)"));
    assert.isFalse(compile("if(0)"));
    assert.isFalse(compile("if(1 != 1)"));
  });

  itEvaluates("else", function () {
    assert.equal(compile("else(`aaa`, `bbb`)"), "aaa");
    assert.equal(compile("else(1, `bbb`)"), 1);
    assert.equal(compile("else(1 == 1, `bbb`)"), true);

    assert.equal(compile("else(``, `bbb`)"), "bbb");
    assert.equal(compile("else(0, `bbb`)"), "bbb");
    assert.equal(compile("else(1 != 1, `bbb`)"), "bbb");
  });

  itEvaluates("then", function () {
    assert.equal(compile("then(`aaa`, `bbb`)"), "bbb");
    assert.equal(compile("then(1, `bbb`)"), "bbb");
    assert.equal(compile("then(1 == 1, `bbb`)"), "bbb");

    assert.equal(compile("then(``, `bbb`)"), "");
    assert.equal(compile("then(0, `bbb`)"), 0);
    assert.equal(compile("then(1 != 1, `bbb`)"), false);
  });

  itEvaluates("for", function () {
    const actual = compile("for(0, 5, $i => $i)");
    assert.deepEqual(actual, [0, 1, 2, 3, 4]);
  });

  itEvaluates("or", function () {
    assert.equal(compile("or(0, 1)"), 1);
    assert.equal(compile("or(1, 0)"), 1);
    assert.equal(compile("or(0, 0)"), 0);
  });

  itEvaluates("and", function () {
    assert.equal(compile("and(0, 1)"), 0);
    assert.equal(compile("and(1, 0)"), 0);
    assert.equal(compile("and(1, 1)"), 1);
  });

  itEvaluates("not", function () {
    assert.isFalse(compile("not(1)"));
    assert.isTrue(compile("not(0)"));
  });

  itEvaluates("notnot", function () {
    assert.isTrue(compile("notnot(1)"));
    assert.isFalse(compile("notnot(0)"));
  });

  itEvaluates("substr", function () {
    const actual = compile("substr(`abcdef`, 1, 3)");
    assert.equal(actual, "bcd");
  });

  itEvaluates("split", function () {
    const actual = compile("split(`aaa,bbb,ccc`, `,`)");
    assert.deepEqual(actual, ["aaa", "bbb", "ccc"]);
  });

  itEvaluates("uppercase", function () {
    const actual = compile("uppercase(`foo bar`)");
    assert.equal(actual, "FOO BAR");
  });

  itEvaluates("lowercase", function () {
    const actual = compile("lowercase(`FOO BAR`)");
    assert.equal(actual, "foo bar");
  });

  itEvaluates("titlecase", function () {
    assert.equal(compile("titlecase(`theQuick_brown fox`)"), "The Quick Brown Fox");
  });

  itEvaluates("snakecase", function () {
    assert.equal(compile("snakecase(`theQuick_brown fox`)"), "the_quick_brown_fox");
  });

  itEvaluates("camelcase", function () {
    assert.equal(compile("camelcase(`theQuick_brown fox`)"), "theQuickBrownFox");
  });

  itEvaluates("reverse", function () {
    assert.equal(compile("reverse(`theQuick_brown fox`)"), "xof nworb_kciuQeht");
  });

  itEvaluates("notnull", function () {
    assert.throw(compile.bind(null, "notnull(null)"));
    assert.doesNotThrow(compile.bind(null, "notnull(1)"));
  });
});
*/
