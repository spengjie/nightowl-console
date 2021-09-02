// translate router.meta.title, be used in breadcrumb sidebar tagsview
export function translateTitle(title) {
  const key = 'ui.' + title;
  if (this.$te(key)) {
    return this.$t(key);
  }
  return title;
}

export function translateDayOfWeek(days) {
  const DAY_MAP = {
    '0': 'monday',
    '1': 'tuesday',
    '2': 'wednesday',
    '3': 'thursday',
    '4': 'friday',
    '5': 'saturday',
    '6': 'sunday',
  };
  return days.split(',').map(day => {
    const key = 'ui.' + DAY_MAP[day.trim()];
    if (this.$te(key)) {
      return this.$t(key);
    }
  }).join(', ');
}

export function translateLogLevel(level) {
  return ['Debug', 'Info', 'Warning', 'Error', 'Exception'][level];
}
