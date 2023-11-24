import React from 'react';
import './App.css'
import Robot, { RobotConfiguration, getCost } from './components/Robot'
import RobotChooser from './components/RobotChooser';
import coins from './assets/Coins.png';

const defaultBot = 'Buddy';

const encodeConfiguration = (configuration: RobotConfiguration) => {
  return new URLSearchParams(Object.entries(configuration).map(([part, skin]) => [part, skin])).toString();
}

const parseConfiguration = (search: string) => {
  const params = new URLSearchParams(search);
  const configuration = Object.fromEntries(params.entries()) as RobotConfiguration;
  return configuration;
}

function App() {
  const [robotConfiguration, setRobotConfiguration] = React.useState<RobotConfiguration>({
    head: defaultBot,
    body: defaultBot,
    leftArm: defaultBot,
    rightArm: defaultBot,
    legs: defaultBot,
  });
  const [selectedParts, setSelectedParts] = React.useState<(keyof RobotConfiguration)[]>([]);
  const [hashParsed, setHashParsed] = React.useState(false);

  React.useEffect(() => {
    if (!hashParsed) {
      return;
    }
    window.location.hash = encodeConfiguration(robotConfiguration);
  }, [robotConfiguration, hashParsed]);

  React.useEffect(() => {
    function parseHash() {
      setHashParsed(true);
      const configuration = parseConfiguration(window.location.hash.slice(1));
      if (Object.keys(configuration).sort().join() !== 'body,head,leftArm,legs,rightArm') {
        return;
      }
      setRobotConfiguration(configuration);
    }
    parseHash();
    window.addEventListener('hashchange', parseHash);
    return () => window.removeEventListener('hashchange', parseHash);
  }, []);


  const handlePartClick = (part: keyof RobotConfiguration, withShift: boolean) => {
    if (withShift) {
      if (selectedParts.includes(part)) {
        setSelectedParts(selectedParts.filter(p => p !== part));
      } else {
        setSelectedParts([...selectedParts, part]);
      }
    } else {
      if (selectedParts.includes(part) && selectedParts.length === 1) {
        setSelectedParts([])
      } else {
        setSelectedParts([part])
      }
    }
  }

  const updateSelected = (skin: string) => {
    const entries = Object.entries(robotConfiguration)
      .map(([part, value]) => [part, selectedParts.includes(part as keyof RobotConfiguration) ? skin : value])
    setRobotConfiguration(Object.fromEntries(entries) as RobotConfiguration)
  }

  return (
    <div id="container">
      <div id="header">
        <h1>Numbots Changing Room</h1>
      </div>
      <div id="robot-section">
        <Robot
          configuration={robotConfiguration}
          selectedParts={selectedParts}
          onPartClick={handlePartClick}
          style={{height: 'min(100vw, 100%)'}}
        />
      </div>
      <div id="chooser-section">
        <RobotChooser selected={selectedParts.map(p => robotConfiguration[p])} onSelect={updateSelected} />
      </div>
      <div id="cost">
        <img src={coins} alt="Coins" />
        <p>Total Cost:&nbsp;</p>
        <p>{getCost(robotConfiguration)}</p>
      </div>
    </div>
  )
}

export default App
