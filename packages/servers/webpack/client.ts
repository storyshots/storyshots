const source = new EventSource('/__live_reload');

source.addEventListener('message', () => (location.href = '/'));
