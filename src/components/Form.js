import { useState } from "react";

export default function Form({ onAddItems }) {
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
    // console.log(newItem);
    onAddItems(newItem);

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
