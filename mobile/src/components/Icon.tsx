import React from 'react';
import { Ionicons } from '@expo/vector-icons';

type IconName = React.ComponentProps<typeof Ionicons>['name'];

interface Props {
  name: IconName;
  size?: number;
  color?: string;
}

export const Icon: React.FC<Props> = ({ name, size = 20, color = '#fff' }) => {
  return <Ionicons name={name} size={size} color={color} />;
};
