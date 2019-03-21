export interface Book {
  id: number;
  isbn: string;
  title: string;
  subtitle?: string;
  description?: string;
  author: BookAuthor;
  publisher: BookPublisher;
  published: Date;
  pages: number;
  website: string;
  ratings?: BookRating[];
}

export interface BookAuthor {
  name: string;
  birthDate?: Date;
  mostPopularBookIds?: string[];
  publishers?: BookPublisher[];
}

export interface BookPublisher {
  name: string;
}

export interface BookRating {
  rating: number;
  comments?: string;
}

export interface BookLibrary {
  libraryName: string;
  books: Book[];
}

export interface LibraryInfo {
  sourceLibraryName: string;
  collections: {
    favoriteBooks: Book[];
    leastFavoriteBooks: Book[];
  };
}

// Credit to https://gist.github.com/nanotaboada/6396437 for sample book data

const authors: BookAuthor[] = [
  {
    name: "Marijn Haverbeke"
  },
  {
    name: "Addy Osmani",
    birthDate: new Date("1970-05-20T00:00:00.000Z")
  },
  {
    name: "Axel Rauschmayer",
    birthDate: new Date("1997-04-29T00:00:00.000Z")
  },
  {
    name: "Eric Elliott",
    birthDate: new Date("1998-05-29T00:00:00.000Z")
  }
];

const publishers: BookPublisher[] = [
  {
    name: "No Starch Press"
  },
  {
    name: "O'Reilly Media"
  }
];

export const $LIBRARY: BookLibrary = {
  libraryName: "Sample Books",
  books: [
    {
      "id": 0,
      "isbn": "9781593275846",
      "title": "Eloquent JavaScript, Second Edition",
      "subtitle": "A Modern Introduction to Programming",
      "author": authors[0],
      "published": new Date("2014-12-14T00:00:00.000Z"),
      "publisher": publishers[0],
      "pages": 472,
      "description": "JavaScript lies at the heart of almost every modern web application, from social apps to the newest browser-based games. Though simple for beginners to pick up and play with, JavaScript is a flexible, complex language that you can use to build full-scale applications.",
      "website": "http://eloquentjavascript.net/",
      "ratings": [
        { "rating": 4, "comments": "Pretty good" },
        { "rating": 5, "comments": "Really good" },
        { "rating": 1, "comments": "Total crap" },
        { "rating": 3 }
      ]
    },
    {
      "id": 1,
      "isbn": "9781449331818",
      "title": "Learning JavaScript Design Patterns",
      "subtitle": "A JavaScript and jQuery Developer's Guide",
      "author": authors[1],
      "published": new Date("2012-07-01T00:00:00.000Z"),
      "publisher": publishers[1],
      "pages": 254,
      "description": "With Learning JavaScript Design Patterns, you'll learn how to write beautiful, structured, and maintainable JavaScript by applying classical and modern design patterns to the language. If you want to keep your code efficient, more manageable, and up-to-date with the latest best practices, this book is for you.",
      "website": "http://www.addyosmani.com/resources/essentialjsdesignpatterns/book/"
    },
    {
      "id": 2,
      "isbn": "9781449365035",
      "title": "Speaking JavaScript",
      "subtitle": "An In-Depth Guide for Programmers",
      "author": authors[2],
      "published": new Date("2014-02-01T00:00:00.000Z"),
      "publisher": publishers[1],
      "pages": 460,
      "description": "Like it or not, JavaScript is everywhere these days-from browser to server to mobile-and now you, too, need to learn the language or dive deeper than you have. This concise book guides you into and through JavaScript, written by a veteran programmer who once found himself in the same position.",
      "website": "http://speakingjs.com/",
      "ratings": [
        { "rating": 4, "comments": "Not bad" }
      ]
    },
    {
      "id": 3,
      "isbn": "9781491950296",
      "title": "Programming JavaScript Applications",
      "subtitle": "Robust Web Architecture with Node, HTML5, and Modern JS Libraries",
      "author": authors[3],
      "published": new Date("2014-07-01T00:00:00.000Z"),
      "publisher": publishers[1],
      "pages": 254,
      "description": "Take advantage of JavaScript's power to build robust web-scale or enterprise applications that are easy to extend and maintain. By applying the design patterns outlined in this practical book, experienced JavaScript developers will learn how to write flexible and resilient code that's easier-yes, easier-to work with as your code base grows.",
      "website": "http://chimera.labs.oreilly.com/books/1234000000262/index.html"
    }
  ]
};
