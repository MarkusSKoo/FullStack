const Courses = ({ courses }) => (
  <>
    {courses.map(course =>
      <Course key={course.id} course={course} />
    )}
  </>
)

const Course = ({ course }) => (
  <>
    <Header name={course.name} />
    <Content parts={course.parts} />
    <Total parts={course.parts} />
  </>
)

const Header = ({ name }) => <h2>{name}</h2>

const Content = ({ parts }) => 
    parts.map(part => 
      <Part key={part.id} part={part} />
    )

const Part = ({ part }) => <p>{part.name} {part.exercises}</p>

const Total = ({ parts }) => (
    <p>
      <b>Total of {parts.reduce((sum, part) => sum + part.exercises, 0)} exercises</b>
    </p>
  )

export default Courses