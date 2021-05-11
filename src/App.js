import './App.css';
import { useState, useEffect } from "react";
import Axios from "axios";

function App() {

  const [name, setName] = useState('')
  const [number, setNumber] = useState(0)
  const [listOfFriends, setListOfFriends] = useState([])

  const addFriend = () => {
    Axios.post('https://ak-contacts-manager.herokuapp.com/addFriend', { 
      name: name, 
      number: number
    }).then( (response) => {
      setListOfFriends([...listOfFriends, {_id: response.data._id, name: name, number: number}])
    })
  }

  const updateFriend = (id) => {
    const newNumber = prompt('Enter new number: ');

    Axios.put("https://ak-contacts-manager.herokuapp.com/update", {
      newNumber: newNumber,
      id: id,
    }).then( () => {
      setListOfFriends(listOfFriends.map( (val) => {
        return val._id == id ? {_id: id, name: val.name, number: newNumber} : val;
      }))
    })

  }

  const deleteFriend = (id) => {
    Axios.delete(`https://ak-contacts-manager.herokuapp.com/delete/${id}`).then( () => {
      setListOfFriends(listOfFriends.filter( (val) => {
        return val._id != id;
      }))
    })
  }

  useEffect( () => {
    Axios.get('https://ak-contacts-manager.herokuapp.com/read')
    .then( (response) => {
      setListOfFriends(response.data)
    }).catch( () => {
      console.log("ERROR")
    })

  }, [])

  return (
    <div className="App">

      <div className="inputs">
      <input 
        type="text" 
        placeholder="Contact name..." 
        required 
        onChange = { (e) => {
          setName(e.target.value)
        }}
      />
      <input 
        type="number" 
        placeholder="Contact number..." 
        required
        onChange = { (e) => {
          setNumber(e.target.value)
        }}  
      />

      <button onClick={addFriend}>Add Contact</button>

      </div>

      <div className="listOfFriends">
      {listOfFriends.map( (val) => {
        return (
          <div className="friendContainer">
            <div className="friend"> 
              <h3>Name: {val.name}</h3>  
              <h3>Number: {val.number}</h3>
            </div>
            <button onClick={ () => {updateFriend(val._id)} }>Update</button>
            <button id="removeBorder" onClick={ () => {deleteFriend(val._id)}}>X</button>
          </div>
        )
      })}
      </div>
      
    </div>
  );
}

export default App;
