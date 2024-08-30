import { useState } from "react";

const initialItems = [
  { id: 1, description: "Passports", quantity: 2, packed: true },
  { id: 2, description: "Socks", quantity: 12, packed: true },
  { id: 3, description: "Charger", quantity: 1, packed: false },
];

export default function App() {
  // Lift up state - when multiple component (siblings) shared data
  const [items, setItems] = useState([]); //empty array

  function handleAddItems(item) {
    setItems((items) => [...items, item]); //make a copy by using spread operator [...]
  }

  return (
    <div className="app">
      <Logo />
      <Form onAddItems={handleAddItems} />
      <PackingList items={items} />
      <Stats />
    </div>
  );
}

function Logo() {
  return <h1>🌴Far away 💼</h1>;
}

function Form({ onAddItems }) {
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

function PackingList({ items }) {
  return (
    <div className="list">
      <ul>
        {items.map((item) => (
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

"**THINKING** IN REACT" IS A CORE SKILL

  HOW TO WORK WITH REACT API
          +     This is where professional React apps where built
  THINKING IN REACT
    👉 "React Mindset"
    👉 Thinking about coponent, state, data flow, effects, etc.
    👉 Thinking in **state transitions**, not element mutations

  "THINKING IN REACT" AS A **PROCESS**
    Note: Not a rigid process

    1. Break the desired UI nto **components** and establish the **component tree**
    2. Build a **static** version in React (without state)
    3. Think about **state**
      👉 When to use state
      👉 Types of state: local vs global
      👉 Where to place each piece of state
    4. Establish **data flow**:
      👉 One-way data flow
      👉 Child-to-parent communication
      👉 Accessing global state
    
  WHEN YOU KNOW HOW TO "THINK IN REACT", YOU WILL BE ABLE TO ANSWER:
    🤔 How to break up a UI design into components?
    🤔 How to make some components resusable?
    🤔 How to assemble UI from reusable components?
    🤔 What pieces of state do I need for interactivity?
    🤔 Where to place state? (What component should "own" each peice of state?)
    🤔 What types of state can or should I use?
    🤔 How to make data flow through app? 


FUNDAMENTALS OF STATE MANAGEMENT

  What is state **management**?
    👉 **State management**: Deciding **when** to create pieces of state, what **types** of state are necessary, **where** to place each piece of state, and how data **flows** through app -> 🏡 Giving each piece of state a **home**

  **TYPES** OF STATE: LOCAL VS GLOBAL STATE
    📚 GLOBAL STATE
      👉 State that **many components** might need
      👉 **share** state that is accessible to **every component** in the entire application

    📚 LOCAL STATE
      👉 State needed **only by one or few components**
      👉 State that is defined in a component and **only that component and child components** have access to it (by passing via props)

      ☝ **We should always start with local state**

  STATE: WHEN & Where?
    (Refer to pdf for diagram)

    Need to store data
      ▶ Will data change at some point? 🚫 ➡ **Regular** const variable
        ✅ 🔻
         ➡ Can be computed from existing state/props? ✅ ➡ Derive state
         🚫🔻
          ➡ Should i re-render component? 🚫 ➡ Ref (useRef, more on this later)
          ✅ 🔻
            ➡ Place a new piece of state in component ("Always start with local state")
    WHEN to create state ------------------------------------------------------------------
    WHERE to create state ------------------------------------------------------------------
            🔻
            ➡ Only used by this component? ✅ ➡ Leave in component
              🚫🔻
                ➡ Also used by a child component? ✅ ➡ Pass to child via props
                🚫🔻
                  ➡ Used by one or a few sibling components? ✅ ➡ Lift state up to first common parent
                  🚫🔻
                    👉 Probably **global state**. Global state management later in the course...


THINKING ABOUT STATE AND LIFT STATE UP
*/
