import { useState } from 'react'
const Header = (props) => {
  console.log(props)
  return <h1>{props.course.name}</h1>
}
const Content = (props) => {
  return (
    <div>
     <p>{props.course.parts[0].name} {props.course.parts[0].exercises}</p>
<p>{props.course.parts[1].name} {props.course.parts[1].exercises}</p>
<p>{props.course.parts[2].name} {props.course.parts[2].exercises}</p>
    </div>
  )
}

const Total = (props) =>{
  console.log(props)
  const total=props.course.parts[0].exercises+props.course.parts[1].exercises+props.course.parts[2].exercises
  return (
    <div>
<p>Total number of exercises is {total}</p>

    </div>
  )
}
const App = () => {
  const course = {
    name: 'Half Stack application development',
    parts: [
      {
        name: 'Fundamentals of React',
        exercises: 10
      },
      {
        name: 'Using props to pass data',
        exercises: 7
      },
      {
        name: 'State of a component',
        exercises: 14
      }
    ]
  }

  return (
    <div>
     <Header course={course} />
      <Content course={course} />
      <Total course={course} />
    </div>
  )
}

export default App