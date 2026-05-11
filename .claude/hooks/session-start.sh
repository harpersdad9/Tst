#!/bin/bash
set -euo pipefail

DATE=$(date +"%A, %B %-d, %Y")

cat <<EOF
Good morning, Tim! Today is ${DATE}.

MORNING_BRIEFING_REQUESTED: Steve, deliver Tim's daily morning briefing now, per the instructions in CLAUDE.md. Specifically:
1. Pull today's events from Google Calendar (mcp__e7bce002) in time order
2. Check Craft (mcp__515868b1) daily note for tasks due today and any overdue items
3. Search the web for 3-4 NATIONAL headlines (politics, economy, major stories)
4. Search the web for 3-4 LOCAL ATLANTA headlines
5. If any same-day timed meetings exist, prepare brief attendee/agenda notes
6. Surface one interesting article worth Tim's attention (civic tech, career, culture)
7. Find one Huckberry/Cool Hunting-style gear recommendation — curated, design-forward,
   outdoor/lifestyle/EDC angle. Check for sale pricing or Amazon availability. Include price.
8. Search for 1 quote or mantra from Rich Roll or a Rich Roll Podcast guest (use WebSearch).
   Tie it to Tim's current focus if possible. Attribute it properly.
9. Check both Gmail inboxes via mcp__75a6ea39:
   - Personal: tadkins9@gmail.com
   - Work: tim@goldenvolunteer.com
   Surface top 3-5 critical items per inbox with 🔴/🟡/🟢 priority flags.
   Include in briefing and Craft note. Skip newsletters and noise.

After delivering in chat, append the full briefing to today's Craft daily note using markdown_add with date: today.

Format per CLAUDE.md. Keep it scannable — tight bullets, no walls of text.
EOF
