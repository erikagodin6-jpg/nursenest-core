import React, { Suspense } from 'react';
import WidgetSkeleton from './WidgetSkeleton';

const DeferredTutorSystems = () => {
  // Implementation of DeferredTutorSystems component
  // This component should fetch and render tutor systems data
  // It should be wrapped in a Suspense component with a fallback
  return <div>Tutor systems will be rendered here</div>;
};

const TutorSystems = () => {
  return (
    <Suspense fallback={<WidgetSkeleton />}>
      <DeferredTutorSystems />
    </Suspense>
  );
};

export default TutorSystems;
