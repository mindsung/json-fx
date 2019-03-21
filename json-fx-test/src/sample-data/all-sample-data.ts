import { sampleBookLibrary } from "./books";
import { ExpressionScope, ScopeVariable, ExpressionSet, ExpressionEvaluator, createExpressionConstant, createExpressionLambda } from "@mindsung/json-fx";
import { $BOOKS } from "./books-2";

const defaultParser = new ExpressionSet();

export function $expr(exprKey: string, params?: ExpressionScope[], vars?: ScopeVariable[]) {
  return defaultParser.createExpressionScope(exprKey).withParams(params).withVars(vars);
}

export function $const(value: any) {
  return createExpressionConstant(value);
}

export function $lambda(paramNames: string[], expr: ExpressionScope) {
  return createExpressionLambda(paramNames, expr);
}

export function $eval($: any, expr: ExpressionScope) {
  return new ExpressionEvaluator(expr).evaluate([ { name: "$", expr: $const($) }]);
}

export const allSampleData = {
  bookLibrary: sampleBookLibrary,
  biggerLibrary: {
    libraryName: "More Books",
    books: $BOOKS
  }
};

// export function foo() {
//   const template = {
//     "$books": "$.books",
//     "somethingAboutBooks": {
//       "$booksWithRatings": "$books:filter($.ratings != $null && $.ratings:count > 0)",
//       // Above equivalent to:
//       // "$booksWithRatings": "$books:filter($.ratings:neq($null):and($.ratings:count:gt(0)))",
//       "$booksAndRatings": {
//         // Need a clean intuitive abbreviated syntax for indicating an array mapping,
//         // e.g. something that includes [*] somewhere?
//         "$booksWithRatings:map": {
//           "$": {
//             "book": "$.title",
//             "avgRating": "[$].ratings:avg([$].rating)"
//           }
//         }
//       },
//       "bestToWorst": "$booksAndRatings:sort($.avgRating, desc)",
//       "worstToBest": "$booksAndRatings:sort($.avgRating)"
//     }
//   };
//
//   const expr = $fx("_transform", allSampleData.bookLibrary,
//     $withVars(
//       { name: "$books", value: $f("prop", "books") }
//     )
//       .$f("object", {
//         key: "somethingAboutBooks",
//         value: $withVars({
//             name: "$booksWithRatings",
//             value: $fx("filter", $f("var", "$books"),
//               $fx("and",
//                 $fx("neq", $fx("prop", $f("var", "$"), "ratings"), $f("var", "$null")),
//                 $fx("gt", $fx("count", $fx("prop", $f("var", "$"), "ratings")), 0)
//               ))
//           }, {
//             name: "$booksAndRatings",
//             value: $fx("map", $f("var", "$booksWithRatings"),
//               $withVars(
//                 { name: "$book", value: $f("var", "$") }
//               )
//                 .$f("object",
//                   { key: "book", value: $f("var", "$") },
//                   { key: "avgRating", value: $fx("avg", $f("prop", "ratings"), $f("prop", "rating")) }
//                 )
//             )
//           }
//         )
//           .$f("object", {
//             key: "bestToWorst",
//             value: $fx("sort", $f("var", "$booksAndRatings"),
//               $f("prop", "avgRating"), "desc"
//             )
//           }, {
//             key: "worstToBest",
//             value: $fx("sort", $f("var", "$booksAndRatings"),
//               $f("prop", "avgRating"))
//           })
//       })
//   );
//
//   return expr.evaluate();
// }

// export function bar() {
//   return $eval(allSampleData.bookLibrary,
//     $expr("avg",
//       [
//         $expr("_prop", [$expr("_var", [$const("$")]), $const("books")]),
//         $expr("_prop", [$expr("_var", [$const("$")]), $const("id")])
//       ]
//     )
//   );
// }

// export function bar() {
//   return $eval(allSampleData.biggerLibrary,
//     $expr("map",
//       [
//         $expr("_prop", [$expr("_var", [$const("$")]), $const("books")]),
//         $expr("_prop", [$expr("_var", [$const("$")]), $const("title")])
//       ]
//     )
//   );

export function bar() {
  return new ExpressionEvaluator(
    $expr("filter",
      [
        $expr("_prop", [$expr("_var", [$const("$")]), $const("books")]),
        $expr("neq",
          [$expr("_var", [$const("$lang"), $expr("_varexpr", [$const("$")])]),
            $const("English")])
      ]
    )
  ).evaluate([
    {
      name: "$",
      expr: $const(allSampleData.biggerLibrary)
    },
    {
      name: "$lang",
      expr: $lambda(["@book"],
        $expr("_prop", [$expr("_var", [$const("@book")]), $const("language")]))
    }
  ]);
}
