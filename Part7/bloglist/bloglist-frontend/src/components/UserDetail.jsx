import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
const UserDetail=()=>{
    const {id}=useParams()
    const user=useSelector((state)=>state.users.find((u)=>u.id===id))

    if(!user) return <p>Loading user...</p>
    return (
        <div>
            <h2>{user.username}</h2>
            <h4>Added blogs</h4>
            <ul>
                {user.blogs.map((blog)=>(
                    <li key={blog.id}>{blog.title}</li>
                ))}
            </ul>

        </div>
    )
}
export default UserDetail