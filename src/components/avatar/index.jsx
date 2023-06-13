import { Avatar } from 'antd';
import React from 'react';
const WordLetterAvatar = ({ word }) => {
  let letter = word.split(' ')[0].charAt(0).toUpperCase();
  letter += word.split(' ')[1].charAt(0).toUpperCase();

  return (
    <Avatar
      style={{
        backgroundColor: '#ffff',
        color:'#001529',
        verticalAlign: 'middle',
        fontWeight: 'bold',
        fontSize: 14,
      }}
    >
      {letter}
    </Avatar>
  );
};

export default WordLetterAvatar;
