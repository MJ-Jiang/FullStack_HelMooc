import { useQuery } from "@apollo/client";
import { All_BOOKS,ME } from "../queries";
const Recommendation=({show})=>{
    const {data:meData,loading:meLoading}=useQuery(ME)
    const favGenre=meData?.me?.favouriteGenre
  ;

    const {data:booksData,loading:booksLoading}=useQuery(All_BOOKS,{
        variables: { genre: favGenre },
         skip: !favGenre,   
    })
        if(!show||!meData?.me) {
        return null
    }
    if(meLoading) {
        return <div>loading...</div>
    }

     console.log("favGenre:", favGenre, booksData)
  
    if(booksLoading) {
        return <div>loading...</div>
    }
    return(
        <div>
            <h2>recommendations</h2>
            <p>books in your favourite genre: <strong>{favGenre}</strong></p>
            <table>
                <tbody>
                    <tr>
                        <th>title</th>
                        <th>author</th>
                        <th>published</th>
                    </tr>
                    {booksData.allBooks.map((b) => (
                        <tr key={b.title}>
                            <td>{b.title}</td>
                            <td>{b.author.name}</td>
                            <td>{b.published}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Recommendation