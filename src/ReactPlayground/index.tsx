import { Allotment } from "allotment";
import "allotment/dist/style.css";
import Header from "./components/Header";
import CodeEditor from "./components/CodeEditor";
import Preview from "./components/Preview";
import { useContext } from "react";
import { PlaygroundContext } from "./context/PlaygroundContext";
function ReactPlayground() {
  const {theme} = useContext(PlaygroundContext)

  return (
    <div className={`h-screen ${theme}`}>
      <Header />
      {/* defaultSizes={[100,100]---> 1 : 1 分割 */}
      <Allotment defaultSizes={[100, 100]}>
        <Allotment.Pane minSize={500}>
          <CodeEditor />
        </Allotment.Pane>
        <Allotment.Pane minSize={0}>
          <Preview />
        </Allotment.Pane>
      </Allotment>
    </div>
  );
}

export default ReactPlayground;
