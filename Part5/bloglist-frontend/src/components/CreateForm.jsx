const CreateForm=({title,author,url,handleNewBlog,setAuthor,setTitle,setUrl})=>{
    return (
        <div>
            <h3>Create new</h3>
            <form onSubmit={handleNewBlog}>
                title:
                <input 
                    type='text'
                    value={title}
                    name='title'
                    onChange={({target})=>setTitle(target.value)}
                />
                <br/>
                author:
                <input 
                    type='text'
                    value={author}
                    name='author'
                    onChange={({target})=>setAuthor(target.value)}
                />
                <br/>
                url:
                <input 
                    type='text'
                    value={url}
                    name='url'
                    onChange={({target})=>setUrl(target.value)}
                />
    
                <br/>
                <button type="submit">Create</button>
            </form>
        </div>
    )
    
}

export default CreateForm