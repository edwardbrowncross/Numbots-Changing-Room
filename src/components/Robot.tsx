import React from 'react';
import robots from '../data'
import './Robot.css';

const BodyPart: React.FC<{
  url: string,
  part: string,
  selected?: boolean,
  onClick?: (withShift: boolean) => void
}> = ({ url, part, selected = false, onClick }) => {
  return (
    <>
      <img src={url} alt={part} className={`part ${part}`} onClick={(e) => onClick && onClick(e.shiftKey || e.ctrlKey)} />
      {selected && <div className={`selection selection-${part}`} />}
    </>
  );
};

export type RobotConfiguration = {
  head: string;
  body: string;
  leftArm: string;
  rightArm: string;
  legs: string;
};

export const getCost = (configuration: RobotConfiguration, partFilter?: string[]) => {
  return Object.entries(configuration).reduce((acc, [part, skin]) => {
    if (partFilter && !partFilter.includes(part)) {
      return acc
    }
    const robot = robots.find(r => r.name === skin)
    if (!robot) {
      console.warn(`Could not find robot with name ${skin}`)
      return acc
    }
    const partCost = robot.parts[part as keyof RobotConfiguration]?.price
    return acc + (partCost || 0)
  }, 0);
}

const Robot: React.FC<{
  configuration: RobotConfiguration,
  selectedParts: string[],
  onPartClick: (part: keyof RobotConfiguration, withShift: boolean) => void
} & React.ComponentProps<'div'>> = ({ configuration, selectedParts, onPartClick, ...props }) => {

  return (
    <div className="robot" {...props}>
      {Object.entries(configuration).map(([part, skin]) => {
        const robot = robots.find(r => r.name === skin)
        if (!robot) {
          console.warn(`Could not find robot with name ${skin}`)
          return null
        }
        const partUrl = robot.parts[part as keyof RobotConfiguration]?.url
        return <BodyPart key={part}
          part={part}
          url={partUrl}
          selected={selectedParts.includes(part)}
          onClick={(withShift) => onPartClick(part as keyof RobotConfiguration, withShift)}
        />
      })}
    </div>
  );
};

export const FullRobot: React.FC<{
  skin: string
  selected?: boolean
} & React.ComponentProps<'div'>> = ({ skin, selected, ...props }) => {
  const robot = robots.find(r => r.name === skin)
  if (!robot) {
    console.warn(`Could not find robot with name ${skin}`)
    return null
  }
  return (
    <div className="robot" {...props}>
      <BodyPart part="full" url={robot?.url} selected={selected} />
    </div>
  );
}

export default Robot;
