export interface Playbook {
  slug: string;
  title: string;
  description: string;
  isFree: boolean;
  content: string;
}

export const PLAYBOOKS: Playbook[] = [
  {
    slug: 'client-acquisition-flywheel',
    title: 'Client Acquisition Flywheel',
    description: 'Build a sustainable system for attracting and converting clients without burning out on cold outreach.',
    isFree: true,
    content: `
# Client Acquisition Flywheel

## Overview
Stop chasing clients. Build a system that attracts them.

## The Framework

### Stage 1: Foundation (Week 1-2)
1. **Define Your Ideal Client**
   - Industry/niche specifics
   - Budget range
   - Project type preferences
   - Red flags to avoid

2. **Create Your Unique Value Proposition**
   - What makes you different?
   - What results do you deliver?
   - What's your superpower?

### Stage 2: Visibility (Week 3-4)
1. **Choose 2 Platforms Max**
   - Where do your ideal clients hang out?
   - LinkedIn, Twitter, industry forums, etc.

2. **Content Pillars**
   - Educational (teach your expertise)
   - Case studies (show results)
   - Behind-the-scenes (build trust)

### Stage 3: Conversion (Week 5-6)
1. **Lead Magnet**
   - Free resource that solves a small problem
   - Demonstrates your expertise

2. **Follow-up Sequence**
   - Day 1: Value delivery
   - Day 3: Additional tip
   - Day 7: Soft pitch

### Stage 4: Referral Loop
1. **Delight Current Clients**
   - Over-deliver on every project
   - Make them look good to their boss

2. **Ask for Referrals**
   - Timing: After positive feedback
   - Script: "Do you know anyone else who might need..."

## Daily Actions
- 1 piece of content (15 min)
- 2 engagement comments (10 min)
- 1 follow-up or outreach (10 min)

## Weekly Review
- Track leads generated
- Conversion rate
- Referral requests sent
    `,
  },
  {
    slug: 'deep-work-rituals',
    title: 'Deep Work Rituals for Freelancers',
    description: 'Master the art of focused work when you don\'t have a boss watching over your shoulder.',
    isFree: false,
    content: `
# Deep Work Rituals for Freelancers

## The Challenge
As a freelancer, you are your own boss, which means you need to create your own structures for deep, focused work.

## The System

### Morning Ritual (30 min)
1. Review today's ONE priority
2. Clear inbox to zero (time-boxed)
3. Set intention for first work block

### Deep Work Blocks
**The 90-Minute Rule**
- Human focus peaks at 90-minute cycles
- Schedule 2-3 blocks per day max
- Take real breaks between blocks

**Environment Setup**
- Phone in another room
- Browser blockers active
- Noise-cancelling headphones
- Water bottle filled

### The Shutdown Ritual (15 min)
1. Log completed work
2. Brain dump tomorrow's tasks
3. Close all work tabs
4. Say "Shutdown complete" out loud

## Troubleshooting

### "I can't focus for 90 minutes"
Start with 25-minute Pomodoros, build up gradually.

### "Clients interrupt me"
Set office hours. Communicate them clearly.

### "I feel guilty taking breaks"
Breaks are productivity tools, not laziness.

## Tracking
- Deep work hours per day
- Interruptions logged
- Quality of work produced
    `,
  },
  {
    slug: 'pricing-power',
    title: 'Pricing Power: Charge What You\'re Worth',
    description: 'Stop undercharging. Learn the psychology and tactics of premium pricing.',
    isFree: false,
    content: `
# Pricing Power

## Why Freelancers Undercharge
- Imposter syndrome
- Fear of losing the client
- Comparing to employee salaries
- Not understanding true costs

## Your True Hourly Rate
Calculate: (Desired Annual Income + Expenses + Taxes + Profit) / Billable Hours

Billable hours are usually only 50-60% of your work time.

## Value-Based Pricing

### The Transformation Framework
Don't sell hours. Sell the transformation.

Before: "I charge $50/hour for copywriting"
After: "I create sales pages that convert at 3-5%, typically generating $50K+ in additional revenue"

### Price Anchoring
Always present your preferred option in the middle:
- Basic: $X
- Standard: $2X (recommended)
- Premium: $4X

## Raising Your Rates

### When to Raise
- You're booked 3+ months out
- You've developed new skills
- Your results have improved
- Market rates have increased

### How to Raise
1. New clients get new rates immediately
2. Existing clients: 30-day notice, 10-20% increase
3. Never apologize for your rates

## Scripts

"My rate for this type of project is $X. Based on what you've described, the investment would be $Y, which includes..."

"I appreciate you thinking of me, but that's below my minimum project rate. I'd be happy to recommend someone who might be a better fit for your budget."
    `,
  },
  {
    slug: 'client-management',
    title: 'Client Management Mastery',
    description: 'Systems for managing multiple clients without dropping balls or losing your mind.',
    isFree: false,
    content: `
# Client Management Mastery

## The Client Lifecycle

### Onboarding (Day 1-7)
1. Welcome email with next steps
2. Kickoff call agenda
3. Access and asset collection
4. Communication preferences established

### Active Project
1. Weekly updates (even if brief)
2. Milestone check-ins
3. Issue escalation path
4. Scope change process

### Offboarding
1. Final deliverables organized
2. Transfer of assets
3. Feedback request
4. Referral ask
5. Door left open for future work

## Communication Framework

### Response Time Commitments
- Urgent: 2 hours
- Normal: 24 hours
- FYI only: 48 hours

### Update Template
Subject: [Project Name] Weekly Update - [Date]

Progress:
- Completed X
- In progress Y

Next Week:
- Planning to Z

Questions/Blockers:
- Need your input on...

### Difficult Conversations
1. State the issue factually
2. Propose a solution
3. Give them options
4. Document everything

## Capacity Management

### The 70% Rule
Never book more than 70% of your available hours. Leave room for:
- Revisions
- Emergencies
- Business development
- Your sanity

### Red Flags to Watch
- Scope creep without compensation
- Payment delays
- Disrespectful communication
- Unrealistic deadlines

## Tools Stack
- Project management: Notion, Asana, or Trello
- Communication: Slack, Email
- Time tracking: Toggl, Harvest
- Contracts: HelloSign, DocuSign
    `,
  },
  {
    slug: 'weekly-planning',
    title: 'The Freelancer\'s Weekly Planning System',
    description: 'A complete system for planning your week to maximize output and minimize stress.',
    isFree: false,
    content: `
# The Freelancer's Weekly Planning System

## Sunday Planning Session (45 min)

### Step 1: Review Last Week (10 min)
- What shipped?
- What slipped?
- Energy levels throughout the week?
- Any patterns to address?

### Step 2: Big Picture Check (5 min)
- Revenue goal: On track?
- Pipeline: Healthy?
- Upcoming deadlines

### Step 3: Weekly Priorities (15 min)
Identify your 3-5 "must do" items:
- 1 Revenue activity
- 2-3 Delivery milestones
- 1 Ops task

### Step 4: Time Blocking (15 min)
- Block deep work first
- Schedule meetings in batches
- Protect buffer time
- Plan recovery time

## Daily Planning (10 min)

### Morning
1. Review today's blocks
2. Set ONE priority
3. Prepare workspace

### Evening
1. Log completed work
2. Capture tomorrow's needs
3. Shut down completely

## The Template

### Weekly Dashboard
| Priority | Due | Status |
|----------|-----|--------|
| [Item]   | Mon | [ ]    |
| [Item]   | Wed | [ ]    |
| [Item]   | Fri | [ ]    |

### Daily Template
**Today's Priority:** _____________
**Deep Work Blocks:**
- [ ] 9-10:30am:
- [ ] 2-3:30pm:

**Must Do:**
- [ ]
- [ ]
- [ ]

**If Time:**
- [ ]
- [ ]

## Troubleshooting

"I never follow my plan"
- Make plans more realistic
- Block less, buffer more
- Review why plans fail

"Everything feels urgent"
- Urgent ≠ Important
- What's the actual deadline?
- Can anything be delegated or declined?
    `,
  },
];

export function getPlaybook(slug: string): Playbook | undefined {
  return PLAYBOOKS.find((p) => p.slug === slug);
}

export function getFreePlaybooks(): Playbook[] {
  return PLAYBOOKS.filter((p) => p.isFree);
}

export function getProPlaybooks(): Playbook[] {
  return PLAYBOOKS.filter((p) => !p.isFree);
}
