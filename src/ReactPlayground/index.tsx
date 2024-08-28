import { Allotment } from "allotment";
import "allotment/dist/style.css";
import Header from "./components/Header";
import CodeEditor from "./components/CodeEditor";
function ReactPlayground() {
  return (
    <div className="h-screen">
      <Header />
      {/* defaultSizes={[100,100]---> 1 : 1 分割 */}
      <Allotment defaultSizes={[100, 100]}>
        <Allotment.Pane minSize={500}>
          <CodeEditor />
        </Allotment.Pane>
        <Allotment.Pane minSize={0}>
          <div>page</div>
        </Allotment.Pane>
      </Allotment>
    </div>
  );
}

export default ReactPlayground;
