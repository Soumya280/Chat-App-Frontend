import CreateJoinChat from "./components/CreateJoinChat";
import Navbar from "./components/Navbar";
const App = () => {
  return (
    <div className="h-screen bg-amber-100 dark:bg-gray-950 overflow-y-auto flex flex-col items-center gap-3 ">
      <Navbar />
      <CreateJoinChat />
    </div>
  );
};
export default App;
