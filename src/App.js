import { useState } from "react";

const initialItems = [
  { id: 1, description: "Passports", quantity: 2, packed: true },
  { id: 2, description: "Socks", quantity: 12, packed: true },
  { id: 3, description: "Charger", quantity: 1, packed: false },
];

export default function App() {
  return (
    <div className="app">
      <Logo />
      <Form />
      <PackingList />
      <Stats />
    </div>
  );
}

function Logo() {
  return <h1>🌴Far away 💼</h1>;
}

function Form() {
  /*
  👉 Controlled Elements - React is the one who controlled the state
    How to do it?
      1. Create a "piece of state" (i.e. text field)
      2. Use the piece of state on the element that we want to control. Force the element to take always the value of the state variable
      3. Connect the state with value we want to type. Update the state variable (i.e. onChange example)
  
  */
  const [description, setDescription] = useState("");
  const [quantity, setQuantity] = useState(1);

  function handleSubmit(e) {
    e.preventDefault();

    // Guard clause
    if (!description) return;

    const newItem = { description, quantity, packed: false, id: Date.now() };
    console.log(newItem);

    // Back to Initial State
    setDescription("");
    setQuantity(1);
  }

  return (
    <form className="add-form" onSubmit={handleSubmit}>
      <h3>What do you need for your 😍 trip?</h3>
      <select
        value={quantity}
        //Controlled Elements
        onChange={(e) => {
          setQuantity(Number(e.target.value));
        }}
      >
        {Array.from({ length: 20 }, (_, i) => i + 1).map((num) => (
          <option value={num} key={num}>
            {num}
          </option>
        ))}
      </select>
      <input
        type="text"
        placeholder="Item..."
        value={description}
        //Controlled Elements
        onChange={
          (e) => setDescription(e.target.value) // e.target is the whole element, while e.target.value is the value set in the input field
        }
      />
      <button>Add</button>
    </form>
  );
}

function PackingList() {
  return (
    <div className="list">
      <ul>
        {initialItems.map((item) => (
          <Item item={item} key={item.id} />
        ))}
      </ul>
    </div>
  );
}

function Item({ item }) {
  return (
    <li>
      <span style={item.packed ? { textDecoration: "line-through" } : {}}>
        {item.quantity} {item.description}
      </span>
      <button>❌</button>
    </li>
  );
}

function Stats() {
  return (
    <footer className="stats">
      <em>💼 You have X items on your list, and you already packed X (X%)</em>
    </footer>
  );
}

/*
**Common Interview Questions**

  Difference between **STATE vs PROPS**

    💡 STATE
      - **Internal** data, owned by component
      - Component "memory"
      - Can be updated by the component itself
      - Updateing state cuases component to re-render
      - Used to make components interactive
     
    💡 PROPS
      - **External** data, owned by parent component
      - Similar to function parameters
      - Read-only
      - **Receiving new props causes components to re-render.** Usually when the parent's state has been updated
      - Used by parent to configure child component ("settings")
      

    💡 Connection between the props and state
      - Whenever a piece of state is passed as a props, when the state updates, both components are re-rendered. Both the component owning the state and the component receiving the state as a prop, and so this is a very important connection between state and props.

*/
