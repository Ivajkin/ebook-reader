import * as React from 'react';
import Svg, { Path } from 'react-native-svg';

function ExitIco(props) {
  return (
    <Svg
      width={18}
      height={19}
      viewBox="0 0 18 19"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <Path
        d="M5.103 14.743h0L.306 9.993a.693.693 0 010-.986l4.797-4.75h0a.684.684 0 01.974.007.693.693 0 01-.007.979h0L2.642 8.637l-.173.171h9.43a.69.69 0 01.689.692.69.69 0 01-.69.692H2.47l.173.17 3.428 3.395h0a.693.693 0 01.007.979.687.687 0 01-.974.007zm10.53-13.26H8.532a.69.69 0 01-.69-.691.69.69 0 01.69-.692h7.1c1.25 0 2.268 1.02 2.268 2.275v14.25a2.274 2.274 0 01-2.267 2.275H8.532a.69.69 0 01-.69-.692.69.69 0 01.69-.691h7.1a.89.89 0 00.89-.892V2.375a.89.89 0 00-.89-.892z"
        fill="#FF3B30"
        stroke="#fff"
        strokeWidth={0.2}
      />
    </Svg>
  );
}

export default ExitIco;
