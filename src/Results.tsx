import Code from './components/Code';

import './Results.css';

export function Results( { latex, python } : { latex: string, python: string }) {
    return (
        <div className="results center-div">
            <h2>Finally, the <b>result</b></h2>
            <div className="results__codes center-div">
                    <Code code={latex} language="LaTeX" />
                    <Code code={python} language="Python" />
            </div>
        </div>
    );
}

export default Results;