import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'
import { expect } from 'vitest'
import Togglable from './Togglable'
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

describe('<Togglable />', () => {
  let container

  beforeEach(() => {
    container = render(
      <Togglable buttonLabel="show...">
        <div className="testDiv" >
          togglable content
        </div>
      </Togglable>
    ).container
  })

  test('renders its children', async () => {
    await screen.findAllByText('togglable content')
  })

  test('at start the children are not displayed', () => {
    const div = container.querySelector('.togglableContent')
    expect(div).toHaveStyle('display: none')
  })

  test('after clicking the button, children are displayed', async () => {
    const user = userEvent.setup()
    const button = screen.getByText('show...')
    await user.click(button)

    const div = container.querySelector('.togglableContent')
    expect(div).not.toHaveStyle('display: none')
  })
})