import React from 'react'
const Header = ({course}) => <h1>{course}</h1>

const Content = ({parts}) => {

  return (
    <div>
      {parts.map(part => (
        <div key={part.id}>
          {part.name} {part.exercises}
        </div>
      ))}
    </div>
  )
}
const Total=({parts})=>{
  const total=parts.reduce(
    (sum,part)=>sum+part.exercises,0
  )
  return(
      <p><strong>total of {total} exercises</strong></p>
  )

}

const Course=({courses})=>{
  return (
    <div>
      {courses.map(course=>(
        <div key={course.id}>
          <Header course={course.name} />
          <Content parts={course.parts} />
          <Total parts={course.parts} />
        </div>
      )

      )}
    </div>
  )
}  
export default Course