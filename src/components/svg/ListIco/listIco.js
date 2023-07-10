import * as React from 'react';
import Svg, { Path } from 'react-native-svg';

function ListIco(props) {
  const color = props.color;
  return (
    <Svg
      width={16}
      height={21}
      viewBox="0 0 16 21"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <Path
        d="M13.964 2.668H12.12v-.824c0-.267-.29-.388-.557-.388h-1.43C9.794.486 8.946.002 7.976.002a2.206 2.206 0 00-2.158 1.454H4.412c-.266 0-.533.121-.533.388v.824H2.036A2.06 2.06 0 000 4.632v13.891c0 1.067.97 1.843 2.036 1.843h11.928c1.067 0 2.036-.776 2.036-1.843V4.632a2.06 2.06 0 00-2.036-1.964zm-9.115-.242h1.333a.533.533 0 00.46-.437A1.406 1.406 0 017.977.9c.635.019 1.176.469 1.309 1.09a.533.533 0 00.485.437h1.382v1.94H4.849v-1.94zM15.03 18.523c0 .533-.534.873-1.067.873H2.036c-.533 0-1.066-.34-1.066-.873V4.632a1.09 1.09 0 011.066-.994H3.88v1.236a.51.51 0 00.533.461h7.152a.533.533 0 00.557-.46V3.637h1.843a1.09 1.09 0 011.066.994v13.891z"
        fill={color}
      />
      <Path
        d="M6.133 10.839a.485.485 0 00-.678-.025l-1.552 1.48-.654-.68a.485.485 0 00-.68-.024.509.509 0 000 .703l.995 1.018c.086.097.21.15.339.146a.485.485 0 00.34-.146l1.89-1.793a.46.46 0 000-.68zM13.091 11.88H7.515a.485.485 0 100 .97h5.576a.485.485 0 000-.97zM6.133 6.96a.485.485 0 00-.678-.024L3.903 8.414l-.654-.678a.485.485 0 00-.68-.025.51.51 0 000 .703l.995 1.019c.086.096.21.15.339.145a.485.485 0 00.34-.145l1.89-1.794a.46.46 0 000-.68zM13.091 8.002H7.515a.485.485 0 100 .97h5.576a.485.485 0 100-.97zM6.133 14.717a.485.485 0 00-.678-.024l-1.552 1.48-.654-.68a.485.485 0 00-.68-.024.509.509 0 000 .703l.995 1.018c.086.097.21.15.339.146a.485.485 0 00.34-.146l1.89-1.794a.46.46 0 000-.679zM13.091 15.76H7.515a.485.485 0 100 .97h5.576a.485.485 0 000-.97z"
        fill={color}
      />
    </Svg>
  );
}

export default ListIco;