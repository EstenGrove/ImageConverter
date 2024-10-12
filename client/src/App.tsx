import "./App.scss";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import UploadsPage from "./pages/UploadsPage";
import FilesManagerPage from "./pages/FilesManagerPage";
import Navbar from "./components/layout/Navbar";
import EditorPage from "./pages/EditorPage";
import CsvViewerPage from "./pages/CsvViewerPage";

function App() {
	return (
		<Router>
			<div className="App">
				<Navbar />
				<Routes>
					<Route path="/" element={<UploadsPage />} />
					<Route path="/editor" element={<EditorPage />} />
					<Route path="/files" element={<FilesManagerPage />} />
					<Route path="/csv" element={<CsvViewerPage />} />
				</Routes>
			</div>
		</Router>
	);
}

export default App;
