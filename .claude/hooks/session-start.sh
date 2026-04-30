#!/bin/bash
set -euo pipefail

DATE=$(date +"%A, %B %-d, %Y")

cat <<EOF
Good morning, Tim! Today is ${DATE}.

MORNING_BRIEFING_REQUESTED: Steve, deliver Tim's daily morning briefing now, per the instructions in CLAUDE.md. Specifically:
1. Pull today's events from Google Calendar (mcp__e7bce002)
2. Check Craft (mcp__515868b1) for any tasks or Rock items due today
3. Search the web for 2-3 headlines: local Atlanta news + top national story
4. If any same-day calendar meetings exist, prepare brief attendee/agenda notes
5. Surface one interesting article or idea worth Tim's attention
6. Add one fitness/lifestyle/gear suggestion (vegetarian-friendly where relevant)

Format the briefing using the template in CLAUDE.md. Keep it scannable — 1-2 bullets per section.
EOF
