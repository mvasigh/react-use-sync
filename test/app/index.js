import React, { useState } from 'react';
import { render } from 'react-dom';
import useSync from '../../build';

console.log({ useSync });

function App() {
  const [clicked, setClicked] = useSync('clicked', useState(0));

  return (
    <React.Fragment>
      <p>Clicked {clicked} times!</p>
      <button onClick={() => setClicked(clicked + 1)}>Click</button>
    </React.Fragment>
  );
}

render(<App />, document.getElementById('app'));
