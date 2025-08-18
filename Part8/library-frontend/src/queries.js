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
