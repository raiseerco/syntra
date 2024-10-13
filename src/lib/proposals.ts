export const fetchSnapshotProposals = async (
  daoAddress: string,
  tallyOrgId: string,
) => {
  try {
    const response = await fetch(
      `/api/proposals?daoAddress=${daoAddress}&organizationId=${tallyOrgId}`,
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching proposals:', error);
    return [];
  }
};
