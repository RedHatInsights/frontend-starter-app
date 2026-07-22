import { Bullseye, Label, Spinner, Title } from '@patternfly/react-core';
import { Table, Tbody, Td, Th, Thead, Tr } from '@patternfly/react-table';
import { useCVEs } from '../data/queries/cves';

const severityColor: Record<string, 'red' | 'orange' | 'blue' | 'grey'> = {
  critical: 'red',
  important: 'red',
  moderate: 'orange',
  low: 'blue',
};

const CVEList = () => {
  const { data: cves, isLoading, error } = useCVEs(5);

  if (isLoading) {
    return (
      <Bullseye>
        <Spinner />
      </Bullseye>
    );
  }

  if (error) {
    return <p>Failed to load CVEs: {(error as Error).message}</p>;
  }

  return (
    <>
      <Title headingLevel="h2" size="xl">
        Recent Red Hat CVEs
      </Title>
      <Table aria-label="Recent CVEs" variant="compact">
        <Thead>
          <Tr>
            <Th>CVE ID</Th>
            <Th>Severity</Th>
            <Th>CVSS Score</Th>
            <Th>Description</Th>
          </Tr>
        </Thead>
        <Tbody>
          {cves?.map((cve) => (
            <Tr key={cve.CVE}>
              <Td dataLabel="CVE ID">{cve.CVE}</Td>
              <Td dataLabel="Severity">
                <Label color={severityColor[cve.severity] ?? 'grey'}>
                  {cve.severity}
                </Label>
              </Td>
              <Td dataLabel="CVSS Score">{cve.cvss3_score ?? '—'}</Td>
              <Td dataLabel="Description">{cve.bugzilla_description}</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </>
  );
};

export default CVEList;
