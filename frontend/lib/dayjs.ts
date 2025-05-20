import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import updateLocale from 'dayjs/plugin/updateLocale';

// Add plugins
dayjs.extend(relativeTime);
dayjs.extend(updateLocale);

// Update locale configuration for consistent formatting
dayjs.updateLocale('en', {
  relativeTime: {
    future: "in %s",
    past: "%s ago",
    s: 'a few seconds',
    m: "a minute",
    mm: "%d minutes",
    h: "an hour",
    hh: "%d hours",
    d: "a day",
    dd: "%d days",
    M: "a month",
    MM: "%d months",
    y: "a year",
    yy: "%d years"
  }
});

export default dayjs;