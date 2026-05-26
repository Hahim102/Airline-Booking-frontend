import { motion } from 'motion/react';
import { FLEET_DATA, OWNER_METRICS, SCHEDULING_DATA, CREW_DATA, CHART_DATA } from '../constants';
import { useAuth } from '../hooks/useAuth';
import OwnerMetricsCards from '../components/dashboard/OwnerMetricsCards';
import OwnerFleetTable from '../components/dashboard/OwnerFleetTable';
import OwnerRevenueChart from '../components/dashboard/OwnerRevenueChart';
import OwnerSchedulingSection from '../components/dashboard/OwnerSchedulingSection';
import OwnerCrewStatus from '../components/dashboard/OwnerCrewStatus';

export default function OwnerDashboard() {
    const { user } = useAuth();

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
        >
            <OwnerMetricsCards metrics={OWNER_METRICS} />

            <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <OwnerFleetTable fleet={FLEET_DATA} />
                <OwnerRevenueChart chartData={CHART_DATA} />
            </section>

            <section className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <OwnerSchedulingSection schedulingData={SCHEDULING_DATA} />
                <OwnerCrewStatus crew={CREW_DATA} />
            </section>
        </motion.div>
    );
}
