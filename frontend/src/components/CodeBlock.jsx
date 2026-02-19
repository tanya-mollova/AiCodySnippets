import Prism from 'prismjs';
import 'prismjs/themes/prism-tomorrow.css';
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

const toGrammarKey = (language) => {
  switch ((language || '').toLowerCase()) {
    case 'javascript': case 'js':   return 'javascript';
    case 'typescript': case 'ts':   return 'typescript';
    case 'python':     case 'py':   return 'python';
    case 'java':                    return 'java';
    case 'c':                       return 'c';
    case 'cpp':        case 'c++':  return 'cpp';
    case 'csharp':     case 'c#':   return 'csharp';
    case 'go':                      return 'go';
    case 'rust':                    return 'rust';
    case 'html':                    return 'markup';
    case 'css':                     return 'css';
    case 'sql':                     return 'sql';
    default:                        return 'javascript';
  }
};

function CodeBlock({ code, language, maxHeight = 200, overflow = 'auto' }) {
  const grammarKey = toGrammarKey(language);
  const grammar = Prism.languages[grammarKey] || Prism.languages.javascript;
  const highlighted = Prism.highlight(code || '', grammar, grammarKey);
  const cls = `language-${grammarKey}`;

  return (
    <div style={{
      borderRadius: 8,
      overflow: 'hidden',
      border: '1px solid rgba(255,255,255,0.07)',
      boxShadow: '0 2px 12px rgba(0,0,0,0.4)',
    }}>
      {/* IDE window chrome */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        padding: '7px 12px',
        backgroundColor: '#2d2d2d',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        userSelect: 'none',
      }}>
        <span style={{ width: 11, height: 11, borderRadius: '50%', backgroundColor: '#ff5f57', display: 'inline-block', flexShrink: 0 }} />
        <span style={{ width: 11, height: 11, borderRadius: '50%', backgroundColor: '#febc2e', display: 'inline-block', flexShrink: 0 }} />
        <span style={{ width: 11, height: 11, borderRadius: '50%', backgroundColor: '#28c840', display: 'inline-block', flexShrink: 0 }} />
        <span style={{
          marginLeft: 8,
          fontSize: 11,
          color: 'rgba(255,255,255,0.35)',
          fontFamily: 'monospace',
          letterSpacing: '0.03em',
        }}>
          {(language || 'code').toLowerCase()}
        </span>
      </div>

      {/* Code body */}
      <div style={{ overflow, maxHeight, backgroundColor: '#1d1f21' }}>
        <pre className={cls} style={{ margin: 0, background: 'transparent', borderRadius: 0, fontSize: '0.8rem', lineHeight: 1.6 }}>
          <code className={cls} dangerouslySetInnerHTML={{ __html: highlighted }} />
        </pre>
      </div>
    </div>
  );
}

export default CodeBlock;