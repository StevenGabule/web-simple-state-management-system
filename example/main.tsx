import ReactDOM from 'react-dom/client'
import { createStore, useStore } from '../src'

interface CounterStrike {
	count: number;
	increment: () => void;
	decrement: () => void;
	reset: () => void;
}

// Test your library here
const store = createStore<CounterStrike>((set) => ({
	count: 0,
	increment: () => set((state) => ({ count: state.count + 1 })),
	decrement: () => set((state) => ({ count: state.count - 1 })),
	reset: () => set((state) => ({ count: 0 })),
}))

function App() {
	const count = useStore(store, (state) => state.count)
	const increment = useStore(store, (state) => state.increment)
	const decrement = useStore(store, (state) => state.decrement)
	const reset = useStore(store, (state) => state.reset)

	return (
		<div>
			<h1>Count: {count}</h1>
			<button onClick={increment}>Increment</button>
			<button onClick={decrement}>Decrement</button>
			<button onClick={reset}>Reset</button>
		</div>
	)
}

ReactDOM.createRoot(document.getElementById('root')!).render(<App />)