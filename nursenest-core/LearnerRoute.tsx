import React, { Suspense, useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import WidgetSkeleton from './WidgetSkeleton';
import DeferredAnalytics from './DeferredAnalytics';
import LessonModule from './LessonModule';
import Navigation from './Navigation';
import ProgressIndicators from './ProgressIndicators';

const LearnerRoute = () => {
  const params = useParams();
  const location = useLocation();
  const [sessionMetadata, setSessionMetadata] = useState({});
  const [activeLesson, setActiveLesson] = useState({});
  const [criticalNavigation, setCriticalNavigation] = useState({});
  const [minimalProgressIndicators, setMinimalProgressIndicators] = useState({});

  useEffect(() => {
    const fetchSessionMetadata = async () => {
      const response = await fetch('/api/session-metadata');
      const data = await response.json();
      setSessionMetadata(data);
    };

    const fetchActiveLesson = async () => {
      const response = await fetch('/api/active-lesson');
      const data = await response.json();
      setActiveLesson(data);
    };

    const fetchCriticalNavigation = async () => {
      const response = await fetch('/api/critical-navigation');
      const data = await response.json();
      setCriticalNavigation(data);
    };

    const fetchMinimalProgressIndicators = async () => {
      const response = await fetch('/api/minimal-progress-indicators');
      const data = await response.json();
      setMinimalProgressIndicators(data);
    };

    fetchSessionMetadata();
    fetchActiveLesson();
    fetchCriticalNavigation();
    fetchMinimalProgressIndicators();
  }, [params, location]);

  return (
    <div>
      <SessionMetadata metadata={sessionMetadata} />
      <LessonModule lesson={activeLesson} />
      <Navigation navigation={criticalNavigation} />
      <ProgressIndicators indicators={minimalProgressIndicators} />
      <Suspense fallback={<WidgetSkeleton />}>
        <DeferredAnalytics />
      </Suspense>
    </div>
  );
};

export default LearnerRoute;
