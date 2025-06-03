import { useState } from 'react'
const Header=({text}) => {
return (
    <h1>{text}</h1>
  )
}

const Button=({onClick, text}) => <button onClick={onClick}>{text}</button>

const StatisticLine=({text, value}) => {
  return(
 <tr>
    <td>{text}</td>
    <td>{value}</td>
  </tr>
  )
  
}

const Statistics=(props)=>{
  const total=props.good+props.neutral+props.bad
  const average=(props.good-props.bad)/total
  const positivePer=props.good/total*100
  if(total===0){
    return <p>No feedback given</p>;
  }

  return (
    <div>
    <table>
      <tbody>
        <StatisticLine text="good" value={props.good} />
        <StatisticLine text="neutral" value={props.neutral} />
        <StatisticLine text="bad" value={props.bad} />
        <StatisticLine text="all" value={total} />
        <StatisticLine text="average" value={average} />
        <StatisticLine text="positive" value={`${positivePer}%`} />
      </tbody>
    </table>
     
    </div>
  )
}

const App = () => {
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  const handleGoodClick=() => setGood(good + 1)
  const handleNeutralClick=() => setNeutral(neutral + 1)
  const handleBadClick=() => setBad(bad + 1)
  


  return (
    <div>
    <Header text="give feedback" />
    <Button onClick={handleGoodClick} text="good" />
    <Button onClick={handleNeutralClick} text={"neutral"} />
    <Button onClick={handleBadClick} text="bad" />
    <Header text='Statistics' />
    <Statistics good={good} neutral={neutral} bad={bad} />

    </div>
  )
}


export default App
