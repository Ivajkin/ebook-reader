import * as React from 'react';
import Svg, { Path } from 'react-native-svg';

function AvatarIco(props) {
  return (
    <Svg
      width={19}
      height={20}
      viewBox="0 0 19 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <Path
        d="M9.561 0C6.44 0 3.807 2.633 3.807 5.755c0 3.121 2.633 5.754 5.754 5.754 3.122 0 5.66-2.633 5.66-5.754C15.222 2.633 12.684 0 9.562 0zM15.844 11.51c-1.555 1.724-3.783 2.83-6.283 2.83a8.645 8.645 0 01-6.376-2.83C1.827 13.015.977 14.988.977 17.17v1.415c0 .782.632 1.415 1.415 1.415h14.245c.782 0 1.415-.633 1.415-1.415V17.17c0-2.182-.85-4.155-2.208-5.66z"
        fill={'#FF3B30'}
      />
    </Svg>
  );
}

export default AvatarIco;
