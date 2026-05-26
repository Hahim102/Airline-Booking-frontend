import { useState, useEffect } from 'react';
import { useAuth } from "./useAuth";
import { analyticsService } from '../api/analyticsService';

export function useManagerAnalytics() {
    const { isAuthenticated } = useAuth();

    const [summary, setSummary] = useState(null);
    const [registrationsByType, setRegistrationsByType] = useState({
        DAY: [],
        WEEK: [],
        MONTH: []
    });
    const [analyticsLoading, setAnalyticsLoading] = useState(true);
    const [analyticsError, setAnalyticsError] = useState(null);

    useEffect(() => {
        const fetchAnalytics = async () => {
            setAnalyticsLoading(true);
            setAnalyticsError(null);
            try {
                const [summaryData, dayData, weekData, monthData] = await Promise.all([
                    analyticsService.getSummary(),
                    analyticsService.getRegistrations('DAY'),
                    analyticsService.getRegistrations('WEEK'),
                    analyticsService.getRegistrations('MONTH')
                ]);
                setSummary(summaryData);
                setRegistrationsByType({
                    DAY: dayData || [],
                    WEEK: weekData || [],
                    MONTH: monthData || []
                });
            } catch (err) {
                console.error('Failed to fetch analytics:', err);
                setAnalyticsError('Failed to load analytics data');
            } finally {
                setAnalyticsLoading(false);
            }
        };

        fetchAnalytics();
    }, []);

    return {
        summary,
        registrationsByType,
        analyticsLoading,
        analyticsError
    };
}
