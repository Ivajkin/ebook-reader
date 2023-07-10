import * as React from 'react';
import Svg, { Path } from 'react-native-svg';

function CreateIco(props) {
  const color = props.color;
  return (
    <Svg
      width={17}
      height={17}
      viewBox="0 0 17 17"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <Path
        d="M7.641 9.609v-.25H1.11a.859.859 0 110-1.718H7.64V1.11a.859.859 0 011.718 0V7.64h6.532a.859.859 0 010 1.718H9.36v6.532a.859.859 0 01-1.718 0V9.61z"
        fill={color}
        stroke={color}
        strokeWidth={0.5}
      />
    </Svg>
  );
}

export default CreateIco;
