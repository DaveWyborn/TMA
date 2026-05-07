# TMA SEO Platform Roadmap
## From Beta Tools to Agency-Ready Platform

---

## Vision

Build a white-label SEO platform that serves two markets:
1. **Direct clients (B2C):** Small businesses at £49-299/month
2. **SEO agencies (B2B):** White-label platform at £300-1000/month

---

## Phase 1: Foundation - Setup & Launch (Week 1-2) ✅ IN PROGRESS

**Goal:** Get current tools production-ready and earning revenue

### Tasks
- [x] Build 4 SEO tools (Meta Checker, Keyword Analyser, Page Speed, Robots Checker)
- [x] Add recommendations and share functionality
- [x] Build successful
- [ ] Set up Google PageSpeed API key (CRITICAL)
- [ ] Set up Gmail email notifications (optional)
- [ ] Verify Supabase table (`tma_shared_results`)
- [ ] Deploy to production
- [ ] Test all tools with Excalibur Auctions
- [ ] Test Share Results flow end-to-end

### Revenue Impact
- Immediate value to 2 existing £150/month clients
- Reduce churn risk
- Foundation for upsells

**Timeline:** Complete by end of Week 2

---

## Phase 1.5: Client Meeting Automation (Week 2-3)

**Goal:** Shift meeting scheduling burden to clients whilst framing as convenience

### Current Problem
- Manually calling/emailing each client monthly to arrange meetings
- Time-consuming and doesn't scale beyond 2 clients
- Puts pressure on you to chase

### New System
- Monthly "Book your monthly review" email with calendar link
- Clients book or ignore - only follow up if 2+ months missed
- Monthly report still sent with summary/actions regardless
- Calendar link also in portal for easy access

### Why This Works
- Positions as client convenience ("Book when suits you")
- Filters engaged vs disengaged clients automatically
- Maintains touchpoint via report even if no meeting
- Scales to 20+ clients with zero additional effort

---

### 1.5.1 Unified Calendar System (Week 2)

**Problem:** Multiple Google calendars (personal, work, TMA, Cookiechest) = double-booking risk

**Solution:** Multi-calendar sync + auto-blocking

**Architecture:**
```typescript
// Approach: Local sync service using Google Calendar API
// Runs on your machine or VPS, syncs every 5 mins

// Tech stack options:
// Option A: Local Llama + custom Node.js script
// Option B: Simple Node.js with Google Calendar API only
// Option C: n8n workflow (visual automation)

// Recommended: Option B (simplest, most reliable)

// Calendar sync flow:
1. Monitor "source" calendars (personal, work, Cookiechest)
2. When event created → create "BUSY" block on other calendars
3. When event deleted → remove blocks
4. Mark blocks as "Auto-blocked by TMA Calendar Sync"
```

**Implementation:**
```typescript
// lib/calendar-sync.ts
import { google } from 'googleapis';

const calendar = google.calendar('v3');

const CALENDARS = [
  { id: 'personal@gmail.com', type: 'personal' },
  { id: 'work@gmail.com', type: 'work' },
  { id: 'tma@gmail.com', type: 'tma' },
  { id: 'cookiechest@workspace.google.com', type: 'cookiechest' }
];

async function syncCalendars() {
  // 1. Fetch all events from all calendars (next 90 days)
  const allEvents = await Promise.all(
    CALENDARS.map(cal => getCalendarEvents(cal.id))
  );

  // 2. For each event, check if blocking events exist on other calendars
  for (const cal of CALENDARS) {
    const otherCalendars = CALENDARS.filter(c => c.id !== cal.id);
    const events = allEvents.find(e => e.calendarId === cal.id);

    for (const event of events) {
      // Create/update blocks on other calendars
      await createBlockingEvents(event, otherCalendars);
    }
  }
}

async function createBlockingEvents(sourceEvent, targetCalendars) {
  const blockEvent = {
    summary: `[BLOCKED] ${sourceEvent.summary}`,
    start: sourceEvent.start,
    end: sourceEvent.end,
    description: `Auto-blocked by TMA Calendar Sync\nSource: ${sourceEvent.calendar}`,
    transparency: 'opaque', // Shows as busy
    colorId: '8' // Gray
  };

  for (const targetCal of targetCalendars) {
    // Check if block already exists
    const existingBlock = await findExistingBlock(
      targetCal.id,
      sourceEvent.id
    );

    if (!existingBlock) {
      await calendar.events.insert({
        calendarId: targetCal.id,
        resource: blockEvent
      });
    }
  }
}

// Run every 5 minutes
setInterval(syncCalendars, 5 * 60 * 1000);
```

**Deployment Options:**
1. **Local machine:** Run as background service (PM2/systemd)
2. **VPS:** £3-5/month DigitalOcean droplet
3. **Vercel Cron:** Free tier, runs every 5 mins
4. **Railway/Render:** Free tier with cron jobs

**Tasks:**
- [ ] Set up Google Calendar API credentials (OAuth 2.0)
- [ ] Build calendar sync script
- [ ] Test with 2 calendars first
- [ ] Add error handling and logging
- [ ] Deploy to VPS or Vercel Cron
- [ ] Add health check/monitoring
- [ ] Document calendar setup for future calendars

**Cost:** £0-5/month (VPS if needed, otherwise free)

---

### 1.5.2 Meeting Booking Database (Week 2)

**Database schema:**
```typescript
// Supabase table: tma_client_meetings
client_meetings (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id), -- When auth exists
  client_email TEXT NOT NULL, -- Before auth exists
  client_name TEXT,
  meeting_type TEXT, -- 'monthly_review', 'onboarding', 'adhoc'
  scheduled_at TIMESTAMP NOT NULL,
  duration_mins INT DEFAULT 30,
  google_calendar_event_id TEXT, -- For cancellations
  calendar_id TEXT, -- Which calendar it's on (TMA calendar)
  status TEXT DEFAULT 'scheduled', -- 'scheduled', 'completed', 'cancelled', 'no_show'
  month_year TEXT, -- '2025-01' for tracking frequency
  booking_notes TEXT,
  created_at TIMESTAMP DEFAULT NOW()
)

// Index for frequency checking
CREATE INDEX idx_client_meetings_frequency
ON client_meetings(client_email, month_year, status);

// Supabase table: tma_meeting_notifications
meeting_notifications (
  id UUID PRIMARY KEY,
  client_email TEXT NOT NULL,
  notification_type TEXT, -- 'monthly_invite', 'reminder_24h', 'admin_double_booking'
  sent_at TIMESTAMP DEFAULT NOW(),
  month_year TEXT, -- '2025-01'
  opened_at TIMESTAMP, -- Email tracking
  clicked_at TIMESTAMP, -- Calendar link clicked
  meeting_id UUID REFERENCES client_meetings(id) -- NULL for invites, set when booked
)

// Index for preventing duplicate invites
CREATE INDEX idx_meeting_notifications_monthly
ON meeting_notifications(client_email, month_year, notification_type);
```

**Booking frequency logic:**
```typescript
// API route: /api/meetings/check-availability
export async function POST(req: NextRequest) {
  const { clientEmail, proposedDate } = await req.json();

  // Check how many meetings this month
  const monthYear = proposedDate.substring(0, 7); // '2025-01'

  const { data: existingMeetings } = await supabase
    .from('client_meetings')
    .select('*')
    .eq('client_email', clientEmail)
    .eq('month_year', monthYear)
    .neq('status', 'cancelled');

  const response = {
    allowed: true,
    count: existingMeetings.length,
    warning: null
  };

  if (existingMeetings.length >= 1) {
    // Notify admin but still allow booking
    response.warning = 'second_meeting_this_month';
    await notifyAdminDoubleBooking(clientEmail, existingMeetings[0]);
  }

  return NextResponse.json(response);
}

async function notifyAdminDoubleBooking(clientEmail, firstMeeting) {
  await supabase.from('meeting_notifications').insert({
    client_email: clientEmail,
    notification_type: 'admin_double_booking',
    meeting_id: firstMeeting.id
  });

  // Send email/Slack notification to you
  await sendEmail({
    to: 'dave@tailormadeanalytics.com',
    subject: `Double booking alert: ${clientEmail}`,
    body: `${clientEmail} has booked a second meeting this month.
    First: ${firstMeeting.scheduled_at}
    Check if intentional or if they need help.`
  });
}
```

**Tasks:**
- [ ] Create Supabase tables
- [ ] Build availability checking logic
- [ ] Add double-booking notification system
- [ ] Create admin view to see all meetings
- [ ] Add meeting history per client

---

### 1.5.3 Monthly Email Automation (Week 3)

**Email flow:**

**Week 1 of month:** Send "Book your monthly review" email
```typescript
// Subject: Book your January SEO review call

Hi [Client Name],

Your January SEO report is ready. Let's review your progress and discuss next steps.

**[Book Your 30min Call]** → [Calendar Link]

Can't find a time that works? Reply to this email.

If you'd prefer to skip this month's call, no problem - I'll send your written report on [last day of month].

Best,
Dave
```

**Email template variables:**
- Client name
- Month name
- Calendar booking link (unique per client? or shared TMA calendar?)
- Monthly report date (last working day of month)

**Tech:**
- Resend.com (free tier: 3,000 emails/month) or nodemailer
- Cron job: 1st of each month at 9am
- Email tracking: Open rates, click rates

**Implementation:**
```typescript
// API route: /api/cron/monthly-meeting-invites
// Vercel Cron: 0 9 1 * * (9am on 1st of month)

export async function GET(req: NextRequest) {
  // Security: Check cron secret
  const authHeader = req.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response('Unauthorized', { status: 401 });
  }

  const monthYear = new Date().toISOString().substring(0, 7);

  // Get all active clients
  const { data: clients } = await supabase
    .from('user_subscriptions')
    .select('user_id, users(email, name)')
    .eq('status', 'active');

  for (const client of clients) {
    // Check if already sent this month
    const { data: existing } = await supabase
      .from('meeting_notifications')
      .select('id')
      .eq('client_email', client.users.email)
      .eq('month_year', monthYear)
      .eq('notification_type', 'monthly_invite')
      .single();

    if (existing) continue; // Already sent

    // Send email
    await sendMonthlyInvite(client.users.email, client.users.name);

    // Log notification
    await supabase.from('meeting_notifications').insert({
      client_email: client.users.email,
      notification_type: 'monthly_invite',
      month_year: monthYear
    });
  }

  return NextResponse.json({ sent: clients.length });
}

async function sendMonthlyInvite(email: string, name: string) {
  const month = new Date().toLocaleDateString('en-GB', { month: 'long' });

  await resend.emails.send({
    from: 'Dave at TMA <dave@tailormadeanalytics.com>',
    to: email,
    subject: `Book your ${month} SEO review call`,
    html: `
      <p>Hi ${name},</p>
      <p>Your ${month} SEO report is ready. Let's review your progress and discuss next steps.</p>
      <p><a href="${process.env.NEXT_PUBLIC_BOOKING_LINK}?client=${email}">Book Your 30min Call</a></p>
      <p>Can't find a time? Reply to this email.</p>
      <p>If you'd prefer to skip this month's call, no problem - I'll send your written report on [last working day].</p>
      <p>Best,<br>Dave</p>
    `
  });
}
```

**Booking link options:**

**Option A: Single shared TMA calendar link**
- Simplest: Use Calendly or Google Calendar appointment slots
- Everyone books same link
- Disadvantage: Can't track which client in database automatically

**Option B: Unique booking links per client**
- Generate unique token per client
- Link: `https://tma.com/book-meeting?token=abc123`
- Auto-fills client info when they book
- Advantage: Tracks who booked automatically

**Recommended: Option B** (better tracking, more professional)

**Tasks:**
- [ ] Choose email provider (Resend or nodemailer)
- [ ] Create email template
- [ ] Build monthly invite cron job
- [ ] Set up Vercel Cron or alternative
- [ ] Add email tracking (open/click rates)
- [ ] Generate unique booking links per client
- [ ] Test with your own email first

---

### 1.5.4 Booking Integration (Week 3)

**Public booking page:**
```typescript
// /src/app/book-meeting/page.tsx

export default function BookMeetingPage({
  searchParams
}: {
  searchParams: { token?: string }
}) {
  const [clientInfo, setClientInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Validate token and fetch client info
    if (searchParams.token) {
      fetch(`/api/meetings/validate-token?token=${searchParams.token}`)
        .then(res => res.json())
        .then(data => {
          setClientInfo(data.client);
          setLoading(false);
        });
    }
  }, [searchParams.token]);

  if (loading) return <div>Loading...</div>;
  if (!clientInfo) return <div>Invalid booking link</div>;

  return (
    <div>
      <h1>Book Your Monthly Review - {clientInfo.name}</h1>

      {/* Embed Google Calendar appointment slots or Calendly */}
      <iframe
        src={`https://calendar.google.com/calendar/appointments/schedules/...?prefill_email=${clientInfo.email}`}
        width="100%"
        height="600px"
      />

      {/* Or build custom calendar picker */}
      <CalendarPicker
        clientEmail={clientInfo.email}
        onBookingConfirmed={handleBookingConfirmed}
      />
    </div>
  );
}

async function handleBookingConfirmed(booking) {
  // 1. Create Google Calendar event
  const calendarEvent = await createGoogleCalendarEvent({
    summary: `Monthly Review - ${booking.clientName}`,
    start: booking.datetime,
    end: addMinutes(booking.datetime, 30),
    attendees: [{ email: booking.clientEmail }],
    description: 'Monthly SEO performance review'
  });

  // 2. Save to database
  await supabase.from('client_meetings').insert({
    client_email: booking.clientEmail,
    client_name: booking.clientName,
    meeting_type: 'monthly_review',
    scheduled_at: booking.datetime,
    duration_mins: 30,
    google_calendar_event_id: calendarEvent.id,
    calendar_id: 'tma@gmail.com',
    month_year: booking.datetime.substring(0, 7),
    status: 'scheduled'
  });

  // 3. Check frequency and notify if needed
  await checkBookingFrequency(booking.clientEmail, booking.datetime);

  // 4. Send confirmation email to client
  await sendBookingConfirmation(booking);
}
```

**Integration choices:**

**Option A: Google Calendar Appointment Slots (FREE)**
- Pros: Native Google integration, auto-adds to calendar, free
- Cons: Limited customization, Google branding
- Best for: Quick MVP

**Option B: Calendly Free Tier (FREE)**
- Pros: Professional, customizable, includes reminders
- Cons: Calendly branding on free tier, need to sync to database
- Best for: Better UX, minimal dev

**Option C: Custom booking system (FULL CONTROL)**
- Pros: Complete control, branded, tracks everything
- Cons: More dev time, need to handle edge cases
- Best for: When you have Phase 2 auth system in place

**Recommended: Option B for now, move to Option C in Phase 2**

**Tasks:**
- [ ] Set up booking link system (tokens in database)
- [ ] Build booking validation API
- [ ] Create booking page UI
- [ ] Integrate with Google Calendar API or Calendly
- [ ] Add booking confirmation flow
- [ ] Send confirmation emails
- [ ] Add meeting reminder emails (24h before)
- [ ] Add "Add to Calendar" links in confirmation

---

### 1.5.5 Portal Integration (Week 3 - After Phase 2 Auth)

**Feature:** "Book a Meeting" button in client portal

**Location:** Dashboard navbar or sidebar

**Implementation:**
```typescript
// /src/components/dashboard/BookMeetingButton.tsx

export function BookMeetingButton({ user }) {
  const [recentMeetings, setRecentMeetings] = useState([]);

  useEffect(() => {
    // Fetch recent meetings
    fetch(`/api/meetings/user/${user.id}`)
      .then(res => res.json())
      .then(data => setRecentMeetings(data.meetings));
  }, [user.id]);

  const upcomingMeeting = recentMeetings.find(
    m => m.status === 'scheduled' && new Date(m.scheduled_at) > new Date()
  );

  return (
    <div className="border rounded-lg p-4">
      {upcomingMeeting ? (
        <div>
          <h3>Your Next Review</h3>
          <p>{format(upcomingMeeting.scheduled_at, 'PPP')}</p>
          <p>{format(upcomingMeeting.scheduled_at, 'p')}</p>
          <button onClick={() => addToCalendar(upcomingMeeting)}>
            Add to Calendar
          </button>
        </div>
      ) : (
        <div>
          <h3>Monthly Review</h3>
          <p>Book your next SEO review call</p>
          <button onClick={() => router.push('/book-meeting')}>
            Book a Time
          </button>
        </div>
      )}
    </div>
  );
}
```

**Tasks:**
- [ ] Add "Book Meeting" section to dashboard (Phase 2)
- [ ] Show upcoming meeting if scheduled
- [ ] Show "Book now" button if no meeting scheduled
- [ ] Display meeting history
- [ ] Add reschedule/cancel functionality

---

### 1.5.6 Admin Dashboard (Week 3)

**Feature:** View all client meetings in one place

**Admin views:**

**1. Calendar view**
- All upcoming meetings across all clients
- Month view with meeting density
- Filter by client/month

**2. Client meeting history**
- List all clients with meeting frequency
- Flag clients who haven't booked in 2+ months
- Average meetings per client

**3. Engagement metrics**
- Email open rates
- Booking link click rates
- Meetings booked vs invited
- No-show rate

**Implementation:**
```typescript
// /src/app/admin/meetings/page.tsx (admin only)

export default function AdminMeetingsPage() {
  return (
    <div>
      <h1>Client Meetings</h1>

      {/* Stats cards */}
      <div className="grid grid-cols-4 gap-4">
        <StatsCard title="This Month" value={12} />
        <StatsCard title="Pending Bookings" value={3} />
        <StatsCard title="Avg/Client/Month" value={0.85} />
        <StatsCard title="No-Show Rate" value="5%" />
      </div>

      {/* Calendar view */}
      <MeetingsCalendar />

      {/* Client list with engagement */}
      <ClientMeetingList />
    </div>
  );
}

function ClientMeetingList() {
  const { data: clients } = useSWR('/api/admin/client-engagement');

  return (
    <table>
      <thead>
        <tr>
          <th>Client</th>
          <th>Last Meeting</th>
          <th>Meetings (3mo)</th>
          <th>Next Scheduled</th>
          <th>Email Opens</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        {clients?.map(client => (
          <tr key={client.id}>
            <td>{client.name}</td>
            <td>{format(client.lastMeeting, 'PP')}</td>
            <td>{client.meetingsLast3Months}</td>
            <td>
              {client.nextMeeting
                ? format(client.nextMeeting, 'PP')
                : '—'
              }
            </td>
            <td>{client.emailOpenRate}%</td>
            <td>
              {client.monthsSinceLastMeeting >= 2 && (
                <Badge variant="warning">Follow up needed</Badge>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
```

**Tasks:**
- [ ] Build admin meeting calendar view
- [ ] Create client engagement dashboard
- [ ] Add alerts for clients missing 2+ months
- [ ] Build email analytics view
- [ ] Add export to CSV functionality

---

### Deliverable: Automated Meeting System v1

**Client experience:**
- Monthly email: "Book your review call"
- Click calendar link → book time that suits them
- Auto-confirmation + reminders
- Optional: Book via portal dashboard
- Monthly report sent regardless

**Your experience:**
- Zero manual outreach needed
- All calendars auto-synced (no double bookings)
- Notifications only for double-bookings or 2+ months missed
- Admin dashboard shows engagement at a glance
- Scales to 20+ clients with no additional effort

**Success metrics:**
- Booking rate >70% (7 out of 10 clients book per month)
- Zero double-bookings across calendars
- <5min/month admin time (vs current ~2hr/month)
- Client feedback: "Love the flexibility"

---

### Technical Stack Summary

**Calendar sync:**
- Google Calendar API
- Node.js sync script (5min intervals)
- Deployment: VPS or Vercel Cron

**Database:**
- Supabase tables: `client_meetings`, `meeting_notifications`
- Indexes for frequency checking

**Email:**
- Resend.com (free tier) or nodemailer
- Email tracking via Resend

**Booking:**
- Phase 1.5: Calendly or Google Calendar Appointments
- Phase 2: Custom booking system with NextAuth

**Cost:** £0-5/month (£0 if using Vercel Cron, £5 if using VPS)

---

### Migration Plan

**Week 2 tasks (calendar + database):**
1. Set up calendar sync script
2. Test with 2 calendars
3. Deploy to Vercel Cron
4. Create Supabase tables
5. Build booking token system

**Week 3 tasks (email + booking):**
1. Set up Resend account
2. Build email templates
3. Create monthly invite cron job
4. Set up Calendly or Google Calendar booking
5. Build booking confirmation flow
6. Test with yourself + 1 friendly client

**Transition from current system:**
- Send one final manual invite: "New automated booking system launching next month"
- Start automated emails from February 1st
- Keep manual follow-up process for first month as backup
- Review engagement metrics after Month 1, adjust as needed

---

## Phase 2: Client Dashboard (Week 3-6)

**Goal:** Replace Looker Studio dashboards with custom dashboard showing GSC data

### Why This Matters
- Current bottleneck: Manual Looker Studio configuration (hours per client)
- Scalability blocker: Can't onboard new clients efficiently
- Client value: Rarely look at Looker Studio, need something engaging

### Features

#### 2.1 Authentication System (Week 3)
**Tech stack:** NextAuth.js + Supabase (free)

```typescript
// User roles
- 'client' - Individual business client
- 'agency' - Agency account (future)
- 'admin' - TMA admin

// Database schema
users (
  id UUID PRIMARY KEY,
  email TEXT UNIQUE,
  name TEXT,
  role TEXT DEFAULT 'client',
  created_at TIMESTAMP
)

user_subscriptions (
  user_id UUID PRIMARY KEY,
  plan_name TEXT, -- 'free', 'starter', 'pro', 'enterprise'
  status TEXT, -- 'active', 'cancelled', 'expired'
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  current_period_end TIMESTAMP,
  created_at TIMESTAMP
)

user_properties (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  property_type TEXT, -- 'gsc', 'ga4'
  property_id TEXT,
  property_name TEXT,
  access_token_encrypted TEXT,
  refresh_token_encrypted TEXT,
  token_expires_at TIMESTAMP,
  connected_at TIMESTAMP
)
```

**Tasks:**
- [ ] Install NextAuth.js
- [ ] Set up Google OAuth (for GSC access)
- [ ] Create login/signup pages
- [ ] Build user dashboard shell
- [ ] Add property connection flow

**Cost:** Free (NextAuth.js + Supabase free tier)

#### 2.2 Google Search Console Integration (Week 4)
**API:** Google Search Console API (FREE)

**What clients see:**
- Total clicks, impressions, CTR, average position
- Top 20 performing pages
- Top 20 search queries
- Position changes (trending up/down)
- Click-through rate by position
- Mobile vs desktop performance
- Country breakdown

**Implementation:**
```typescript
// API Route: /api/gsc/overview
export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  const property = await getUserProperty(session.user.id, 'gsc');

  // Refresh OAuth token if needed
  const accessToken = await refreshGSCToken(property);

  // Fetch last 28 days
  const data = await fetch('https://www.googleapis.com/webmasters/v3/sites/{siteUrl}/searchAnalytics/query', {
    method: 'POST',
    headers: { Authorization: `Bearer ${accessToken}` },
    body: JSON.stringify({
      startDate: '28daysAgo',
      endDate: 'today',
      dimensions: ['query', 'page', 'device', 'country']
    })
  });

  return NextResponse.json(processGSCData(data));
}
```

**Tasks:**
- [ ] Implement GSC OAuth flow
- [ ] Build token refresh logic
- [ ] Create API routes for GSC data
- [ ] Build dashboard UI components
- [ ] Add date range selector (7d, 28d, 3m, 12m)
- [ ] Add comparison mode (period vs previous period)

**Cost:** Free

#### 2.3 Dashboard UI (Week 5)
**Tech stack:** Next.js + Tailwind + Recharts/Chart.js

**Components:**
- Overview cards (clicks, impressions, CTR, position)
- Line chart: Clicks/impressions over time
- Table: Top pages with sparklines
- Table: Top queries with position changes
- Device breakdown pie chart
- Country breakdown table

**Design notes:**
- Dark theme to match existing tools
- Mobile responsive
- Export to PDF button (future)
- Share dashboard link (future)

**Tasks:**
- [ ] Build dashboard layout
- [ ] Create reusable chart components
- [ ] Implement data visualisations
- [ ] Add loading states and error handling
- [ ] Mobile responsive design

#### 2.4 Multi-Property Support (Week 6)
**Feature:** Clients can connect multiple GSC properties

**Use case:**
- Client has multiple websites
- Client has multiple subdomains
- Agency managing multiple client sites (Phase 4)

**UI:**
- Property switcher dropdown in navbar
- "Add Property" button
- Property management page

**Tasks:**
- [ ] Build property switcher
- [ ] Add property management UI
- [ ] Update all API routes to filter by selected property
- [ ] Store selected property in session

### Deliverable: Client Dashboard v1
- Clients log in with Google
- Connect their GSC property
- See ranking/traffic data in clean dashboard
- Switch between properties (if multiple)

**Revenue Impact:**
- Increase value to existing clients (justify £150/month)
- Ability to onboard new clients in minutes (not hours)
- Upsell opportunity: "Want rank tracking? Upgrade to Pro"

**Cost:** £0/month (all free APIs and services)

---

## Phase 2.5: Client Progress Tracking (Week 6-7)

**Goal:** Track client KPIs from baseline to current with admin-controlled visibility

### The Problem
- Need to show value/progress to justify renewals
- Don't want clients fixated on temporary dips (seasonal, etc.)
- Want to highlight wins at strategic moments (reviews, upsells)
- Need ammunition against "what am I paying for?" questions

### The Solution
**Admin-controlled "Progress Report" toggle per client**
- Records baseline metrics when client starts
- Tracks ongoing performance (GSC, GA4 if connected)
- Dashboard section **hidden by default**
- You enable it when you want to showcase progress
- Client sees: "Dave has shared your progress report"

### Why This Works
- **Control the narrative:** Show progress at strategic moments
- **Avoid noise:** Hide during quiet periods/seasonal dips
- **Retention tool:** Visual proof of value before renewals
- **Upsell enabler:** "Look at this growth - imagine with rank tracking..."
- **Sets expectations:** Can explain context when you enable it

---

### 2.5.1 Baseline & Metrics Database (Week 6)

**Database schema:**
```typescript
// Supabase table: client_baselines
client_baselines (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  property_id UUID REFERENCES user_properties(id),

  // Baseline (when client started)
  baseline_date DATE NOT NULL, -- When they started with TMA
  baseline_period_start DATE, -- e.g., 30 days before baseline_date
  baseline_period_end DATE,

  // GSC metrics (free, always available)
  baseline_clicks INT,
  baseline_impressions INT,
  baseline_ctr DECIMAL(5,2),
  baseline_avg_position DECIMAL(5,2),

  // GA4 metrics (if connected)
  baseline_sessions INT,
  baseline_pageviews INT,
  baseline_users INT,
  baseline_conversions INT,
  baseline_conversion_rate DECIMAL(5,2),
  baseline_bounce_rate DECIMAL(5,2),
  baseline_avg_session_duration INT, -- seconds

  // Business metrics (manual entry by admin)
  baseline_monthly_revenue DECIMAL(10,2),
  baseline_leads_per_month INT,
  baseline_sales_per_month INT,

  // Targets (optional - what they want to achieve)
  target_clicks INT,
  target_conversions INT,
  target_monthly_revenue DECIMAL(10,2),
  target_date DATE, -- When they want to hit targets

  // Admin notes
  notes TEXT, -- Context: "Started after site redesign", "Seasonal business", etc.

  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
)

// Supabase table: client_progress_snapshots
// Automated snapshots taken weekly/monthly
client_progress_snapshots (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  property_id UUID REFERENCES user_properties(id),
  baseline_id UUID REFERENCES client_baselines(id),

  snapshot_date DATE NOT NULL,
  period_start DATE, -- 30 days before snapshot
  period_end DATE,

  // Current metrics (same structure as baseline)
  current_clicks INT,
  current_impressions INT,
  current_ctr DECIMAL(5,2),
  current_avg_position DECIMAL(5,2),
  current_sessions INT,
  current_pageviews INT,
  current_users INT,
  current_conversions INT,
  current_conversion_rate DECIMAL(5,2),
  current_bounce_rate DECIMAL(5,2),
  current_avg_session_duration INT,

  // Calculated changes (for quick queries)
  clicks_change_pct DECIMAL(5,2),
  impressions_change_pct DECIMAL(5,2),
  conversions_change_pct DECIMAL(5,2),

  created_at TIMESTAMP DEFAULT NOW()
)

// Index for latest snapshot
CREATE INDEX idx_snapshots_latest
ON client_progress_snapshots(user_id, property_id, snapshot_date DESC);

// Supabase table: client_progress_visibility
// Controls when "Progress Report" section is visible to each client
client_progress_visibility (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  property_id UUID REFERENCES user_properties(id),

  is_visible BOOLEAN DEFAULT false, -- The key toggle
  enabled_at TIMESTAMP, -- When you turned it on
  enabled_by TEXT, -- Admin email who enabled it
  reason TEXT, -- "Pre-renewal meeting", "Strong growth month", etc.

  // Optional: Auto-disable after X days
  auto_disable_at TIMESTAMP,

  // Track client engagement
  first_viewed_at TIMESTAMP,
  last_viewed_at TIMESTAMP,
  view_count INT DEFAULT 0,

  updated_at TIMESTAMP DEFAULT NOW()
)
```

**Metric calculation logic:**
```typescript
// lib/progress-tracking.ts

export async function calculateProgressMetrics(
  userId: string,
  propertyId: string
) {
  // Get baseline
  const { data: baseline } = await supabase
    .from('client_baselines')
    .select('*')
    .eq('user_id', userId)
    .eq('property_id', propertyId)
    .single();

  if (!baseline) return null;

  // Get latest snapshot (or calculate current if none exists)
  let currentMetrics = await getLatestSnapshot(userId, propertyId);

  if (!currentMetrics) {
    // Calculate from GSC/GA4 APIs
    currentMetrics = await fetchCurrentMetrics(userId, propertyId);

    // Save snapshot
    await saveProgressSnapshot(userId, propertyId, currentMetrics);
  }

  // Calculate changes
  const progress = {
    baseline: baseline,
    current: currentMetrics,
    changes: {
      clicks: {
        value: currentMetrics.current_clicks - baseline.baseline_clicks,
        percentage: calculatePercentageChange(
          baseline.baseline_clicks,
          currentMetrics.current_clicks
        ),
        trend: getTrend(baseline.baseline_clicks, currentMetrics.current_clicks)
      },
      impressions: { /* same structure */ },
      conversions: { /* same structure */ },
      // ... etc
    },
    summary: generateProgressSummary(baseline, currentMetrics)
  };

  return progress;
}

function calculatePercentageChange(baseline: number, current: number): number {
  if (baseline === 0) return current > 0 ? 100 : 0;
  return ((current - baseline) / baseline) * 100;
}

function getTrend(baseline: number, current: number): 'up' | 'down' | 'flat' {
  const change = calculatePercentageChange(baseline, current);
  if (change > 5) return 'up';
  if (change < -5) return 'down';
  return 'flat';
}

function generateProgressSummary(baseline, current): string {
  const improvements = [];

  if (current.current_clicks > baseline.baseline_clicks * 1.1) {
    improvements.push('clicks up ' + Math.round((current.current_clicks / baseline.baseline_clicks - 1) * 100) + '%');
  }

  if (current.current_conversions > baseline.baseline_conversions * 1.1) {
    improvements.push('conversions up ' + Math.round((current.current_conversions / baseline.baseline_conversions - 1) * 100) + '%');
  }

  if (improvements.length === 0) return 'Steady progress, building foundation';
  if (improvements.length === 1) return improvements[0];
  return improvements.join(', ');
}
```

**Tasks:**
- [ ] Create Supabase tables
- [ ] Build baseline capture flow (admin tool)
- [ ] Implement progress calculation logic
- [ ] Create snapshot automation (weekly cron job)
- [ ] Add GA4 integration (if property connected)
- [ ] Build admin baseline editing UI

---

### 2.5.2 Admin Control Panel (Week 6)

**Admin UI for managing progress visibility:**

```typescript
// /src/app/admin/clients/[id]/progress/page.tsx

export default function ClientProgressAdminPage({ params }) {
  const { data: client } = useSWR(`/api/admin/clients/${params.id}`);
  const { data: visibility } = useSWR(`/api/admin/clients/${params.id}/progress-visibility`);
  const { data: progress } = useSWR(`/api/admin/clients/${params.id}/progress-metrics`);

  return (
    <div>
      <h1>{client.name} - Progress Tracking</h1>

      {/* Visibility toggle - the key control */}
      <div className="border rounded-lg p-6 bg-blue-50">
        <div className="flex items-center justify-between">
          <div>
            <h2>Progress Report Visibility</h2>
            <p className="text-sm text-gray-600">
              {visibility.is_visible
                ? 'Client can see their progress report in dashboard'
                : 'Progress report hidden from client (you can still see it)'
              }
            </p>
            {visibility.is_visible && visibility.enabled_at && (
              <p className="text-xs text-gray-500 mt-1">
                Enabled {formatDistanceToNow(visibility.enabled_at)} ago by {visibility.enabled_by}
                {visibility.reason && ` - ${visibility.reason}`}
              </p>
            )}
          </div>

          <Toggle
            checked={visibility.is_visible}
            onChange={(checked) => handleVisibilityToggle(checked)}
            size="lg"
          />
        </div>

        {/* Enable modal with reason */}
        {showEnableModal && (
          <Modal>
            <h3>Enable Progress Report</h3>
            <p>Why are you enabling this now?</p>
            <select value={reason} onChange={(e) => setReason(e.target.value)}>
              <option value="">Select reason...</option>
              <option value="strong_growth">Strong growth this month</option>
              <option value="pre_renewal">Before renewal meeting</option>
              <option value="upsell_opportunity">Upsell opportunity</option>
              <option value="client_request">Client requested</option>
              <option value="regular_review">Regular quarterly review</option>
              <option value="other">Other</option>
            </select>

            <label>
              <input
                type="checkbox"
                checked={autoDisable}
                onChange={(e) => setAutoDisable(e.target.checked)}
              />
              Auto-disable after 7 days
            </label>

            <button onClick={confirmEnable}>Enable Progress Report</button>
          </Modal>
        )}
      </div>

      {/* Preview of what client will see */}
      <div className="mt-8">
        <h2>Preview (What Client Sees)</h2>
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
          {visibility.is_visible ? (
            <ProgressReportClientView progress={progress} readonly />
          ) : (
            <div className="text-gray-400 text-center py-12">
              Progress report hidden - client sees nothing
            </div>
          )}
        </div>
      </div>

      {/* Baseline & snapshots management */}
      <div className="mt-8">
        <h2>Baseline & Snapshots</h2>

        <BaselineEditor
          baseline={progress.baseline}
          onSave={updateBaseline}
        />

        <SnapshotHistory
          snapshots={progress.snapshots}
          onRefresh={refreshSnapshot}
        />
      </div>

      {/* Admin-only notes */}
      <div className="mt-8">
        <h2>Admin Notes (Private)</h2>
        <textarea
          value={adminNotes}
          onChange={(e) => setAdminNotes(e.target.value)}
          placeholder="Context for this client's progress (seasonal factors, recent changes, etc.)"
          rows={4}
          className="w-full"
        />
      </div>
    </div>
  );
}

async function handleVisibilityToggle(enabled: boolean) {
  if (enabled) {
    // Show modal to collect reason
    setShowEnableModal(true);
  } else {
    // Disable immediately
    await fetch(`/api/admin/clients/${clientId}/progress-visibility`, {
      method: 'PATCH',
      body: JSON.stringify({ is_visible: false })
    });

    mutate(); // Refresh data
  }
}

async function confirmEnable() {
  await fetch(`/api/admin/clients/${clientId}/progress-visibility`, {
    method: 'PATCH',
    body: JSON.stringify({
      is_visible: true,
      reason: reason,
      enabled_by: session.user.email,
      auto_disable_at: autoDisable
        ? addDays(new Date(), 7)
        : null
    })
  });

  // Send notification to client
  await sendProgressReportNotification(clientId);

  setShowEnableModal(false);
  mutate();
}
```

**Quick actions in client list:**
```typescript
// /src/app/admin/clients/page.tsx

function ClientListWithProgressToggles() {
  return (
    <table>
      <thead>
        <tr>
          <th>Client</th>
          <th>Progress</th>
          <th>Report Visible</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {clients.map(client => (
          <tr key={client.id}>
            <td>{client.name}</td>
            <td>
              {client.progress && (
                <ProgressSummaryBadge progress={client.progress} />
              )}
            </td>
            <td>
              <Toggle
                checked={client.progressVisible}
                onChange={(checked) => quickToggleVisibility(client.id, checked)}
                size="sm"
              />
            </td>
            <td>
              <button onClick={() => router.push(`/admin/clients/${client.id}/progress`)}>
                Manage
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function ProgressSummaryBadge({ progress }) {
  const overallTrend = calculateOverallTrend(progress);

  return (
    <div className="flex items-center gap-2">
      {overallTrend === 'up' && (
        <span className="text-green-600">↑ {progress.summary}</span>
      )}
      {overallTrend === 'down' && (
        <span className="text-red-600">↓ Needs attention</span>
      )}
      {overallTrend === 'flat' && (
        <span className="text-gray-600">→ Steady</span>
      )}
    </div>
  );
}
```

**Tasks:**
- [ ] Build admin progress management page
- [ ] Create visibility toggle with reason modal
- [ ] Add preview of client view
- [ ] Build baseline editor UI
- [ ] Add bulk toggle (enable for multiple clients)
- [ ] Create "Auto-disable" scheduling
- [ ] Add admin notification when client views report

---

### 2.5.3 Client Dashboard Section (Week 7)

**Conditional section in client dashboard:**

```typescript
// /src/app/dashboard/page.tsx

export default function ClientDashboard() {
  const { data: user } = useSession();
  const { data: progressVisibility } = useSWR('/api/client/progress-visibility');
  const { data: progress } = useSWR(
    progressVisibility?.is_visible ? '/api/client/progress' : null
  );

  return (
    <div>
      {/* Standard dashboard sections */}
      <GSCOverview />
      <TopPages />
      <TopQueries />

      {/* Progress report - only visible when admin enables it */}
      {progressVisibility?.is_visible && (
        <ProgressReportSection
          progress={progress}
          onView={trackProgressView}
        />
      )}

      {/* Book meeting section */}
      <BookMeetingButton />
    </div>
  );
}

function ProgressReportSection({ progress, onView }) {
  const [hasViewed, setHasViewed] = useState(false);

  useEffect(() => {
    if (!hasViewed) {
      onView(); // Track that client viewed it
      setHasViewed(true);
    }
  }, []);

  return (
    <div className="border rounded-lg p-6 bg-gradient-to-br from-green-50 to-blue-50">
      {/* Header with "new" badge if recently enabled */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">Your Progress Report</h2>
        {isRecent(progress.enabledAt) && (
          <Badge variant="success">New</Badge>
        )}
      </div>

      <p className="text-gray-600 mb-6">
        Your performance from {format(progress.baseline.baseline_date, 'PP')} to today
      </p>

      {/* Key metrics grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <MetricCard
          label="Organic Clicks"
          baseline={progress.baseline.baseline_clicks}
          current={progress.current.current_clicks}
          change={progress.changes.clicks}
        />

        <MetricCard
          label="Impressions"
          baseline={progress.baseline.baseline_impressions}
          current={progress.current.current_impressions}
          change={progress.changes.impressions}
        />

        {progress.current.current_conversions && (
          <MetricCard
            label="Conversions"
            baseline={progress.baseline.baseline_conversions}
            current={progress.current.current_conversions}
            change={progress.changes.conversions}
          />
        )}

        <MetricCard
          label="Avg Position"
          baseline={progress.baseline.baseline_avg_position}
          current={progress.current.current_avg_position}
          change={progress.changes.avg_position}
          inverted // Lower is better
        />
      </div>

      {/* Timeline chart */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-4">Progress Over Time</h3>
        <ProgressChart
          snapshots={progress.snapshots}
          baseline={progress.baseline}
        />
      </div>

      {/* Targets (if set) */}
      {progress.baseline.target_clicks && (
        <div className="bg-white rounded-lg p-4 border">
          <h3 className="font-semibold mb-2">Targets</h3>
          <TargetProgressBar
            label="Clicks"
            baseline={progress.baseline.baseline_clicks}
            current={progress.current.current_clicks}
            target={progress.baseline.target_clicks}
            targetDate={progress.baseline.target_date}
          />
        </div>
      )}

      {/* Summary message */}
      <div className="mt-6 p-4 bg-white rounded-lg border-l-4 border-blue-500">
        <p className="text-gray-700">{progress.summary}</p>
      </div>
    </div>
  );
}

function MetricCard({ label, baseline, current, change, inverted = false }) {
  const isPositive = inverted
    ? change.trend === 'down'
    : change.trend === 'up';

  return (
    <div className="bg-white rounded-lg p-4 shadow-sm">
      <div className="text-sm text-gray-600 mb-1">{label}</div>
      <div className="text-2xl font-bold mb-1">
        {current.toLocaleString()}
      </div>
      <div className={`text-sm flex items-center gap-1 ${
        isPositive ? 'text-green-600' :
        change.trend === 'down' ? 'text-red-600' :
        'text-gray-600'
      }`}>
        {change.trend === 'up' && '↑'}
        {change.trend === 'down' && '↓'}
        {change.trend === 'flat' && '→'}
        {Math.abs(change.percentage).toFixed(1)}%
        <span className="text-gray-500">
          ({change.value > 0 ? '+' : ''}{change.value.toLocaleString()})
        </span>
      </div>
      <div className="text-xs text-gray-400 mt-1">
        from {baseline.toLocaleString()}
      </div>
    </div>
  );
}

function ProgressChart({ snapshots, baseline }) {
  // Recharts line chart showing progression over time
  const data = [
    {
      date: baseline.baseline_date,
      clicks: baseline.baseline_clicks,
      label: 'Baseline'
    },
    ...snapshots.map(s => ({
      date: s.snapshot_date,
      clicks: s.current_clicks,
      label: format(s.snapshot_date, 'MMM yyyy')
    }))
  ];

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="label" />
        <YAxis />
        <Tooltip />
        <Line
          type="monotone"
          dataKey="clicks"
          stroke="#2563eb"
          strokeWidth={2}
          dot={{ fill: '#2563eb', r: 4 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

function TargetProgressBar({ label, baseline, current, target, targetDate }) {
  const totalGap = target - baseline;
  const currentProgress = current - baseline;
  const percentageToTarget = (currentProgress / totalGap) * 100;

  return (
    <div>
      <div className="flex justify-between text-sm mb-2">
        <span>{label} Target Progress</span>
        <span className="text-gray-600">
          {current.toLocaleString()} / {target.toLocaleString()}
        </span>
      </div>

      <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
        <div
          className="bg-blue-600 h-3 rounded-full transition-all"
          style={{ width: `${Math.min(percentageToTarget, 100)}%` }}
        />
      </div>

      <div className="text-xs text-gray-600">
        {percentageToTarget.toFixed(0)}% of target
        {targetDate && ` (target date: ${format(targetDate, 'PP')})`}
      </div>
    </div>
  );
}
```

**Tasks:**
- [ ] Build progress report section component
- [ ] Create metric cards with trend indicators
- [ ] Add progress timeline chart
- [ ] Build target progress bars
- [ ] Add "Share feedback" button (optional)
- [ ] Track when client views report
- [ ] Add print/export functionality

---

### 2.5.4 Notification System (Week 7)

**When you enable progress report, notify client:**

```typescript
// lib/progress-notifications.ts

export async function sendProgressReportNotification(userId: string) {
  const { data: user } = await supabase
    .from('users')
    .select('email, name')
    .eq('id', userId)
    .single();

  await resend.emails.send({
    from: 'Dave at TMA <dave@tailormadeanalytics.com>',
    to: user.email,
    subject: 'Your SEO progress report is ready',
    html: `
      <p>Hi ${user.name},</p>

      <p>Great news! I've prepared your SEO progress report showing how your performance has improved since we started working together.</p>

      <p><a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard">View Your Progress Report</a></p>

      <p>This report shows:</p>
      <ul>
        <li>Organic traffic growth</li>
        <li>Search visibility improvements</li>
        <li>Conversion trends</li>
        <li>Progress towards your targets</li>
      </ul>

      <p>Let's discuss these results in our next review call. Haven't booked one yet? <a href="${process.env.NEXT_PUBLIC_BOOKING_LINK}?client=${user.email}">Book a time here</a>.</p>

      <p>Best,<br>Dave</p>
    `
  });

  // Log notification
  await supabase.from('meeting_notifications').insert({
    client_email: user.email,
    notification_type: 'progress_report_enabled',
    month_year: new Date().toISOString().substring(0, 7)
  });
}
```

**Auto-disable after X days:**
```typescript
// API route: /api/cron/auto-disable-progress-reports
// Vercel Cron: Daily at 6am

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response('Unauthorized', { status: 401 });
  }

  const now = new Date();

  // Find progress reports that should auto-disable
  const { data: toDisable } = await supabase
    .from('client_progress_visibility')
    .select('id, user_id')
    .eq('is_visible', true)
    .not('auto_disable_at', 'is', null)
    .lte('auto_disable_at', now.toISOString());

  for (const item of toDisable) {
    // Disable visibility
    await supabase
      .from('client_progress_visibility')
      .update({
        is_visible: false,
        updated_at: now.toISOString()
      })
      .eq('id', item.id);

    // Notify admin
    await sendEmail({
      to: 'dave@tailormadeanalytics.com',
      subject: `Progress report auto-disabled: ${item.user_id}`,
      body: `Progress report for ${item.user_id} has been automatically disabled after scheduled period.`
    });
  }

  return NextResponse.json({ disabled: toDisable.length });
}
```

**Tasks:**
- [ ] Build progress report email template
- [ ] Add email notification when enabled
- [ ] Build auto-disable cron job
- [ ] Add admin notification on auto-disable
- [ ] Optional: Client can request to keep it visible

---

### 2.5.5 Baseline Capture Workflow (Week 6)

**When onboarding new client:**

```typescript
// /src/app/admin/clients/[id]/onboarding/page.tsx

export default function ClientOnboardingPage() {
  const [step, setStep] = useState(1);
  const [baselineData, setBaselineData] = useState({});

  return (
    <div>
      <h1>Client Onboarding: Baseline Setup</h1>

      {step === 1 && (
        <StepGSCBaseline
          onComplete={(data) => {
            setBaselineData({ ...baselineData, ...data });
            setStep(2);
          }}
        />
      )}

      {step === 2 && (
        <StepGA4Baseline
          onComplete={(data) => {
            setBaselineData({ ...baselineData, ...data });
            setStep(3);
          }}
          onSkip={() => setStep(3)}
        />
      )}

      {step === 3 && (
        <StepBusinessMetrics
          onComplete={(data) => {
            setBaselineData({ ...baselineData, ...data });
            setStep(4);
          }}
        />
      )}

      {step === 4 && (
        <StepTargets
          onComplete={async (data) => {
            const finalBaseline = { ...baselineData, ...data };
            await saveBaseline(finalBaseline);
            router.push(`/admin/clients/${clientId}`);
          }}
        />
      )}
    </div>
  );
}

function StepGSCBaseline({ onComplete }) {
  const [loading, setLoading] = useState(false);
  const [period, setPeriod] = useState('30'); // days
  const [metrics, setMetrics] = useState(null);

  async function fetchGSCBaseline() {
    setLoading(true);

    // Fetch from GSC API for last 30 days
    const res = await fetch(`/api/admin/clients/${clientId}/fetch-gsc-baseline?days=${period}`);
    const data = await res.json();

    setMetrics(data);
    setLoading(false);
  }

  return (
    <div>
      <h2>Step 1: GSC Baseline</h2>
      <p>Fetch current GSC performance as baseline</p>

      <select value={period} onChange={(e) => setPeriod(e.target.value)}>
        <option value="7">Last 7 days</option>
        <option value="30">Last 30 days</option>
        <option value="90">Last 90 days</option>
      </select>

      <button onClick={fetchGSCBaseline} disabled={loading}>
        {loading ? 'Fetching...' : 'Fetch GSC Data'}
      </button>

      {metrics && (
        <div className="mt-4">
          <h3>Baseline Metrics</h3>
          <table>
            <tbody>
              <tr>
                <td>Clicks</td>
                <td>{metrics.clicks.toLocaleString()}</td>
              </tr>
              <tr>
                <td>Impressions</td>
                <td>{metrics.impressions.toLocaleString()}</td>
              </tr>
              <tr>
                <td>CTR</td>
                <td>{metrics.ctr.toFixed(2)}%</td>
              </tr>
              <tr>
                <td>Avg Position</td>
                <td>{metrics.position.toFixed(1)}</td>
              </tr>
            </tbody>
          </table>

          <button onClick={() => onComplete(metrics)}>
            Continue →
          </button>
        </div>
      )}
    </div>
  );
}

function StepBusinessMetrics({ onComplete }) {
  const [metrics, setMetrics] = useState({
    baseline_monthly_revenue: '',
    baseline_leads_per_month: '',
    baseline_sales_per_month: ''
  });

  return (
    <div>
      <h2>Step 3: Business Metrics (Optional)</h2>
      <p>Manual entry - ask client for these figures</p>

      <label>
        Monthly Revenue
        <input
          type="number"
          value={metrics.baseline_monthly_revenue}
          onChange={(e) => setMetrics({ ...metrics, baseline_monthly_revenue: e.target.value })}
          placeholder="e.g., 15000"
        />
      </label>

      <label>
        Leads per Month
        <input
          type="number"
          value={metrics.baseline_leads_per_month}
          onChange={(e) => setMetrics({ ...metrics, baseline_leads_per_month: e.target.value })}
          placeholder="e.g., 50"
        />
      </label>

      <label>
        Sales per Month
        <input
          type="number"
          value={metrics.baseline_sales_per_month}
          onChange={(e) => setMetrics({ ...metrics, baseline_sales_per_month: e.target.value })}
          placeholder="e.g., 12"
        />
      </label>

      <button onClick={() => onComplete(metrics)}>
        Continue →
      </button>
    </div>
  );
}

function StepTargets({ onComplete }) {
  const [targets, setTargets] = useState({
    target_clicks: '',
    target_conversions: '',
    target_monthly_revenue: '',
    target_date: ''
  });

  return (
    <div>
      <h2>Step 4: Set Targets</h2>
      <p>What does the client want to achieve?</p>

      <label>
        Target Clicks
        <input
          type="number"
          value={targets.target_clicks}
          onChange={(e) => setTargets({ ...targets, target_clicks: e.target.value })}
          placeholder="e.g., 5000"
        />
      </label>

      <label>
        Target Date
        <input
          type="date"
          value={targets.target_date}
          onChange={(e) => setTargets({ ...targets, target_date: e.target.value })}
        />
      </label>

      <button onClick={() => onComplete(targets)}>
        Complete Setup
      </button>
    </div>
  );
}
```

**Tasks:**
- [ ] Build baseline capture workflow UI
- [ ] Add GSC auto-fetch for baseline
- [ ] Add GA4 auto-fetch (if connected)
- [ ] Create manual business metrics form
- [ ] Add targets setting form
- [ ] Build baseline preview before save

---

### Deliverable: Progress Tracking System v1

**Admin capabilities:**
- Capture baseline when client starts
- Automated weekly/monthly snapshots
- Toggle visibility per client with reason tracking
- Preview what client sees before enabling
- Auto-disable after X days (optional)
- Track client engagement with report

**Client experience (when enabled):**
- "Your Progress Report" section in dashboard
- Visual comparison: baseline vs current
- Progress timeline chart
- Target tracking (if targets set)
- Clear metrics with trend indicators
- Print/export capability

**Strategic uses:**
- **Pre-renewal:** Show value before contract ends
- **Upsell:** "Look at this growth - imagine with Pro plan..."
- **Client review calls:** Enable day before meeting
- **Quiet periods:** Keep hidden during seasonal dips
- **Win showcasing:** Enable when you have strong growth

**Success metrics:**
- Admin uses it strategically (not always on)
- Clients react positively when shown
- Reduces "what am I paying for?" questions
- Increases renewal rates
- Enables confident upsell conversations

---

### Technical Stack

**Baseline capture:**
- GSC API for traffic metrics (free)
- GA4 API for conversion metrics (free)
- Manual entry for business metrics

**Snapshot automation:**
- Weekly cron job via Vercel Cron
- Stores snapshots in Supabase
- Calculates percentage changes

**Visibility control:**
- Simple boolean toggle per client
- Reason tracking for admin reference
- Email notification when enabled
- Auto-disable scheduling

**Client view:**
- Conditional rendering in dashboard
- Recharts for timeline visualization
- Responsive design
- No access if visibility = false

**Cost:** £0/month (all free APIs, Supabase free tier sufficient)

---

### Migration from Current System

**For existing clients (Excalibur, etc.):**
1. Manually capture baseline from their current GSC data (30-90 days before you started)
2. Set baseline date to when they started with you
3. Take first snapshot of current performance
4. Keep hidden until you want to show progress

**For new clients:**
1. Capture baseline during onboarding
2. Record what they told you as targets
3. Take snapshots weekly automatically
4. Enable visibility strategically (3-6 months in when you have good growth)

---

## Phase 3: API Reports & Rank Tracking (Week 7-10)

**Goal:** Add paid API features (rank tracking, competitor analysis) with usage limits

### 3.1 Usage Limiting System (Week 7)
**Why:** DataForSEO costs money, need to prevent abuse and enable tiered pricing

```typescript
// Database schema
user_bundles (
  user_id UUID PRIMARY KEY,
  plan_name TEXT, -- 'starter', 'pro', 'enterprise'

  // Included limits per month
  rank_checks_included INT, -- 100, 500, 2000
  keyword_research_included INT, -- 50, 200, 1000
  backlink_checks_included INT, -- 10, 50, 200

  // Current usage (resets monthly)
  rank_checks_used INT DEFAULT 0,
  keyword_research_used INT DEFAULT 0,
  backlink_checks_used INT DEFAULT 0,

  // Billing
  renewal_date TIMESTAMP,
  stripe_price_id TEXT,

  created_at TIMESTAMP,
  updated_at TIMESTAMP
)

api_usage_log (
  id SERIAL PRIMARY KEY,
  user_id UUID,
  api_name TEXT, -- 'dataforseo_serp', 'dataforseo_keywords', etc
  request_count INT, -- Number of API calls
  cost_usd DECIMAL(10,6), -- Actual cost in USD
  metadata JSONB, -- Store request details
  created_at TIMESTAMP
)
```

**Middleware:**
```typescript
// lib/usage-limiter.ts
export async function checkUsageLimit(
  userId: string,
  feature: 'rank_checks' | 'keyword_research' | 'backlink_checks',
  count: number = 1
): Promise<{ allowed: boolean; remaining: number; limit: number }> {
  const bundle = await getUserBundle(userId);

  const used = bundle[`${feature}_used`];
  const limit = bundle[`${feature}_included`];
  const remaining = limit - used;

  if (remaining < count) {
    return { allowed: false, remaining, limit };
  }

  // Increment usage
  await incrementUsage(userId, feature, count);

  return { allowed: true, remaining: remaining - count, limit };
}
```

**Tasks:**
- [ ] Build usage tracking database schema
- [ ] Create usage limiter middleware
- [ ] Add usage dashboard for users (show remaining credits)
- [ ] Build admin dashboard to view all usage
- [ ] Add monthly reset cron job
- [ ] Add usage alerts (email when 80% used)

### 3.2 DataForSEO Integration (Week 8)
**API:** DataForSEO SERP API - $0.60 per 1,000 searches

**Features:**

#### Rank Tracker
**What it does:** Track keyword positions for client's website daily/weekly

```typescript
// Database schema
tracked_keywords (
  id UUID PRIMARY KEY,
  user_id UUID,
  property_id UUID,
  keyword TEXT,
  location TEXT, -- 'United Kingdom', 'London, UK', etc
  language TEXT DEFAULT 'en',
  device TEXT DEFAULT 'desktop', -- 'desktop' or 'mobile'
  created_at TIMESTAMP
)

rank_history (
  id SERIAL PRIMARY KEY,
  keyword_id UUID REFERENCES tracked_keywords(id),
  position INT, -- NULL if not in top 100
  url TEXT, -- Which page is ranking
  checked_at TIMESTAMP,
  INDEX (keyword_id, checked_at)
)
```

**UI:**
- Add keywords to track (max based on plan)
- View current positions
- View position history chart
- Position change indicators (↑↓)
- SERP preview (what's ranking #1-10)
- Alerts for big position changes

**API Route:**
```typescript
// /api/rank-tracker/check
export async function POST(req: NextRequest) {
  const { keywordId } = await req.json();
  const keyword = await getKeyword(keywordId);

  // Check usage limit
  const usage = await checkUsageLimit(keyword.user_id, 'rank_checks', 1);
  if (!usage.allowed) {
    return NextResponse.json({ error: 'Usage limit exceeded' }, { status: 429 });
  }

  // Call DataForSEO
  const result = await dataForSEO.serp({
    keyword: keyword.keyword,
    location: keyword.location,
    language: keyword.language,
    device: keyword.device
  });

  // Log cost
  await logAPIUsage(keyword.user_id, 'dataforseo_serp', 1, 0.0006);

  // Find user's site in results
  const position = findPositionInResults(result, keyword.property.domain);

  // Save to history
  await saveRankHistory(keywordId, position, result.url);

  return NextResponse.json({ position, url: result.url });
}
```

**Tasks:**
- [ ] Set up DataForSEO account and API key
- [ ] Build keyword tracking database schema
- [ ] Create API routes for rank checking
- [ ] Build rank tracker UI
- [ ] Add position history charts
- [ ] Build SERP preview component
- [ ] Add bulk checking (check all keywords)
- [ ] Add daily automated checks (cron job)

#### Keyword Research Tool
**What it does:** Find related keywords, search volume, difficulty

**UI:**
- Input seed keyword
- Get 50-200 related keywords (based on plan)
- Show search volume, CPC, competition
- Show keyword difficulty score
- "Add to tracker" button

**Cost per request:** ~$0.01-0.05 depending on results

**Tasks:**
- [ ] Build keyword research API route
- [ ] Create UI for keyword input and results
- [ ] Add filtering/sorting
- [ ] Add "add to tracker" functionality
- [ ] Track usage and costs

#### Competitor Analysis (Optional)
**What it does:** See what keywords competitors rank for

**Cost:** ~$0.10 per domain analysed

### 3.3 Stripe Integration (Week 9)
**Why:** Need to collect payment for paid plans

**Plans:**

| Plan | Price | Rank Checks | Keyword Research | Backlink Checks |
|------|-------|-------------|------------------|-----------------|
| **Free** | £0 | 0 | 0 | 0 (GSC only) |
| **Starter** | £49/mo | 100/mo | 50/mo | 10/mo |
| **Professional** | £149/mo | 500/mo | 200/mo | 50/mo |
| **Enterprise** | £299/mo | 2,000/mo | 1,000/mo | 200/mo |

**Cost analysis (Professional plan example):**
- Revenue: £149/month
- DataForSEO cost: 500 searches = £0.30
- Stripe fee: 1.5% + 20p = £2.44
- **Profit: £146.26 (98.2% margin)**

**Tasks:**
- [ ] Set up Stripe account
- [ ] Create Stripe products and prices
- [ ] Build checkout flow
- [ ] Implement webhook handling
- [ ] Build subscription management page
- [ ] Add upgrade/downgrade flow
- [ ] Handle failed payments
- [ ] Add cancellation flow

### 3.4 Automated Reporting (Week 10)
**Feature:** Weekly/monthly email reports

**What's included:**
- Ranking changes summary
- Top gaining/losing keywords
- GSC performance overview
- Attached PDF report

**Tech:**
- Resend.com (free tier: 3,000 emails/month) or nodemailer
- Puppeteer or React-PDF for PDF generation

**Tasks:**
- [ ] Build report generation logic
- [ ] Design PDF template
- [ ] Create email templates
- [ ] Build cron job for weekly/monthly sends
- [ ] Add user preferences (frequency, day of week)

### Deliverable: API Reports Platform v1
- Clients can track 100-2,000 keywords (based on plan)
- Daily automated rank checking
- Keyword research tool
- Usage limits enforced
- Stripe payment integration
- Automated email reports

**Revenue Impact:**
- New revenue stream: £49-299/month per client
- Cost per client: £0.30-2.00/month
- Profit margin: 98%+

**Monthly Revenue Projection:**
- 2 existing clients upgrade to Pro (£149): £298
- 5 new Starter clients (£49): £245
- **Total: £543/month revenue, ~£5/month costs = £538 profit**

---

## Phase 4: Agency Platform (Week 11-16)

**Goal:** White-label platform for SEO agencies to resell to their clients

### Why Agencies Will Pay

Your agency contact already pays for:
- Ahrefs subscription: ~£99-399/month
- Agency analytics dashboards: ~£50-200/month
- **Total: £150-600/month**

**Your offer:**
- All-in-one platform (rankings, GSC, reports)
- White-label (branded as their agency)
- Multi-client management
- API access for their own tools
- Automated client reporting
- **Price: £300-1,000/month** (based on client count)

### 4.1 Multi-Tenancy Architecture (Week 11)

**Concept:** One agency account manages multiple client accounts

```typescript
// Database schema
agencies (
  id UUID PRIMARY KEY,
  name TEXT,
  domain TEXT, -- subdomain: acme.tmareports.com
  custom_domain TEXT, -- Optional: reports.acmeagency.com
  logo_url TEXT,
  primary_color TEXT,
  created_at TIMESTAMP
)

agency_users (
  id UUID PRIMARY KEY,
  agency_id UUID REFERENCES agencies(id),
  email TEXT,
  role TEXT, -- 'owner', 'admin', 'member'
  created_at TIMESTAMP
)

agency_clients (
  id UUID PRIMARY KEY,
  agency_id UUID REFERENCES agencies(id),
  client_name TEXT,
  client_email TEXT, -- Optional client login
  properties JSONB, -- Array of connected GSC/GA4 properties
  bundle JSONB, -- Their rank tracking limits
  created_at TIMESTAMP
)

agency_subscriptions (
  agency_id UUID PRIMARY KEY,
  plan_name TEXT, -- 'starter', 'growth', 'agency', 'enterprise'
  client_limit INT, -- 5, 15, 50, unlimited
  users_limit INT, -- 2, 5, 10, unlimited
  monthly_price DECIMAL(10,2),
  stripe_subscription_id TEXT,
  status TEXT,
  created_at TIMESTAMP
)
```

**Agency Plans:**

| Plan | Price | Clients | Users | Features |
|------|-------|---------|-------|----------|
| **Starter** | £300/mo | 5 | 2 | Basic white-label, 500 rank checks/client |
| **Growth** | £600/mo | 15 | 5 | Custom domain, 1000 rank checks/client |
| **Agency** | £1,000/mo | 50 | 10 | Full white-label, 2000 rank checks/client, API access |
| **Enterprise** | Custom | Unlimited | Unlimited | Custom features, dedicated support |

**Tasks:**
- [ ] Build agency database schema
- [ ] Create agency signup flow
- [ ] Build client management interface
- [ ] Add user invitation system
- [ ] Implement row-level security (RLS) in Supabase
- [ ] Add agency switching for TMA admins

### 4.2 White-Label System (Week 12)

**Levels of white-labeling:**

#### Level 1: Subdomain (Included in all plans)
- `acme.tmareports.com`
- Agency logo in navbar
- Agency primary colour
- "Powered by TMA" in footer

#### Level 2: Custom Domain (Growth+)
- `reports.acmeagency.com`
- Full branding control
- No "Powered by" footer

#### Level 3: Full White-Label (Agency+)
- Custom domain
- Custom email domain for reports
- Fully branded PDFs
- White-label API endpoints

**Implementation:**
```typescript
// middleware.ts - Handle subdomain routing
export function middleware(req: NextRequest) {
  const hostname = req.headers.get('host');

  // Check if subdomain (acme.tmareports.com)
  const subdomain = hostname?.split('.')[0];

  if (subdomain && subdomain !== 'www' && subdomain !== 'tmareports') {
    // Fetch agency by subdomain
    const agency = await getAgencyByDomain(subdomain);

    if (agency) {
      // Set agency context for this request
      req.headers.set('x-agency-id', agency.id);
    }
  }

  return NextResponse.next();
}

// components/Navbar.tsx - Show agency branding
export default function Navbar() {
  const agency = useAgency(); // From context

  return (
    <nav>
      <img src={agency?.logo_url || '/tma-logo.png'} />
      <style>{`:root { --primary: ${agency?.primary_color || '#3b82f6'}; }`}</style>
    </nav>
  );
}
```

**Tasks:**
- [ ] Build subdomain routing middleware
- [ ] Create agency branding settings page
- [ ] Implement logo upload (Supabase Storage)
- [ ] Add custom colour picker
- [ ] Build custom domain setup guide
- [ ] Add DNS verification system
- [ ] White-label PDF generation
- [ ] White-label email templates

### 4.3 Client Portals (Week 13)

**Feature:** Optional client login to view their own reports

**Use case:**
- Agency generates reports
- Agency shares login with their client
- Client sees only their data (not other clients)
- Client can export/print reports

**Permissions:**
```typescript
// Client users can:
- View their own dashboard
- View their rank tracking
- Export/print reports
- NOT: Add keywords, change settings, see other clients

// Agency users can:
- View all clients
- Switch between clients
- Add/remove keywords
- Configure settings
- Invite other agency users
```

**Tasks:**
- [ ] Build client portal UI (simplified view)
- [ ] Add client login flow
- [ ] Implement permission system
- [ ] Add "Share with client" button (generates login)
- [ ] Build client-friendly report view

### 4.4 API Access for Agencies (Week 14)

**Why:** Agencies want to pull data into their own systems

**Use case:**
- Agency uses custom reporting tool (e.g., Looker Studio, Data Studio, Excel)
- They want to pull ranking data via API
- Combine TMA data with other data sources
- Build custom dashboards

**API Endpoints:**
```typescript
// GET /api/v1/clients
// List all clients for agency

// GET /api/v1/clients/:id/rankings
// Get current rankings for client

// GET /api/v1/clients/:id/rankings/history
// Get ranking history with date range

// GET /api/v1/clients/:id/gsc/overview
// Get GSC overview data

// POST /api/v1/clients/:id/keywords
// Add keyword to track

// GET /api/v1/usage
// Get current usage and limits
```

**Authentication:**
```typescript
// API keys for agencies
agency_api_keys (
  id UUID PRIMARY KEY,
  agency_id UUID,
  key_hash TEXT, -- bcrypt hash
  key_prefix TEXT, -- tma_live_abc123 (for identification)
  name TEXT, -- "Production Server"
  last_used_at TIMESTAMP,
  created_at TIMESTAMP
)

// Usage
Authorization: Bearer tma_live_abc123xyz789...
```

**Rate limiting:**
- 100 requests/minute per API key
- 10,000 requests/day per agency

**Tasks:**
- [ ] Build REST API routes
- [ ] Implement API key authentication
- [ ] Add rate limiting (upstash/redis)
- [ ] Create API documentation (Swagger/OpenAPI)
- [ ] Build API key management UI
- [ ] Add webhook support (notify agency of ranking changes)

### 4.5 Advanced Features (Week 15-16)

#### Automated Client Onboarding
**Feature:** Agency invites client, client connects their GSC, done

**Flow:**
1. Agency clicks "Add Client"
2. Enters client email
3. Client receives email: "Acme Agency invited you"
4. Client clicks link, signs in with Google
5. Client grants GSC access
6. Agency immediately sees client's data

**Tasks:**
- [ ] Build invitation email flow
- [ ] Create client onboarding wizard
- [ ] Add GSC connection UI
- [ ] Auto-create initial keyword tracking (top 20 keywords from GSC)

#### Bulk Operations
**Feature:** Check all keywords for all clients at once

**UI:**
- "Check All Rankings Now" button
- Shows progress bar
- Queues jobs efficiently (don't hit rate limits)

**Tasks:**
- [ ] Build job queue system (BullMQ + Redis)
- [ ] Create bulk checking logic
- [ ] Add progress tracking UI
- [ ] Handle failures gracefully

#### Report Templates
**Feature:** Agency creates custom report templates

**Customization:**
- Choose which sections to include
- Add custom header/footer
- Add agency commentary section
- Set schedule (weekly/monthly)
- Choose clients to send to

**Tasks:**
- [ ] Build report template builder
- [ ] Add template preview
- [ ] Save templates to database
- [ ] Use templates in automated sends

#### Slack/Teams Integration
**Feature:** Get ranking alerts in Slack

**Implementation:**
- Webhook configuration per client
- Alert when keyword moves >5 positions
- Daily summary of all changes

**Tasks:**
- [ ] Build webhook delivery system
- [ ] Create Slack app
- [ ] Add Microsoft Teams support
- [ ] Build alert configuration UI

### Deliverable: Agency Platform v1
- Multi-client management
- White-label (subdomain + custom domain)
- Optional client portals
- REST API access
- Automated client onboarding
- Bulk operations
- Report templates
- Slack/Teams integration

**Revenue Impact:**
- 1 agency at £600/month = £600
- 3 agencies at £300/month = £900
- **Total: £1,500/month new revenue**
- Costs: ~£50/month (DataForSEO usage)
- **Profit: £1,450/month (96% margin)**

---

## Phase 5: Scale & Optimize (Week 17+)

### 5.1 Additional Integrations
- Google Analytics 4 API (traffic data)
- Google Ads API (PPC performance)
- Ahrefs API (backlink data) - if agencies demand it
- SEMrush API - if agencies demand it

### 5.2 Advanced Features
- SEO score/grade (0-100)
- Automated recommendations ("Your meta descriptions are too short")
- Competitor auto-detection (who else ranks for your keywords?)
- Content gap analysis (keywords competitors rank for but you don't)
- Backlink monitoring
- Site audit (technical SEO issues)

### 5.3 Mobile App (Optional)
- React Native app
- Push notifications for ranking changes
- Quick view of key metrics

---

## Technical Architecture Summary

### Tech Stack
- **Framework:** Next.js 15 (App Router)
- **Auth:** NextAuth.js
- **Database:** Supabase (PostgreSQL)
- **Payments:** Stripe
- **APIs:** Google Search Console, DataForSEO
- **Job Queue:** BullMQ + Redis (Upstash)
- **Email:** Resend or nodemailer
- **Storage:** Supabase Storage
- **Hosting:** Vercel
- **Monitoring:** Vercel Analytics + Sentry

### Cost Breakdown (Monthly)

#### Phase 2: Client Dashboard (Free Tier)
- Supabase: Free (500MB DB)
- Vercel: Free (hobby)
- NextAuth: Free
- **Total: £0/month**

#### Phase 3: API Reports (10 clients)
- DataForSEO: £5/month
- Stripe fees: £15/month (1.5% of £1,000 revenue)
- Supabase: £0 (still under limits)
- Vercel: £0
- **Total: £20/month**
- Revenue: £1,000/month
- **Profit: £980/month**

#### Phase 4: Agency Platform (5 agencies, 50 total clients)
- DataForSEO: £50/month
- Stripe fees: £75/month
- Supabase: £25/month (Pro plan)
- Vercel: £20/month (Pro plan)
- Upstash Redis: £10/month
- **Total: £180/month**
- Revenue: £5,000/month (£3,000 agencies + £2,000 direct clients)
- **Profit: £4,820/month**

### Scaling Considerations

**At 100 clients:**
- Database: Supabase Pro (£25/month handles 8GB)
- API costs: £100/month
- **Profit margin: ~95%**

**At 500 clients:**
- Database: Supabase Pro (still fine)
- API costs: £500/month
- Consider: Dedicated database, caching layer
- **Profit margin: ~92%**

---

## Sales & Marketing Strategy

### Direct Client (B2C) Acquisition
1. **Current clients:** Upsell 2 existing clients (Excalibur + 1 other)
2. **Organic:** SEO tools generate inbound traffic (meta-checker.com ranking potential)
3. **Partnerships:** Local web designers, small marketing agencies
4. **Content:** Blog posts on SEO topics

### Agency (B2B) Acquisition
1. **Your contact:** Demo to SEO agency contact
2. **Agency directories:** List on agency tool directories
3. **LinkedIn outreach:** Target SEO agency owners
4. **Reddit/communities:** r/SEO, r/bigseo, r/marketing
5. **Comparison content:** "Ahrefs alternative", "White-label SEO reporting"

### Pricing Psychology
- **Free tier:** GSC dashboard only (lead generation)
- **Starter £49:** Low barrier to entry
- **Professional £149:** Match current client pricing
- **Enterprise £299:** Justify with high limits
- **Agency £300-1000:** Much cheaper than Ahrefs + separate dashboards

---

## Risk Mitigation

### Technical Risks
1. **API rate limits**
   - Solution: Implement queue system, spread checks over time
   - Fallback: Upgrade DataForSEO plan if needed

2. **OAuth token expiry**
   - Solution: Automatic refresh logic with error handling
   - Fallback: Re-authentication prompt

3. **Scaling database**
   - Solution: Start with Supabase, migrate to dedicated Postgres if needed
   - Monitoring: Set up alerts for DB size/performance

### Business Risks
1. **Agencies want features you don't have**
   - Solution: Modular architecture, can add integrations on demand
   - Strategy: Focus on core use cases first

2. **Can't compete with Ahrefs/SEMrush on features**
   - Solution: Don't try to - compete on price + white-label + simplicity
   - Positioning: "The white-label platform for agencies, not an Ahrefs replacement"

3. **Clients leave after free trial**
   - Solution: Onboarding email sequence, show quick wins
   - Limit free tier heavily (GSC only, no rank tracking)

---

## Success Metrics

### Phase 2 Success (Client Dashboard)
- [ ] 2 existing clients actively using dashboard weekly
- [ ] Dashboard reduces Looker Studio setup time from 4hr to 10min per client
- [ ] Net Promoter Score >7

### Phase 3 Success (API Reports)
- [ ] 5 paying clients (any tier)
- [ ] £500/month MRR
- [ ] <2% API cost as percentage of revenue
- [ ] 1 client referred by existing client

### Phase 4 Success (Agency Platform)
- [ ] 1 agency signed up (your contact)
- [ ] Agency managing 5+ clients
- [ ] £300-600/month from agencies
- [ ] Agency NPS >8

### 12-Month Goal
- **MRR:** £5,000/month
- **Clients:** 30 direct + 5 agencies (managing 50+ sites)
- **Profit margin:** >90%
- **Churn:** <5% monthly

---

## Decision Points

### After Phase 2: Do we build Phase 3?
**Decide based on:**
- Are existing clients using the dashboard?
- Do they want rank tracking features?
- Can we sign up 3-5 new clients for paid plans?

**If NO:** Focus on marketing/sales of Phase 2 before building Phase 3

### After Phase 3: Do we build Phase 4?
**Decide based on:**
- Do we have 10+ paying direct clients?
- Has the agency contact expressed strong interest?
- Are we confident in technical infrastructure?

**If NO:** Scale Phase 3 to 20-30 clients first, build Phase 4 later

---

## Next Actions (This Week)

### Priority 1: Complete Phase 1 Setup
1. [ ] Get Google PageSpeed API key → Add to `.env.local`
2. [ ] Test all 4 tools with Excalibur Auctions
3. [ ] Set up Gmail email notifications (optional)
4. [ ] Deploy to production
5. [ ] Send Excalibur link to new tools, get feedback

### Priority 2: Plan Phase 2
1. [ ] Review this roadmap with critical eye
2. [ ] Decide: Full dashboard or just rank tracking first?
3. [ ] Set up project board (GitHub Projects or Notion)
4. [ ] Block out 10-15 hours/week for development

### Priority 3: Validate Agency Demand
1. [ ] Schedule call with agency contact
2. [ ] Show current tools + this roadmap
3. [ ] Ask: "If I built this, what's missing?"
4. [ ] Ask: "What would you pay for this?"
5. [ ] Get letter of intent or pre-payment

---

**Last Updated:** 2025-01-13
**Status:** Phase 1 in progress, ready to deploy
**Next Review:** After Phase 1 complete, validate Phase 2 approach
