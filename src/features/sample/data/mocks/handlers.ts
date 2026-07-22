import { HttpResponse, http } from 'msw';
import type { CVE } from '../../../../shared/AppServices.types';

const mockCVEs: CVE[] = [
  {
    CVE: 'CVE-2024-12345',
    severity: 'important',
    public_date: '2024-07-15T12:00:00Z',
    bugzilla_description: 'kernel: use-after-free in netfilter subsystem',
    cvss3_score: '7.8',
    CWE: 'CWE-416',
    resource_url:
      'https://access.redhat.com/hydra/rest/securitydata/cve/CVE-2024-12345.json',
  },
  {
    CVE: 'CVE-2024-67890',
    severity: 'moderate',
    public_date: '2024-07-10T08:30:00Z',
    bugzilla_description:
      'openssl: buffer overread in certificate verification',
    cvss3_score: '5.3',
    CWE: 'CWE-125',
    resource_url:
      'https://access.redhat.com/hydra/rest/securitydata/cve/CVE-2024-67890.json',
  },
  {
    CVE: 'CVE-2024-11111',
    severity: 'low',
    public_date: '2024-06-28T14:15:00Z',
    bugzilla_description:
      'glibc: minor information disclosure via locale handling',
    cvss3_score: '3.3',
    CWE: 'CWE-200',
    resource_url:
      'https://access.redhat.com/hydra/rest/securitydata/cve/CVE-2024-11111.json',
  },
];

export const cveHandlers = [
  http.get('https://access.redhat.com/hydra/rest/securitydata/cve.json', () => {
    return HttpResponse.json(mockCVEs);
  }),
];
