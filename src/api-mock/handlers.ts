import { HttpResponse, http } from 'msw';

const mockedUser = {
  data: {
    createdAt: '0001-01-01T00:00:00Z',
    updatedAt: '0001-01-01T00:00:00Z',
    deletedAt: null,
    accountId: '51834776',
    firstLogin: true,
    dayOne: true,
    lastLogin: '2023-01-09T08:19:40.969807Z',
    lastVisitedPages: [
      {
        bundle: 'RHEL',
        pathname:
          '/insights/advisor/recommendations/pathways/sysctl-parameter-tuning',
        title: 'Sysctl parameter tuning - Pathways - Advisor | RHEL',
      },
    ],
    favoritePages: [
      {
        id: 4,
        createdAt: '2023-01-13T12:50:22.095031Z',
        updatedAt: '2023-01-13T12:56:05.377946Z',
        deletedAt: null,
        pathname:
          'https://stage.foo.redhat.com:1337/application-services/api-designer',
        favorite: true,
        userIdentityId: 1,
      },
    ],
    selfReport: {
      createdAt: '0001-01-01T00:00:00Z',
      updatedAt: '0001-01-01T00:00:00Z',
      deletedAt: null,
      productsOfInterest: null,
      jobRole: '',
      userIdentityID: 0,
    },
    visitedBundles: {},
    uiPreview: false,
    uiPreviewSeen: true,
    activeWorkspace: 'default',
  },
};

export const handlers = [
  http.get('/api/chrome-service/v1/user', () => {
    return HttpResponse.json(mockedUser);
  }),
];
