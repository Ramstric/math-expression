import { useEffect } from "react";
import Prism from "prismjs";
import 'prism-themes/themes/prism-one-dark.css';

import './Code.css';

export function Code({code, language} : { code: string, language: string }) {
    useEffect(() => {
        Prism.highlightAll();
    }, []);

    return (
        <div className="code center-div">
            <h3>{language} code</h3>
            <pre>
                <code className={`language-${language.toLowerCase()}`}>
                    {code}
                </code>
            </pre>
        </div>
    );
}

export default Code;