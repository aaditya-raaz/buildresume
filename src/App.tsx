/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/layout/Header';
import { LandingPage } from './components/views/LandingPage';
import { DashboardView } from './components/views/DashboardView';
import { ProfileBuilderView } from './components/views/ProfileBuilderView';
import { JobAnalyzerView } from './components/views/JobAnalyzerView';
import { ResumeEditorView } from './components/views/ResumeEditorView';
import { ApplicationTrackerView } from './components/views/ApplicationTrackerView';
import { AtsOptimizerView } from './components/views/AtsOptimizerView';
import { SkillRoadmapView } from './components/views/SkillRoadmapView';

const MainRouter: React.FC = () => {
  const { currentView } = useApp();

  return (
    <div className="min-h-screen flex flex-col bg-[#F7F9FC]">
      <Header />
      <main className="flex-1">
        {currentView === 'landing' && <LandingPage />}
        {currentView === 'dashboard' && <DashboardView />}
        {currentView === 'profile' && <ProfileBuilderView />}
        {currentView === 'analyzer' && <JobAnalyzerView />}
        {currentView === 'editor' && <ResumeEditorView />}
        {currentView === 'tracker' && <ApplicationTrackerView />}
        {currentView === 'ats_checker' && <AtsOptimizerView />}
        {currentView === 'roadmap' && <SkillRoadmapView />}
      </main>
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainRouter />
    </AppProvider>
  );
}
