import { useEffect, useRef } from 'react';
import Prism from 'prismjs';
import 'prismjs/themes/prism-okaidia.css';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-java';
import 'prismjs/components/prism-c';
import 'prismjs/components/prism-cpp';
import 'prismjs/components/prism-csharp';
import 'prismjs/components/prism-go';
import 'prismjs/components/prism-rust';
import 'prismjs/components/prism-markup';
import 'prismjs/components/prism-css';
import 'prismjs/components/prism-sql';

const langClass = (language) => {
  switch ((language || '').toLowerCase()) {
    case 'javascript':
    case 'js':
      return 'language-javascript';
    case 'typescript':
    case 'ts':
      return 'language-typescript';
    case 'python':
    case 'py':
      return 'language-python';
    case 'java':
      return 'language-java';
    case 'c':
      return 'language-c';
    case 'cpp':
    case 'c++':
      return 'language-cpp';
    case 'csharp':
    case 'c#':
      return 'language-csharp';
    case 'go':
      return 'language-go';
    case 'rust':
      return 'language-rust';
    case 'html':
      return 'language-markup';
    case 'css':
      return 'language-css';
    case 'sql':
      return 'language-sql';
    default:
      return 'language-javascript';
  }
};

function CodeBlock({ code, language, maxHeight = 200 }) {
  const ref = useRef(null);

  useEffect(() => {
    if (ref.current) {
      Prism.highlightAllUnder(ref.current);
    }
  }, [code, language]);

  return (
    <div
      ref={ref}
      style={{
        backgroundColor: '#1e1e1e',
        borderRadius: 8,
        overflow: 'auto',
        maxHeight,
      }}
    >
      <pre className={langClass(language)} style={{ margin: 0 }}>
        <code className={langClass(language)}>{code}</code>
      </pre>
    </div>
  );
}

export default CodeBlock;