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
export const All_BOOKS = gql`
 query{
    allBooks{   
        title   
        author
        published
    }
 }
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
    title
    author
    published
    genres
  }   
}`

//AddBook is the operation name, for debugging/devtools/logs
//addBook is the mutation field name, used in the useMutation hook
//{} returns the fields we want to get back from the mutation