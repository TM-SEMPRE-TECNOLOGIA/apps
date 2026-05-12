import React from 'react';

export enum AppView {
  DASHBOARD = 'DASHBOARD',
  GENERATE = 'GENERATE',
  EXTRACT = 'EXTRACT',
  COMPARE = 'COMPARE',
  SUPPORT = 'SUPPORT',
}

export interface ServiceOption {
  id: AppView;
  title: string;
  description: string;
  icon: React.ReactNode;
  colorClass: string;
  badge?: string;
}

export interface FileData {
  name: string;
  size: number;
  type: string;
  lastModified: number;
}