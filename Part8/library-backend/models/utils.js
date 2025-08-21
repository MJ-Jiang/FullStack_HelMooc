import { GraphQLError } from "graphql"

const throwBadUserInputError = (error, invalidArgs) => {
  if(error?.name==='ValidationError'){
    const details=Object.values(error.errors).map(e=>({
      field:e.path,//// which field failed (e.g. "name", "title")
      message:e.message,// human message
    }))
    throw new GraphQLError('Validation error', {
      extensions: {
        code: 'BAD_USER_INPUT',
        invalidArgs,
        details,
      },
    })
  }
  if(error?.name==='MongoServerError' && error.code===11000){
    throw new GraphQLError('Duplicate key error', {
      extensions: { 
        code: 'BAD_USER_INPUT',
        invalidArgs,
        details: error.keyValue,
      },
    })
  }
  throw new GraphQLError('Saving book failed', {
    extensions: {
      code: 'BAD_USER_INPUT',
      invalidArgs,
      error: { message: error.message }
    },
  })
}
export default throwBadUserInputError