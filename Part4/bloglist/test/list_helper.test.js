
// process blog data, take plain JavaScript objects (blog lists) and verify that helper functions give the right output.
const { test, describe } = require('node:test')
const assert = require('node:assert')
const listHelper = require('../utils/list_helper')

describe('total likes', () => {
  const listWithOneBlog = [
    {
      _id: '5a422aa71b54a676234d17f8',
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
      likes: 5,
      __v: 0
    }
  ]

  test('when list has only one blog, equals the likes of that', () => {
    const result = listHelper.totalLikes(listWithOneBlog)
    assert.strictEqual(result, 5)
  })
  test('when list has mutiple blogs, sum likes',()=>{
    const listWithMultipleBlogs = [
        {likes:5},
        {likes:6},
        {likes:10}
        

    ]
    const result = listHelper.totalLikes(listWithMultipleBlogs)
    assert.strictEqual(result, 21)
  
    })
    test ('when list is empty, sum is zero',()=>{
        const emptyList = []
        const result = listHelper.totalLikes(emptyList)
        assert.strictEqual(result, 0)
    })
    test('find the favorite blog',()=>{
        const listWithMultipleBlogs=[
        {"title":"A","likes":5},
          {"title":"B","likes":6},
         {"title":"C","likes":10}
        ]
        const result=listHelper.favoriteBlog(listWithMultipleBlogs)
        assert.deepStrictEqual(result, {"title":"C","likes":10})
    })

   test('dummy returns one', () => {
    const blogs = []

    const result = listHelper.dummy(blogs)
    assert.strictEqual(result, 1)
 })
 test('return the author with most blogs',()=>{
    const blogs=[
        {"title":"blog1","author":"A","likes":5},
         {"title":"blog2","author":"A","likes":6},
          {"title":"blog3","author":"B","likes":1},
           {"title":"blog4","author":"C","likes":3}
    ]
    const result =listHelper.mostBlogs(blogs)
    assert.deepStrictEqual(result,{"author":"A",blogs:2})
 })
 test('return author with most likes',()=>{
     const blogs=[
        {"title":"blog1","author":"A","likes":5},
         {"title":"blog2","author":"A","likes":6},
          {"title":"blog3","author":"B","likes":1},
           {"title":"blog4","author":"C","likes":3}
    ]
    const result =listHelper.mostLikes(blogs)
    assert.deepStrictEqual(result,{"author":"A",'likes':11})
 })

})

