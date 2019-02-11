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
      "$booksWithRatings": "$books:filter($:prop(ratings) != $null && $:prop(ratings):count > 0))",
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
          $f("and",
            $f("compare", $f("prop", "ratings"), "neq", $f("var", "$null")),
            $f("compare", $fx("count", $f("prop", "ratings")), "gt", 0)
          ))
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
