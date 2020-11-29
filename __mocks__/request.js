const response = {
  get: {
    'better-player.svg': '<svg></svg>',
  },
};

export default function request({ method = 'get', url }) {
  const mockPromise = {};
  mockPromise.then = resolve => {
    resolve(response[method][url]);
  };
  return mockPromise;
}
