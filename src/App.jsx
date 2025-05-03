import { Routes, Route } from "react-router-dom";
import ProfileList from "./pages/ProfileList";
import SchedulePage from "./pages/SchedulePage";

function App() {
  return (
    <div className="min-h-screen bg-gray-900 text-white w-full overflow-x-hidden">
      <Routes>
        <Route path="/" element={<ProfileList />} />
        <Route path="/schedule/:profileId" element={<SchedulePage />} />
      </Routes>
    </div>
  );
}

export default App;
