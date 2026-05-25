import React, { useEffect, useState } from 'react';
import axios from 'axios';

const DeferredAnalytics = () => {
  const [analyticsData, setAnalyticsData] = useState({});

  useEffect(() => {
    const fetchAnalyticsData = async () => {
      const response = await axios.get('/api/analytics');
      const data = await response.data;
      setAnalyticsData(data);
    };

    fetchAnalyticsData();
  }, []);

  return (
    <div>
      {analyticsData && (
        <div>
          <h2>Analytics</h2>
          <p>{analyticsData.summary}</p>
        </div>
      )}
    </div>
  );
};

export default DeferredAnalytics;
