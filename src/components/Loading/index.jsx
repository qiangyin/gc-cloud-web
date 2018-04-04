import React from 'react';
import classNames from 'classnames';

export default ({text = '加载中...', ...other}, style) => {
  return (
    <div {...other}>
      loading
    </div>
  );
};
