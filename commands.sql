CREATE TABLE blogs(
  id SERIAL PRIMARY KEY,
  author text,
  url text not NULL,
  title text not NULL,
  likes INTEGER DEFAULT 0
);

INSERT INTO
  blogs (author, url, title)
values
  (
    'Dan Abramov',
    'https://overreacted.io/writing-resilient-components/',
    'Writing Resilient Components'
  );
INSERT INTO
  blogs (author, url, title)
values
  (
    'Martin Fowler',
    'https://martinfowler.com/articles/is-quality-worth-cost.html',
    'Is High Quality Software Worth The Cost?'
  );