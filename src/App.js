import { useState } from "react";

const initialItems = [
  { id: 1, description: "Passports", quantity: 2, packed: true },
  { id: 2, description: "Socks", quantity: 12, packed: true },
  { id: 3, description: "Charger", quantity: 1, packed: false },
];

export default function App() {
  // Lift up state - when multiple component (siblings) shared data and need to bring the data to the parent component
  const [items, setItems] = useState([]); //empty array

  function handleAddItems(item) {
    setItems((items) => [...items, item]); //make a copy by using spread operator [...]
  }

  function handleDeleteItem(id) {
    // Need to know which item should be deleted by using the id, use filter method
    setItems((items) => items.filter((item) => item.id !== id));
  }

  function handleToggleItem(id) {
    setItems((items) =>
      items.map((item) =>
        item.id === id ? { ...item, packed: !item.packed } : item
      )
    );
  }

  // Clearing the array by setting it to empty
  function handleClearList() {
    const confirmed = window.confirm(
      "Are you sure you want to delete all items?"
    );

    if (confirmed) setItems([]);
  }

  return (
    <div className="app">
      <Logo />
      <Form onAddItems={handleAddItems} />
      <PackingList
        items={items}
        onDeleteItem={handleDeleteItem}
        onToggleItem={handleToggleItem}
        onClearList={handleClearList}
      />
      <Stats items={items} />
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

function PackingList({ items, onDeleteItem, onToggleItem, onClearList }) {
  const [sortBy, setSortBy] = useState("input");

  // Derived State
  let sortedItems;

  if (sortBy === "input") sortedItems = items;
  if (sortBy === "description")
    sortedItems = items
      .slice()
      .sort((a, b) => a.description.localeCompare(b.description));
  if (sortBy === "packed")
    sortedItems = items
      .slice()
      .sort((a, b) => Number(a.packed) - Number(b.packed));

  return (
    <div className="list">
      <ul>
        {sortedItems.map((item) => (
          <Item
            item={item}
            key={item.id}
            onDeleteItem={onDeleteItem}
            onToggleItem={onToggleItem}
          />
        ))}
      </ul>

      <div className="actions">
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
          <option value="input">Sort by input order</option>
          <option value="description">Sort by description</option>
          <option value="packed">Sort by packed status</option>
        </select>
        <button onClick={onClearList}>Clear list</button>
      </div>
    </div>
  );
}

function Item({ item, onDeleteItem, onToggleItem }) {
  return (
    <li>
      <input
        type="checkbox"
        value={item.packed}
        onChange={() => onToggleItem(item.id)}
      />
      <span style={item.packed ? { textDecoration: "line-through" } : {}}>
        {item.quantity} {item.description}
      </span>
      <button onClick={() => onDeleteItem(item.id)}>❌</button>
    </li>
  );
}

function Stats({ items }) {
  if (!items.length)
    return (
      <p className="stats">
        <em>Start adding some items to your packing list 🚀</em>
      </p>
    );

  const numItems = items.length;
  const numPacked = items.filter((item) => item.packed).length;
  const percentage = Math.round((numPacked / numItems) * 100);

  return (
    <footer className="stats">
      <em>
        {percentage === 100
          ? "You got everthing! Ready to go ✈"
          : `💼 You have ${numItems} items on your list, and you already packed
        ${numPacked} (${percentage}%)`}
      </em>
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


DERIVING STATE
  👍 **Derived state**: state that is computed from an existing piece of state or from props

    ❌ Bad sample of code
      const [cart, setCart] = useState([
        {name: "JavaScript Course", price: 15.99},
        {name: "Node.js Bootcamp", price: 14.99},
      ]);

      const {numItems, setNumItems} = useState(2); 
      const {totalPrice, setTotalPrice} = useState(30.98);
    
    🗣 Explanation:
      👎 3 seperate pieces of state, even though numItems and totalPrice depend on cart
      👎 Need to keep them in sync (update together)
      👎 3 state updates will cause 3 re-renders

    ✅ DERIVING STATE
       const [cart, setCart] = useState([
        {name: "JavaScript Course", price: 15.99},
        {name: "Node.js Bootcamp", price: 14.99},
      ]);

      const numtItems = cart.length;
      const totalPrice = cart.reduce((acc, cur) => acc + cur.price, 0);

    🗣 Explanation:
      👍 Just regular variables, no useState
      👍 cart state is the **single source of truth** for this related data
      👍 Works because re-rendering component will **automatically re-calculate** derived state
*/
