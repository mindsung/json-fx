import { sampleBookLibrary } from "./books";
import { createExpression, createExpressionWithInput, ExpressionVariable, withScopeVariables, Expression } from "@mindsung/expression";

export const allSampleData = {
  bookLibrary: sampleBookLibrary
};

export const $f = (...params: any[]) => createExpression(params[0],
  params.length > 1 ? params.slice(1) : []);
export const $fx = (...params: any[]) => createExpressionWithInput(params[0],
  params.length > 1 ? params[1] : null,
  params.length > 2 ? params.slice(2) : []);
export const $withVars = (vars: ExpressionVariable[], expr: Expression<any>) => withScopeVariables(vars, expr);

export function foo() {
  const template = {
    "$books": "$:prop(books)",
    "somethingAboutBooks": {
      "$booksWithRatings": "$books:filter($:prop(ratings) != $null && $$:prop(ratings):count > 0))",
      "$booksAndRatings": {
        "$booksWithRatings:map": {
          "@0": {
            ":object": {
              "book": "$",
              "avgRating": "$:prop(ratings):avg(:prop(rating))"
            }
          }
        }
      },
      "bestToWorst": "$booksAndRatings:sort($:prop(avgRating), desc)",
      "worstToBest": "$booksAndRatings:sort($:prop(avgRating))"
    }
  }

  const expr = $fx("_transform", allSampleData.bookLibrary,
    $withVars([
      { name: "$books", value: $f("prop", "books") }
    ], $f("object", [
      { key: "somethingAboutBooks", value: $withVars([
        { name: "$booksWithRatings", value: $fx("filter", $f("var", "$books"),
          $withVars([
            // PROBLEM: This evaluates to null because inputs' scope is set to the owner's parent, not the owner.
            // (If set to the owner, infinite recursion occurs resulting in a stack overflow.)
            // So for the first level under an item-based array operation, each of which gets a new scope representing an item,
            // it will resolve to null, not the item.
            { name: "$book", value: $f("var", "$") }
          ],
          $fx("and",
            $fx("neq", $fx("prop", $f("var", "$"), "ratings"), $f("var", "$null")),
            // PROBLEM: with nested, single operation logic or math expressions (or any that follow that pattern),
            // each level deeper requires a deeper level of the input variable: $, $$, $$$, etc.
            $fx("gt", $fx("count", $fx("prop", $f("var", "$$"), "ratings")), 0)
          )))
        },
        { name: "$booksAndRatings", value: $fx("map", $f("var", "$booksWithRatings"), $f("object",
          [
            { key: "book", value: $f("var", "$") },
            { key: "avgRating", value: $fx("avg", $f("prop", "ratings"), $f("prop", "rating")) }
          ]))
        }
      ], $f("object", [
        { key: "bestToWorst", value: $fx("sort", $f("var", "$booksAndRatings"),
          $f("prop", "avgRating"), "desc") },
        { key: "worstToBest", value: $fx("sort", $f("var", "$booksAndRatings"),
          $f("prop", "avgRating")) }
      ]))
    }]))
  );

  return expr.evaluate();
}
