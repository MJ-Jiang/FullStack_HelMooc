import {gql} from '@apollo/client'
export const All_AUTHORS = gql`
 query{
  allAuthors{
    name
    born
    bookCount
  }
}
`
export const BOOK_DETAILS = gql`
  fragment bookDetails on Book {
    title
    author {
      name
      born
    }
    published
    genres
  }
`
export const All_BOOKS = gql`
  query allBooks($genre: String) {
    allBooks(genre: $genre) {
     ...bookDetails
    }
  }
  ${BOOK_DETAILS}
`

export const ADD_BOOK = gql`
 mutation AddBook(
    $title: String!
    $author: String!
    $published: Int!
    $genres: [String!]!
  ) {
  addBook(  
    title: $title,
    author: $author,
    published: $published,  
    genres: $genres
  ) {
    ...bookDetails
    }   
  }
  ${BOOK_DETAILS}`
//AddBook is the operation name, for debugging/devtools/logs, ($genre: String) means this query accepts a variable called $genre
//addBook is the mutation field name, used in the useMutation hook;(genre: $genre) means call the allBooks field and pass it the $genre variable we declared above.

//{title, author...} returns the fields we want to get back from the mutation
export const EDIT_AUTHOR=gql`
  mutation EditAuthor(
    $name: String!
    $setBornTo: Int!
  ) {
    editAuthor(
      name: $name,
      setBornTo: $setBornTo
    ) {
      name
      born
    }
  }
`
export const LOGIN = gql`
  mutation Login($username: String!, $password: String!) {  
    login(username: $username, password: $password) {
      value
    }
  }
`


export const ME= gql`
  query {
    me {    
      username
      favouriteGenre
    } 
  }
`


export const BOOK_ADDED = gql`
  subscription {
    bookAdded {
      ...bookDetails
    }
  }
  ${BOOK_DETAILS}
`
