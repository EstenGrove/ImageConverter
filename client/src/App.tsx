import "./App.scss";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import UploadsPage from "./pages/UploadsPage";
import FilesManagerPage from "./pages/FilesManagerPage";
import Navbar from "./components/layout/Navbar";
import EditorPage from "./pages/EditorPage";

function App() {
	return (
		<Router>
			<div className="App">
				<Navbar />
				<Routes>
					<Route path="/" element={<UploadsPage />} />
					<Route path="/editor" element={<EditorPage />} />
					<Route path="/files" element={<FilesManagerPage />} />
				</Routes>
			</div>
		</Router>
	);
}

export default App;
