import React from 'react';
import { FullRobot } from './Robot';
import robots from '../data';
import './RobotChooser.css';

const RobotChooser: React.FC<{
  selected: string[],
  onSelect: (type: string) => void
}> = ({ onSelect, selected }) => {
  return (
    <div className="robot-chooser">
      {robots.map(robot => (
        <FullRobot
          key={robot.name}
          skin={robot.name}
          onClick={() => onSelect(robot.name)}
          style={{ cursor: 'pointer' }}
          selected={selected.includes(robot.name)}
        />
      ))}
    </div>
  );
};

export default RobotChooser;