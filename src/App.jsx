import './App.css'

function App() {
  const video = '../background-video.mp4'
  
  return (
    <>
    <div className="main">
      
    <h1>Steven Fernandez</h1>
    </div>
    {
      video 
      ? <div>
      <video className='background'  autoPlay loop >
        <source src={video} type='video/mp4' />
      </video>
      <div className="background-opacity"></div>
    </div>
    : <h1>Loading</h1> 
    }
    
    </>
  )
}

export default App
