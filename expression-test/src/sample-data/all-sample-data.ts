import { sampleBookLibrary } from "./books";
import { $f, $fx, $withVars } from "@mindsung/expression";

export const allSampleData = {
  bookLibrary: sampleBookLibrary
};

export function foo() {
  const template = {
    "$books": "$:prop(books)",
    "somethingAboutBooks": {
      "$booksWithRatings": "$books:filter($:prop(ratings) != $null && $:prop(ratings):count > 0))",
      // Above equivalent to:
      // "$booksWithRatings": "$books:filter($:prop(ratings):neq($null):and($:prop(ratings):count:gt(0)))",
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
    $withVars(
      { name: "$books", value: $f("prop", "books") }
    ).$f("object", [
      { key: "somethingAboutBooks", value: $withVars(
        { name: "$booksWithRatings", value: $fx("filter", $f("var", "$books"),
          $fx("and",
            $fx("neq", $fx("prop", $f("var", "$"), "ratings"), $f("var", "$null")),
            $fx("gt", $fx("count", $fx("prop", $f("var", "$"), "ratings")), 0)
          ))
        },
        { name: "$booksAndRatings", value: $fx("map", $f("var", "$booksWithRatings"), $withVars(
            { name: "$book", value: $f("var", "$") }
          ).$f("object",
          [
            { key: "book", value: $f("var", "$") },
            { key: "avgRating", value: $fx("avg", $f("prop", "ratings"), $f("prop", "rating")) }
          ]))
        }
      ).$f("object", [
        { key: "bestToWorst", value: $fx("sort", $f("var", "$booksAndRatings"),
          $f("prop", "avgRating"), "desc") },
        { key: "worstToBest", value: $fx("sort", $f("var", "$booksAndRatings"),
          $f("prop", "avgRating")) }
      ])
    }])
  );

  return expr.evaluate();
}
