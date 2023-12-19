import Header from './components/header/Header';
import SectionData from './components/section/SectionInfo';
import GetData from './components/services/Get';

function App() {
  return (
    <div className="flex flex-col text-center">
        <Header/>
        <SectionData/>
    </div>
  );
}

export default App;
