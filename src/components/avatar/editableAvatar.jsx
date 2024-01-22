import React, { useState } from 'react';
import { Avatar, Tooltip } from 'antd';
import { EditOutlined } from '@ant-design/icons';

export const EditableAvatar = ({ src, size, onEdit }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <Tooltip title="Edit">
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{ position: 'relative', display: 'inline-block' }}
      >
        <Avatar size={size} >
          {src}
        </Avatar>
        {hovered && (
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              borderRadius: '50%',
            }}
          >
            <EditOutlined
              style={{ color: '#fff', fontSize: '20px', cursor: 'pointer' }}
              onClick={onEdit}
            />
          </div>
        )}
      </div>
    </Tooltip>
  );
};
