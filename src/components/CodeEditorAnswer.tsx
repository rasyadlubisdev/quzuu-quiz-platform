import dynamic from 'next/dynamic';
import { Button } from './ui/button';

const MonacoEditor = dynamic(() => import('@monaco-editor/react'), { ssr: false });

const CodeEditorAnswer = () => {
  return (
    <div className="code-editor-answer">
        <div className="code-editor-wrapper overflow-hidden rounded-md">
            <MonacoEditor
                height="400px"
                defaultLanguage="cpp"
                theme="vs-dark"
                defaultValue={`#include <iostream>
using namespace std;

int main() {
    // your code here
    return 0;
}`}
            />
        </div>
        <Button className='mt-8'>Submit Code</Button>
    </div>
  );
};

export default CodeEditorAnswer;