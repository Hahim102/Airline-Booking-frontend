export const USER_INFO = {
    name: "User Name",
    email: "user@example.com",
    phone: "+1 234 567 890",
    passport: "ABC123456",
    role: "user",
    avatar: "[lh3.googleusercontent.com](https://lh3.googleusercontent.com/aida-public/AB6AXuCidj928LXUwC5PCg6HKqL-0cIfLQgSRNfmdy-5g8Fu6VUWKThxpl9B1wgJZvG_xeEbWlYZBzxmItWCtltfOkszOobb-f3U8ZSpa8q52GdLuZS_wfGmT4aT3o-3XXBdeVtOtGarXtreeZyfGdmUTembvRRb72Uanas72r_wT0MfeF3_Ob4pd-7n5XZxveOPeGTwbXyGJ6EUfzDQX0NGYqfYvyF0tED4kx9nJ_5xZxti2Y5z8grFxHQbgSJsl4-j_-NpvvoyEZCPgf0)"
};


export const OWNER_INFO = {
    name: "Capt. Harrison Ford",
    role: "Fleet Owner",
    avatar: "[lh3.googleusercontent.com](https://lh3.googleusercontent.com/aida-public/AB6AXuBwC_PtjwTPXCVbCBvIyflZgUSlYtxcFHlCjK9ek6RuB3v6opY8v6qOqWzv817UrMrGE4dl-ee_6Xo7DzSKQbDkx0mKX1YOBMl8kiq0aYgb_wYdk5zY8oQoVF8PwgYD-e74eOs7I-S08OXLFInq8TgeDYzT0uNzD6rM5PDztMvUK2nKLep5Me9lBBg7TqCFoL0a6PpeKrug0UTYUArFd9lvSjx2ryc9zf4TPAr0ySf3BGRIMEtkuoU2MJY8BR5SgSr9fe8xhXGS5_0)"
};

export const MANAGER_INFO = {
    name: "Alex Morgan",
    role: "Senior Ops Manager",
    avatar: "[lh3.googleusercontent.com](https://lh3.googleusercontent.com/aida-public/AB6AXuAfNmZB4t_nETwsMq089--V39W7c2Bf9MPOkfF8Kj_jQZ-ku2AeY65lenz5o4kY8VJgoNkvp5C2v-8qMtvtN6vzjAUW5TfMHhFeFVFZV23SU5LBc2rDa1PaHgyQ2Nd8M_fDL2zZ6oLHHZYgxjtP8-Jnu3Seixb_StZ2ruxDr6rc6crTC3k78ANHSUHw6Ek1IaXLyjcK6EwzdHk2vMxjIRFYY2PU26xdOgO3qO89YBImpyvpNEyXUoxKVarOHk1aSpf-WGwKJHmV3Z8)"
};

export const OWNER_METRICS = [
    { label: "Total Aircrafts", value: "42", change: "+2 this month", changeType: "positive", icon: "Plane", trend: "up" },
    { label: "Active Flights", value: "18", change: "Live across all regions", changeType: "neutral", icon: "Radio" },
    { label: "Monthly Revenue", value: "$2.4M", change: "+12% vs last month", changeType: "positive", icon: "Wallet", trend: "up" },
    { label: "Occupancy Rate", value: "88%", icon: "Users" }
];

export const MANAGER_METRICS = [
    { label: "Total Flights", value: "1,284", change: "+12%", changeType: "positive", icon: "Plane", trend: "up" },
    { label: "Active Flights Today", value: "142", change: "Today", changeType: "neutral", icon: "Clock" },
    { label: "Total Bookings", value: "42,910", change: "+5.4%", changeType: "positive", icon: "Ticket", trend: "up" },
    { label: "Active Users", value: "8,432", change: "-2%", changeType: "negative", icon: "User", trend: "down" }
];

export const FLEET_DATA = [
    { tailNumber: "SK-4022", model: "Boeing 737-800", capacity: "189 Seats", status: "Active" },
    { tailNumber: "SK-9910", model: "Airbus A320neo", capacity: "165 Seats", status: "Maintenance" },
    { tailNumber: "SK-1288", model: "Boeing 787-9", capacity: "290 Seats", status: "Active" }
];

export const SCHEDULING_DATA = [
    { id: "SK-104", routeFrom: "NYC", routeTo: "LON", dateTime: "22:30 • Gate B12", status: "Boarding", aircraft: "Boeing 787" },
    { id: "SK-221", routeFrom: "PAR", routeTo: "BER", dateTime: "08:15 • Gate A04", status: "Scheduled", aircraft: "Airbus A320" }
];

export const FLIGHT_MANAGEMENT_DATA = [
    { id: "SK-402", routeFrom: "LHR", routeTo: "JFK", dateTime: "Oct 24, 14:30", status: "Scheduled" },
    { id: "SK-119", routeFrom: "DXB", routeTo: "SIN", dateTime: "Oct 24, 16:45", status: "Delayed" },
    { id: "SK-982", routeFrom: "CDG", routeTo: "HND", dateTime: "Oct 25, 09:15", status: "Cancelled" }
];

export const CREW_DATA = [
    { id: "1", name: "Capt. Elena Vance", role: "Pilot", status: "AVAILABLE", avatar: "[lh3.googleusercontent.com](https://lh3.googleusercontent.com/aida-public/AB6AXuCNtxByyZdzK0ArjlUNt8_40f4zBBpynG4yzx_zGUXWLJOwghpbQgJE_RFaSIsXSc5myTiIPXbMxMzZZcXa60pyGuruXrSet2mDafuC9zV_z43VKib-jxkQ0y1bSm8BU85EKeNolnVjRIYxrP9uBRBIAEZWmcWVkFWocHKLbvGh68pmHv_kCYjpvcnvxi6Jr-3qT9gGrjaE0mWs8s5iNHAUCjyYJAAur3715LKaBcC2lvr2Am-N9vcRma4V7APyq0iV-WEV0vqtLOk)" },
    { id: "2", name: "Marcus Thorne", role: "Cabin Crew", status: "ON FLIGHT", flightId: "SK-104", avatar: "[lh3.googleusercontent.com](https://lh3.googleusercontent.com/aida-public/AB6AXuAlmiNGu79HT1SbnslGfcniahhjCJdHvuS8oTnkRlhImu0WcEbK8YOHzQrlHwcMY501Cd6iLCq_CYnQQkfKE4AVmJXz8tJH8OaujXvnLr3DR3RgiIoXdaZYI3jbNyzcKQZK3rJOhc4T_POoCnDzd4KJ9fx7o5cgz00GOd1viLLSnu7iiMFTz4-FondOBYw5Vgsog3RWfmw2Ku3kTe3Xpo3dNRV5s8ye73zTutx6y2Wx8UQrpCV8afhRfIiAEmS3CfCqwjKUY0Tlies)" },
    { id: "3", name: "Sarah Jenkins", role: "Cabin Crew", status: "AVAILABLE", avatar: "[lh3.googleusercontent.com](https://lh3.googleusercontent.com/aida-public/AB6AXuCqHCqMZLSCB1svVpBr-hQeiBUgOXi4igSI8Lv2q_b-aUrcWeeEsTk6wsqd1eNi-udmAqv0qzyecXM8uhC9vqDxsnZs5x1mblDa_9do0QkwOU7zqDpsZGHWwgjPqfnf9N-piZZrYJ6UmXThq8cr3gT7dbpawGwlGC2SCnG9N0V-zq5xx-AdpnTDTKLaPAxRsMmGPWJsy1FrH3QZLtiFwTCRbVNHix_ajCUft4vtk7RNO8r1wuQ5lpcfviNfnFIMMTKcXroQkWhL1jA)" }
];

export const RECENT_BOOKINGS = [
    { id: "1", userName: "Jane Doe", userInitials: "JD", flightId: "SK-402", tier: "Business Class", status: "CONFIRMED" },
    { id: "2", userName: "Marcus Reid", userInitials: "MR", flightId: "SK-119", tier: "Economy", status: "PENDING" },
    { id: "3", userName: "Sarah Lim", userInitials: "SL", flightId: "SK-982", tier: "First Class", status: "REFUNDED" }
];

export const USER_MANAGEMENT_DATA = [
    { id: "88210", name: "Elena Vance", email: "elena@skystream.com", phone: "", passport: "", avatar: "[lh3.googleusercontent.com](https://lh3.googleusercontent.com/aida-public/AB6AXuBHDLdrexMcNLicwRmlTOQ-yqFKayIIlaObo9gd_TETTcJvH4MwmI3d544tL1WjyXWUMnB1Qcz9vhYKf2odr4kg4fznCp9lDAaMS63FtEh2a8vkiY1--q79nz3KYsZRk4vEpfCBt7gTojoc5FMwEoXMmSBsY84cpZXVh9Z50GkXfSAZ9-xaYMXQM8CiPpardRvY53OZChgFMVjCcYTC6Nir4C1fH7KVtS2UhdGburZc1VCvov6BgInvGbLSSUXf6Jt53C5cKcGITHw)", active: true },
    { id: "88211", name: "David Chen", email: "david@skystream.com", phone: "", passport: "", avatar: "[lh3.googleusercontent.com](https://lh3.googleusercontent.com/aida-public/AB6AXuA6XFCNDz4EhMtPFAbG-CB6iUSqlLn3Mx-DZIVJxzfXefEffE8C6wwnkwJ2j5yXqURUbuxHfPpAnQas5bOl18ePy9hGyuLlTBshfMXjU8AjsWScLo_GwWkj7ouTM_Mi6858o5jjXYuuAKhkEJ4gwn8752Oln3N6ikcB8_709RsMROLopOyKDgtZZIMQsZezdLv_okj3b59HPrl1uwXR0pky6F34M5hsERtN_cNwrT67W-ZSVS6KDEnTNUEkxFz2dCSWpRxOd7bwNtM)", active: true },
    { id: "88212", name: "Alex Turner", email: "alex@skystream.com", phone: "", passport: "", avatar: "[lh3.googleusercontent.com](https://lh3.googleusercontent.com/aida-public/AB6AXuBtdUheamcDLiObWTmxQejdYAfGk4MJ4Cs_o1eT5CsWEqUSBQtZnJX1PuHEplfA0FUAtXUJfrJ6y6mUyO1MrhQa7NM9boPv-Ev0RB_qXPLfhi0sQMFXI6lxgqCk7D7aaG1RqBY6HGlKhmwxZUkjYKrj3ajZL8NN6o7sZgPU2ibiROQ3YJYR2AtYSPEZOw74BNDIDy1AtcwtgOHIcW2bWwr13TgeJ2_YpxgU0t0xrZDCP-3wDTmiVJ3PDh_EN5l1XHYpI7cPCEOKtd4)", active: false }
];

export const CHART_DATA = [
    { name: 'Mon', value: 400 },
    { name: 'Tue', value: 300 },
    { name: 'Wed', value: 600 },
    { name: 'Thu', value: 800 },
    { name: 'Fri', value: 500 },
    { name: 'Sat', value: 900 },
    { name: 'Sun', value: 450 },
];
