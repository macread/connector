import "./App.css";
import Main from "./views/Main";
import UnstatedNextProviders from "containers/UnstatedNextProviders";

function App() {
	return (
		<div className="App">
			{/* @ts-ignore */}
			<UnstatedNextProviders>
				<Main />
			</UnstatedNextProviders>
		</div>
	);
}

export default App;
