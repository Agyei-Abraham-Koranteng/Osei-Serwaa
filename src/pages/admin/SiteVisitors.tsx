import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/lib/supabase';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Loader2, Users, Smartphone, Monitor, Globe } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface DailyVisitor {
    date: string;
    count: number;
}

interface VisitorLog {
    id: number;
    user_agent: string;
    browser: string;
    device_type: string;
    os: string;
    visited_at: string;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const SiteVisitors = () => {
    const [loading, setLoading] = useState(true);
    const [dailyData, setDailyData] = useState<DailyVisitor[]>([]);
    const [visitorLogs, setVisitorLogs] = useState<VisitorLog[]>([]);
    const [totalVisitors, setTotalVisitors] = useState(0);
    const [deviceStats, setDeviceStats] = useState<{ name: string; value: number }[]>([]);
    const [browserStats, setBrowserStats] = useState<{ name: string; value: number }[]>([]);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);

            // Fetch daily visitors
            const { data: dailyRes } = await supabase
                .from('daily_visitors')
                .select('date, count')
                .order('date', { ascending: true })
                .limit(30);

            if (dailyRes) {
                const formattedData = dailyRes.map(item => ({
                    ...item,
                    date: new Date(item.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
                }));
                setDailyData(formattedData);
            }

            // Fetch visitor logs
            const { data: logsRes } = await supabase
                .from('visitor_logs')
                .select('*')
                .order('visited_at', { ascending: false })
                .limit(50);

            if (logsRes) {
                setVisitorLogs(logsRes);

                // Process stats from logs (client-side aggregation for now)
                // In a real app with millions of rows, you'd use SQL aggregation
                const devices: Record<string, number> = {};
                const browsers: Record<string, number> = {};

                logsRes.forEach(log => {
                    const device = log.device_type || 'Desktop';
                    const browser = log.browser || 'Unknown';
                    devices[device] = (devices[device] || 0) + 1;
                    browsers[browser] = (browsers[browser] || 0) + 1;
                });

                setDeviceStats(Object.entries(devices).map(([name, value]) => ({ name, value })));
                setBrowserStats(Object.entries(browsers).map(([name, value]) => ({ name, value })));
            }

            // Fetch Total Visitors
            const { data: legacyData } = await supabase
                .from('site_content')
                .select('value')
                .eq('key', 'site_visitors')
                .single();

            if (legacyData?.value?.count) {
                setTotalVisitors(legacyData.value.count);
            } else if (dailyRes) {
                const sum = dailyRes.reduce((acc, curr) => acc + curr.count, 0);
                setTotalVisitors(sum);
            }

        } catch (error) {
            console.error('Error fetching visitor stats:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-fade-in pb-10">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">Site Analytics</h1>
            </div>

            {/* Summary Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Visits</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalVisitors}</div>
                        <p className="text-xs text-muted-foreground">All time recorded visits</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Top Device</CardTitle>
                        <Smartphone className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {deviceStats.sort((a, b) => b.value - a.value)[0]?.name || 'N/A'}
                        </div>
                        <p className="text-xs text-muted-foreground">Most popular device type</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Top Browser</CardTitle>
                        <Globe className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {browserStats.sort((a, b) => b.value - a.value)[0]?.name || 'N/A'}
                        </div>
                        <p className="text-xs text-muted-foreground">Most used browser</p>
                    </CardContent>
                </Card>
            </div>

            {/* Charts Row */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4">
                    <CardHeader>
                        <CardTitle>Daily Visitors (Last 30 Days)</CardTitle>
                    </CardHeader>
                    <CardContent className="pl-2">
                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={dailyData}>
                                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                                    <XAxis dataKey="date" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                                    <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: 'var(--background)', borderColor: 'var(--border)' }}
                                        itemStyle={{ color: 'var(--foreground)' }}
                                        cursor={{ fill: 'var(--muted)', opacity: 0.2 }}
                                    />
                                    <Bar dataKey="count" fill="currentColor" radius={[4, 4, 0, 0]} className="fill-primary" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                <Card className="col-span-3">
                    <CardHeader>
                        <CardTitle>Device Distribution</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[300px] w-full flex items-center justify-center">
                            {deviceStats.length > 0 ? (
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={deviceStats}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={60}
                                            outerRadius={80}
                                            fill="#8884d8"
                                            paddingAngle={5}
                                            dataKey="value"
                                        >
                                            {deviceStats.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                    </PieChart>
                                </ResponsiveContainer>
                            ) : (
                                <div className="text-muted-foreground">No data available</div>
                            )}
                        </div>
                        <div className="flex justify-center gap-4 text-sm">
                            {deviceStats.map((entry, index) => (
                                <div key={entry.name} className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                                    <span>{entry.name}</span>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Recent Visitors Table */}
            <Card>
                <CardHeader>
                    <CardTitle>Recent Visitors</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Date & Time</TableHead>
                                <TableHead>Device</TableHead>
                                <TableHead>Browser</TableHead>
                                <TableHead>OS</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {visitorLogs.map((log) => (
                                <TableRow key={log.id}>
                                    <TableCell>{new Date(log.visited_at).toLocaleString()}</TableCell>
                                    <TableCell className="flex items-center gap-2">
                                        {log.device_type === 'Mobile' ? <Smartphone className="h-4 w-4" /> : <Monitor className="h-4 w-4" />}
                                        {log.device_type || 'Desktop'}
                                    </TableCell>
                                    <TableCell>{log.browser || 'Unknown'}</TableCell>
                                    <TableCell>{log.os || 'Unknown'}</TableCell>
                                </TableRow>
                            ))}
                            {visitorLogs.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={4} className="text-center text-muted-foreground py-8">
                                        No visitor logs found yet.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
};

export default SiteVisitors;
