const _=require('lodash')
const dummy = (blogs) => {
  return 1
}
const totalLikes=(blogs)=>{
    return blogs.reduce((sum,blog)=>sum+blog.likes,0)
}
const favoriteBlog=(blogs)=>{
    if (blogs.length===0){
        return null}
    return blogs.reduce((max,blog)=>{
        return blog.likes>max.likes?blog:max
    },blogs[0])
}
const mostBlogs=(blogs)=>{
    if (blogs.length===0) return null
    const groupedByAuthor=_.groupBy(blogs,'author')
    //{"Alice": [{...}, {...}],"Bob": [{...}],}
    const authorWithCount=_.map(groupedByAuthor,(posts,author)=>({
        author,
        blogs:posts.length
    }))
    //for each author, it creates a new object:author is the key, blogs numbers is the value
    //Each posts is the array of that author's blog posts
    return _.maxBy(authorWithCount,'blogs')
}
const mostLikes=(blogs)=>{
    if (blogs.length===0) return null
     const groupedByAuthor=_.groupBy(blogs,'author')
     const authorWithLikes=_.map(groupedByAuthor,(posts,author)=>({
        author,
        likes: _.sumBy(posts,'likes')
     }))
     return _.maxBy(authorWithLikes,'likes')

}
module.exports = {
  dummy,totalLikes,favoriteBlog,mostBlogs,mostLikes
}