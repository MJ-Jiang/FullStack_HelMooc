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
    const titleElement = screen.getByText(/Component testing is done with react-testing-library/)
    const authorElement = screen.getByText(/Test-author/)
    expect(titleElement).toBeDefined()
    expect(authorElement).toBeDefined()

    const url=screen.queryByText('http://www.com')
    expect(url).toBeNull()
    const likes=screen.queryByText(/likes/i)
    expect(likes).toBeNull()
})

test('renders url and likes after showing details',async()=>{
    const blog={
        title:'Component testing is done with react-testing-library',
        author:'Test-author',
        url:'http://www.com',
        likes:5
    }
    render(<Blog blog={blog}/>)
    const user=userEvent.setup()
    const button=screen.getByText('View')
    await user.click(button)
    expect(screen.getByText('http://www.com')).toBeDefined()
    expect(
    screen.getByText((content) => content.includes('likes') && content.includes('5'))
  ).toBeDefined()
})