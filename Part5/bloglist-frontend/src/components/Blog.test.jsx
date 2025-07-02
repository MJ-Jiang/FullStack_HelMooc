import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'
import { expect } from 'vitest'
test('renders title and author, but not url or likes by default',()=>{
    const blog={
        title:'Component testing is done with react-testing-library',
        author:'Test-author',
        url:'http://www.com',
        likes:5
    }
    render(<Blog blog={blog} />)
    screen.debug()
    const titleElement = screen.getByText(/Component testing is done with react-testing-library/)
    const authorElement = screen.getByText(/Test-author/)
    expect(titleElement).toBeDefined()
    expect(authorElement).toBeDefined()

    const url=screen.queryByText('http://www.com')
    expect(url).toBeNull()
    const likes=screen.queryByText(/likes/i)
    expect(likes).toBeNull()
})
